"use client"
import Head from "next/head";
import Link from "next/link";
import { CookieHandler } from "~/utils/cookie_handler";
import { api } from "~/utils/api";
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { User, Exercise, Workout, Program } from "~/utils/types"
import { application_url } from "./constant_variables/constants"
import { PreviousWorkout } from "~/components/render_progress_workouts";

interface ExercisesProps {
  has_program: boolean;
  program: object | undefined;
}

interface Program_query {
  data: object;
}

const renderExercises = (program: Program) => {
  return (
    <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {program.program.workouts.map((workout) => (
        <div key={workout.id} className="bg-gray-900 rounded-lg p-6 shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-white">{workout.type}</h3>
          <p className="text-gray-400 mb-4">Program ID: {workout.programId}</p>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-white">Exercises:</h4>
            {workout.exercises.map((exercise) => (
              <div key={exercise.id} className="border-b border-gray-700 py-2">
                <p className="text-sm font-semibold text-gray-400">Exercise ID: {exercise.id}</p>
                <p className="text-gray-300">Name: {exercise.name}</p>
                <p className="text-gray-300">Sets: {exercise.sets}</p>
                <p className="text-gray-300">Reps: {exercise.reps}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

function Exercises({ has_program, program }: ExercisesProps) {
  return (
    <div className="py-12 px-4">
      {has_program ? (
        <div>
          <h1 className="text-4xl font-bold mb-8 text-white">Welcome!</h1>
          {program ? renderExercises(program.exercises) : <></>}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-semibold mb-4 text-white">No Program Available</p>
          <Link href={`${application_url}/new_program`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Create Program
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const renderedTypes = new Set();
  const [user, set_user] = useState<User | undefined>();
  const program: Program_query = api.post.get_exercises.useQuery(user ? { username: user.username, token: user.token } : { username: "" }, {
    enabled: (user != undefined && user.username != undefined)
  });
  const cookie_handler = new CookieHandler();
  const progression = api.post.get_progression.useQuery(user != undefined ? { username: user.username, token: user.token } : { username: "", token: "" });

  useEffect(() => {
    set_user(cookie_handler.extract_cookie('user'))
  }, []);

  const isProgramAvailable = !!program.data && !program.data.error;
  const programData = program.data ? program.data.data : {};

  return (
    <>
      <Head>
        {/* Head content */}
      </Head>

      <main className="bg-gray-800 min-h-screen py-12">
        {user ? (
          <h1 className="text-3xl font-bold mb-4 text-white">HI {user.username}</h1>
        ) : (
          <div>Loading user data...</div>
        )}
        {
          <>
            <div>
              <Exercises has_program={isProgramAvailable} program={programData} />
              {(program.data != undefined) && <Link href={`${application_url}/new_workout`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Enter new workout
              </Link>}
            </div>
            <div>
              <p>your workouts best</p>
              {(progression != undefined && progression.data && progression.data.data != undefined && progression.data.data.progression != undefined) &&
                progression.data.data.progression[0].workouts
                  .slice() // Create a copy to avoid modifying the original array
                  .reverse() // Reverse the array
                  .map((workout: Workout) => {
                    if (!renderedTypes.has(workout.type)) {
                      renderedTypes.add(workout.type);
                      return (
                        <PreviousWorkout
                          key={workout.id}
                          type={workout.type}
                          exercises={progression.data.data}
                        />
                      );
                    }
                    return null; // If type has already been rendered, return null
                  })
              }
            </div>
          </>
        }
      </main>
    </>
  );
}
