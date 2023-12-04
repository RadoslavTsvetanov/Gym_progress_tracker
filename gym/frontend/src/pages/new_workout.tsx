"use client";
import { User, Exercise, Workout, Program, ExercisesData } from "~/utils/types";
import { CookieHandler } from "~/utils/cookie_handler";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { Helper_functions } from "~/utils/helper_functions";
interface FormData {
  // Define your form data interface if needed
}
interface Workout_component_props{
    type: string,
    exercises:object
}
function previous_workout(workout:Workout_component_props){
    return (
        <div>
            {workout.type}
        </div >
    )
}



function render_workout_exercises_based_on_type(type: string, workouts: Workout[], handle_change: void) {
  const selectedWorkout = workouts.find((workout) => workout.type === type);

  function renderExerciseInputs(exercise: Exercise) {
    const setInputs = [];

    for (let setIndex = 1; setIndex <= exercise.sets; setIndex++) {
      const inputId = `${exercise.name}-${setIndex}`;

      setInputs.push(
        <div key={setIndex}>
          <label htmlFor={inputId}>{`${exercise.name} - Set ${setIndex}`}</label>
          <input
            type="text"
            id={inputId}
            name={inputId}
            // Add value and onChange if you want to manage input state
            onChange={handle_change}
          />
        </div>
      );
    }

    return setInputs;
  }

  return (
    <>
      {selectedWorkout &&
        selectedWorkout.exercises.map((exercise) => renderExerciseInputs(exercise))}
    </>
  );
}


export default function Workout() {
    const [selectedWorkout, set_selected_workout] = useState<string>("");
  const [formContent, setFormContent] = useState<FormData>({});
  const cookie_handler = new CookieHandler();
  const [current_user, set_user] = useState<User | undefined>();
  const [workouts, set_workouts] = useState<Workout[] | undefined>(undefined);
  const exercises: ExercisesData = api.post.get_exercises.useQuery(
    current_user != undefined ? { username: current_user.username, token: current_user.token } : { username: "", token: "" }
  );

  useEffect(() => {
    const cookie: string | boolean = cookie_handler.checkForCookie("user");
    cookie_handler.redirectToLoginIfNoCookie(cookie);

    if (typeof cookie === "string") {
      const currentUser: User | undefined = cookie_handler.parseCookieToUser(cookie);
      set_user(currentUser);
      // set_workouts()
    } //TODO later to be merged into just two functions - the whole functionality in the useEffect
  }, []);

  const programData = exercises.data ? exercises.data.data : {};

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

    const handleSubmit = (event: React.FormEvent) => {
        const helper = new Helper_functions; 
        
        const format_exercises = helper.format_json(formContent)
    event.preventDefault();
      let data_to_be_sent = {
        type: selectedWorkout,
        exercises: format_exercises
    }
    // Implement your form submission logic here using formContent state
    console.log("Form submitted with content:", data_to_be_sent);
  };

  return (
    <div>
      {current_user != undefined && programData.exercises != undefined ? (
        <div>
          <form onSubmit={handleSubmit}>
            <select
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                set_selected_workout(event.target.value);
                //!clear form content so that data from the old input is clear
                setFormContent({})
              }}
            >
              {programData.exercises.program.workouts.map((workout: Workout) => (
                <option key={workout.id} value={workout.type}>
                  {workout.type} 
                </option>
              ))}
            </select>
            {render_workout_exercises_based_on_type(
              selectedWorkout,
                programData.exercises.program.workouts,
              handleChange 
            )}
            <button type="submit">Submit</button>
          </form>
                  <div>{selectedWorkout}</div>
                  {previous_workout({ type: selectedWorkout, exercises:{}})}
              </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}
