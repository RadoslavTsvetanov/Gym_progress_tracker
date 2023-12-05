
interface PreviousWorkoutComponentProps {
  type: string;
  exercises: object;
}

const PreviousWorkout = (workout: PreviousWorkoutComponentProps) => {
  const workouts_of_type = workout.exercises.progression[0].workouts.filter(Workout => Workout.type === workout.type)
  return (
    <div className="bg-gray-200 p-4 mb-4">
      <h1>__</h1>
      <h2 className="text-lg font-semibold">Previous {workout.type} workout</h2>
      {workouts_of_type.map((exerciseGroup, index) => (
        <div key={index} className="mb-4">
          <h3>{exerciseGroup.type}</h3>
          {exerciseGroup.exercises.map((exercise : Progressed_exercise, idx) => (
            <div key={idx} className="mb-2">
              <h4>{exercise.name}</h4>
              <p>Sets: {exercise.sets.join(", ")}</p>
              <p>Que: {exercise.que.join(", ")}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


export {
PreviousWorkout
}