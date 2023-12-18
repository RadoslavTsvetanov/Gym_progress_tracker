import React from 'react';

interface ProgressedExercise {
  name: string;
  sets: string[];
  que?: string[]; // que is optional
}

interface ExerciseGroup {
  type: string;
  exercises: ProgressedExercise[];
}

interface PreviousWorkoutComponentProps {
  type: string;
  exercises: { progression: { workouts: ExerciseGroup[] } };
  renderAll?: boolean; // renderAll prop is optional
}

const PreviousWorkout: React.FC<PreviousWorkoutComponentProps> = (props) => {
  const { type, exercises, renderAll } = props;
  const workoutProgression = exercises?.progression[0]?.workouts;

  let lastWorkoutOfType: ExerciseGroup | undefined;
  if (type && type !== '') {
    lastWorkoutOfType = workoutProgression?.find(
      (workout) => workout.type === type
    );
  }

  const lastWorkout = lastWorkoutOfType || workoutProgression?.[workoutProgression.length - 1];

  if (!lastWorkout) {
    return <div>No previous workout found.</div>;
  }

  return (
    <div className="bg-gray-900 text-white rounded-md shadow-md p-4 mb-4">
      {workoutProgression && (
        <>
          <h1 className="text-4xl mb-4">Workout Details</h1>
          <h2 className="text-lg font-semibold">Previous {type} workout</h2>
          <div>
            <h3>{lastWorkout.type}</h3>
            {!renderAll ? (
              lastWorkout.exercises.map((exercise: ProgressedExercise, idx) => (
                <div key={idx} className="mb-4">
                  <h4>{exercise.name}</h4>
                  <p className="text-red-400">Sets: {exercise.sets.join(', ')}</p>
                  {exercise.que && (
                    <p className="text-red-400">Que: {exercise.que.join(', ')}</p>
                  )}
                </div>
              ))
            ) : (
              workoutProgression.map((workout: ExerciseGroup, index: number) => (
                <div key={index}>
                  <h3>{workout.type}</h3>
                  {workout.exercises.map((exercise: ProgressedExercise, idx: number) => (
                    <div key={`${index}-${idx}`} className="mb-4">
                      <h4>{exercise.name}</h4>
                      <p className="text-red-400">Sets: {exercise.sets.join(', ')}</p>
                      {exercise.que && (
                        <p className="text-red-400">Que: {exercise.que.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export { PreviousWorkout };
