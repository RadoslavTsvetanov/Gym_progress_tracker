"use client";
import { User, Exercise, Workout, Program, ExercisesData } from "~/utils/types";
import { CookieHandler } from "~/utils/cookie_handler";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";

interface FormData {
  // Define your form data interface if needed
}
function render_workout_exercises_based_on_type(type: string, workouts: Workout[]) {
  const selectedWorkout = workouts.find((workout) => workout.type === type);

  function renderExerciseInputs(exercise: Exercise) {
    const setInputs = [];

    for (let setIndex = 1; setIndex <= exercise.sets; setIndex++) {
      const inputId = `exercise-${exercise.id}-set-${setIndex}`;

      setInputs.push(
        <div key={setIndex}>
          <label htmlFor={inputId}>{`${exercise.name} - Set ${setIndex}`}</label>
          <input
            type="text"
            id={inputId}
            name={inputId}
            // Add value and onChange if you want to manage input state
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement your form submission logic here using formContent state
    console.log("Form submitted with content:", formContent);
  };

  return (
    <div>
      {current_user != undefined && programData.exercises != undefined ? (
        <div>
          <form onSubmit={handleSubmit}>
            <select
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                set_selected_workout(event.target.value);
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
              programData.exercises.program.workouts
            )}
            <button type="submit">Submit</button>
          </form>
          <div>{selectedWorkout}</div>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}
