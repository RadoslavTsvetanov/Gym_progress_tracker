const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class DB {
  async create_user_exercises(workouts, username) {
    try {
            const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        throw new Error(`User with username ${username} not found`);
      }

            const createdExercises = [];
      for (const workout of workouts) {
        const createdExercise = await prisma.exercise_model.create({
          data: {
            name: workout.name,
            sets: workout.sets,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        createdExercises.push(createdExercise);
      }

      console.log(`Exercises created for user ${username}:`, createdExercises);
      return createdExercises;
    } catch (error) {
      console.error("Error creating exercises:", error);
      throw error;     }
  }
  async get_user_exercises(username) {
    try {
            const userWithExercises = await prisma.user.findUnique({
        where: {
          username: username,
        },
        include: {
          exercises: true,
        },
      });

      if (!userWithExercises) {
        throw new Error(`User with username ${username} not found`);
      }

      console.log(
        `Exercises for user ${username}:`,
        userWithExercises.exercises
      );
      return userWithExercises.exercises;
    } catch (error) {
      console.error("Error fetching user exercises:", error);
      throw error;     }
  }

  async get_user_growth(username) {
    try {
            const userWithGrowth = await prisma.user.findUnique({
        where: {
          username: username,
        },
        include: {
          growth: true,
        },
      });

      if (!userWithGrowth) {
        throw new Error(`User with username ${username} not found`);
      }

      console.log(`Growth data for user ${username}:`, userWithGrowth.growth);
      return userWithGrowth.growth;
    } catch (error) {
      console.error("Error fetching user growth data:", error);
      throw error;     }
  }

  async add_user_workout(workout, username) {
    try {
            const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        throw new Error(`User with username ${username} not found`);
      }

            const newWorkout = await prisma.workout.create({
        data: {
          exercises: [],           user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      console.log(`Workout added for user ${username}:`, newWorkout);
      return newWorkout;
    } catch (error) {
      console.error("Error adding workout:", error);
      throw error;     }
  }

  async create_user(username) {
    try {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          exercises: [],
          progress: [],
          growth: [],
        },
      });

      console.log("New user created:", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }
}

module.exports = {
  DB,
};
