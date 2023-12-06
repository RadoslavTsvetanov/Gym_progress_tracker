import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { CookieHandler } from '~/utils/cookie_handler';
import { User, Workout, ExercisesData } from '~/utils/types';
import { Helper_functions } from '~/utils/helper_functions';
import { PreviousWorkout } from '~/components/render_progress_workouts';
interface FormData {
  
}
interface Progressed_exercise{
  que: string[],
  sets: string[];
}

function RenderWorkoutExercisesBasedOnType(type: string, workouts: Workout[], handleChange: void) {
  const selectedWorkout = workouts.find((workout) => workout.type === type);

  function renderExerciseInputs(exercise) {
    const setInputs = [];

    for (let setIndex = 1; setIndex <= exercise.sets; setIndex++) {
      const inputId:string = `${exercise.name}-${setIndex}`;

      setInputs.push(
        <div key={setIndex} className="mb-2">
          <label htmlFor={inputId} className="block font-semibold">
            {`${exercise.name} - Set ${setIndex}`}
          </label>
          <input
            type="text"
            id={inputId}
            name={inputId}
            className="border rounded p-2 w-full"
            onChange={handleChange}
              />
              <input
            type="text"
            id={`${exercise.name} que-${setIndex}`}
            name={`${exercise.name} que-${setIndex}`}
            className="border rounded p-2 w-full"
            // Add value and onChange if you want to manage input state
            onChange={handleChange}
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
    current_user != undefined ? { username: current_user.username, token: current_user.token } : { username: '', token: '' }
  );
  const progress = api.post.get_progression.useQuery((current_user != undefined ?{
    username:current_user.username,token:current_user.token,
  } : {username:"",token:""}),{
    enabled:(selectedWorkout != "")
  })
    const send_new_workout = api.post.add_workout.useMutation()
  useEffect(() => {
    const cookie: string | boolean = cookie_handler.checkForCookie('user');
    cookie_handler.redirectToLoginIfNoCookie(cookie);

    if (typeof cookie === 'string') {
      const currentUser: User | undefined = cookie_handler.parseCookieToUser(cookie);
      set_user(currentUser);
      // set_workouts()
    } // TODO later to be merged into just two functions - the whole functionality in the useEffect
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
    event.preventDefault();
    console.log(formContent)
    const helper = new Helper_functions();
    const format_exercises = helper.format_json(formContent);
    event.preventDefault();
    let data_to_be_sent = {
      type: selectedWorkout,
      exercises: format_exercises,
    };
    // Implement your form submission logic here using formContent state
    console.log('Form submitted with content:', data_to_be_sent);
    send_new_workout.mutate(current_user != undefined ?({username: current_user.username, token: current_user.token,workout:data_to_be_sent}) : {})
  };

  return (
    <div className="container mx-auto p-4">
      {send_new_workout.isLoading ? <div className="fixed top-0 left-0 p-4 bg-white shadow-md w-[80vw] h-[80vh]"> sending workout ...</div> : <></>}
      {current_user != undefined && (programData != undefined && programData.exercises != undefined) ? (
        <div>
          <form onSubmit={handleSubmit} className="mb-4">
            <select
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                set_selected_workout(event.target.value);
                //! clear form content so that data from the old input is clear
                setFormContent({});
              }}
              className="border rounded p-2 mr-2"
            >
              {programData.exercises.program.workouts.map((workout: Workout) => (
                <option key={workout.id} value={workout.type}>
                  {workout.type}
                </option>
              ))}
            </select>
            {RenderWorkoutExercisesBasedOnType(selectedWorkout, programData.exercises.program.workouts, handleChange)}
            <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2">
              Submit
            </button>
          </form>
          <div className="mb-4">{selectedWorkout}</div>
          {/* Render previous workout component */}
          {(progress != undefined && progress.data != undefined) ?PreviousWorkout({ type: selectedWorkout, exercises: progress.data.data}) : <></>}
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}
