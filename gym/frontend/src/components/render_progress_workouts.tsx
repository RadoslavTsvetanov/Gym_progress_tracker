import React from 'react';

interface ProgressedExercise {
  name: string;
  sets: string[];
  que: string[];
}

interface ExerciseGroup {
  type: string;
  exercises: ProgressedExercise[];
}

interface PreviousWorkoutComponentProps {
  type: string;
  exercises: { progression: { workouts: ExerciseGroup[] } };
}

const PreviousWorkout: React.FC<PreviousWorkoutComponentProps> = (props) => {
  const { type, exercises } = props;
  const workoutProgression = exercises.progression[0].workouts;

  let lastWorkoutOfType: ExerciseGroup | undefined;
  if (type && type !== '') {
    lastWorkoutOfType = workoutProgression.find(
      (workout) => workout.type === type
    );
  }

  const lastWorkout = lastWorkoutOfType || workoutProgression[workoutProgression.length - 1];

  if (!lastWorkout) {
    return <div>No previous workout found.</div>;
  }

  return (
    <div className="bg-gray-200 p-4 mb-4">
      <h1>__</h1>
      <h2 className="text-lg font-semibold">Previous {type} workout</h2>
      <div>
        <h3>{lastWorkout.type}</h3>
        {lastWorkout.exercises.map((exercise: ProgressedExercise, idx) => (
          <div key={idx} className="mb-2">
            <h4>{exercise.name}</h4>
            <p>Sets: {exercise.sets.join(', ')}</p>
            <p>Que: {exercise.que.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PreviousWorkout };
