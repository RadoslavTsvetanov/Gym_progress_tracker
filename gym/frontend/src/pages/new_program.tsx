"use client"
import React, { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import { CookieHandler } from '~/utils/cookie_handler';
import { User } from '~/utils/types';
import Redirector from '~/components/succesful_redirector';
interface Exercise {
  name: string;
  sets: string[];
}

interface unformatted_data {
  program_name: string;
  exercises: Exercise[];
}
function format_program_data(data:unformatted_data){
  const exercises = data.exercises.map((program) => {
    return {
      type: program.name,
      exercises: program.exercises.map((exercise) => {
        return {
          name: exercise.name,
          reps: exercise.sets.length, // Assuming 'sets' represents the number of reps
          sets: exercise.sets.length, // Assuming 'sets' represents the number of sets
        };
      }),
    };
  });

  return {
    program: {
      title: data.program_name,
      workouts: exercises,
    },
  };
}

export default function Workout() {
  const [program_name,set_program_name] = useState<string>('')
  const [user, set_user] = useState<User | undefined>();
  const [workoutDays, setWorkoutDays] = useState([]);
  const send_program = api.post.create_program.useMutation()
  
  useEffect(() => {
    const cookie_handler = new CookieHandler;
    set_user(cookie_handler.extract_cookie('user'))
  }, []);
  const handleNameChange = (event) => {
    // Updating the state with the new value from the input
    set_program_name(event.target.value);
  };
  const handleDayNameChange = (event, index) => {
    const newDays = [...workoutDays];
    newDays[index] = { ...newDays[index], name: event.target.value };
    setWorkoutDays(newDays);
  };

  const handleExerciseNameChange = (event, dayIndex, exerciseIndex) => {
    const newDays = [...workoutDays];
    newDays[dayIndex].exercises[exerciseIndex] = {
      ...newDays[dayIndex].exercises[exerciseIndex],
      name: event.target.value,
    };
    setWorkoutDays(newDays);
  };

  const handleSetChange = (event, dayIndex, exerciseIndex, setIndex) => {
    const newDays = [...workoutDays];
    newDays[dayIndex].exercises[exerciseIndex].sets[setIndex] = event.target.value;
    setWorkoutDays(newDays);
  };

  const addDay = () => {
    const newDays = [...workoutDays, { name: '', exercises: [] }];
    setWorkoutDays(newDays);
  };

  const addExercise = (dayIndex) => {
    const newDays = [...workoutDays];
    newDays[dayIndex].exercises.push({ name: '', sets: [] });
    setWorkoutDays(newDays);
  };

  const addSet = (dayIndex, exerciseIndex) => {
    const newDays = [...workoutDays];
    newDays[dayIndex].exercises[exerciseIndex].sets.push('');
    setWorkoutDays(newDays);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(workoutDays);
    const new_program = format_program_data({
      program_name:program_name,
      exercises:workoutDays
    })
    console.log("new program",new_program)
    // Logic to submit workout routine data
    send_program.mutate((user != undefined && user.username != undefined) ? {username:user.username,token:user.token,program:new_program} : {username:"",token:""}) // for the ts compiler to calm down
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key press
    }
  };
  return (
    <div className="font-sans max-w-screen-md mx-auto">
      {send_program.isSuccess && Redirector("/")}
      {send_program.isLoading ? <div className="fixed top-0 left-0 p-4 bg-white shadow-md w-[80vw] h-[80vh]"></div> : <></>}
      <h1 className="text-center text-3xl font-bold mb-8">Workout Planner</h1>
      {user !== undefined ? (

        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md" onKeyDown={handleKeyPress}>
          <p>Program name</p>
          <input name="name" onChange={handleNameChange}/>
          {workoutDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold mb-4">Day {dayIndex + 1}</h2>
              <input
                type="text"
                value={day.name}
                onChange={(event) => handleDayNameChange(event, dayIndex)}
                placeholder="Enter day name"
                className="w-full p-2 mb-4 rounded border border-gray-300"
              />
              {day.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="mb-4">
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(event) => handleExerciseNameChange(event, dayIndex, exerciseIndex)}
                    placeholder="Enter exercise name"
                    className="w-full p-2 mb-2 rounded border border-gray-300"
                  />
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex mb-2">
                      <input
                        type="text"
                        value={set}
                        onChange={(event) => handleSetChange(event, dayIndex, exerciseIndex, setIndex)}
                        placeholder={`Set ${setIndex + 1}`}
                        className="flex-1 p-2 mr-2 rounded border border-gray-300"
                      />
                    </div>
                  ))}
                  <button onClick={() => addSet(dayIndex, exerciseIndex)} className="bg-gray-300 px-3 py-1 text-sm rounded-md" type="button">Add Set</button>
                </div>
              ))}
              <button onClick={() => addExercise(dayIndex)} className="bg-blue-500 text-white px-4 py-2 rounded-md" type="button">Add Exercise</button>
            </div>
          ))}
          {workoutDays.length === 0 && (
            <div className="text-center mt-4">No workout planned yet.</div>
          )}
          <div className="flex justify-center mt-4">
            <button onClick={addDay} className="bg-green-500 text-white px-4 py-2 mr-2 rounded-md" type="button">Add Day</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
          </div>
        </form>
      ) : (
        <div className="text-center mt-8 text-lg">Loading...</div>
      )}
    </div>
  );
}
