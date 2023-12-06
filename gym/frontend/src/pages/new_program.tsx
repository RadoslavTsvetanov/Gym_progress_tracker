"use client"
import React, { useState, useEffect } from 'react';

export default function Workout() {
  const [user, setUser] = useState('');
  const [form_data, setFormData] = useState({});
  const [workoutDays, setWorkoutDays] = useState([]);

  useEffect(() => {
    // Code to set user from cookie handler
  }, []);

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
    // Logic to submit workout routine data
  };

  return (
    <div className="font-sans max-w-screen-md mx-auto">
      <h1 className="text-center text-3xl font-bold mb-8">Workout Planner</h1>
      {user !== undefined ? (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
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
                  <button onClick={() => addSet(dayIndex, exerciseIndex)} className="bg-gray-300 px-3 py-1 text-sm rounded-md">Add Set</button>
                </div>
              ))}
              <button onClick={() => addExercise(dayIndex)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Exercise</button>
            </div>
          ))}
          {workoutDays.length === 0 && (
            <div className="text-center mt-4">No workout planned yet.</div>
          )}
          <div className="flex justify-center mt-4">
            <button onClick={addDay} className="bg-green-500 text-white px-4 py-2 mr-2 rounded-md">Add Day</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
          </div>
        </form>
      ) : (
        <div className="text-center mt-8 text-lg">Loading...</div>
      )}
    </div>
  );
}
