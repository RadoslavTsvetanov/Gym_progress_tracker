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
      throw error;
    }
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
      throw error;
    }
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
      throw error;
    }
  }

  async add_user_workout(workout, username) {
    try {
    } catch (error) {
      console.error("Error adding workout:", error);
      throw error;
    }
  }

  async create_user(username, programJSON) {
    try {
      const newUser = await prisma.user.create({
        data: {
          username,
          program: {
            create: {
              title: programJSON.title,
              workouts: {
                create: programJSON.workouts.map((workout) => ({
                  type: workout.type,
                  exercises: {
                    create: workout.exercises.map((exercise) => ({
                      name: exercise.name,
                      reps: exercise.reps,
                      sets: exercise.sets,
                    })),
                  },
                })),
              },
            },
          },
          progress: {
            create: {
              workouts: [], // Progress can be added separately as needed
            },
          },
        },
        include: {
          program: {
            include: {
              workouts: {
                include: {
                  exercises: true,
                },
              },
            },
          },
          progress: true,
        },
      });

      console.log(
        "New user created with custom program and progress:",
        newUser
      );
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

module.exports = {
  DB,
};
