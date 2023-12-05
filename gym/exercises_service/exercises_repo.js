const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class DB {
  async add_program_to_user(user_name, programJSON) {
    try {
      if (!programJSON) {
        throw new Error(
          "Program JSON is required to add a program to the user."
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          username: user_name,
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

      if (!user) {
        throw new Error("User not found.");
      }

      const updatedUser = await prisma.user.update({
        where: {
          username: user_name,
        },
        data: {
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
        },
      });

      console.log("Program added to the user:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error adding program to user:", error);
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
          program: {
            include: {
              workouts: {
                include: {
                  exercises: true,
                },
              },
            },
          },
        },
      });

      if (!userWithExercises) {
        throw new Error(`User with username ${username} not found`);
      }
      return userWithExercises;
    } catch (error) {
      console.error("Error fetching user exercises:", error);
      throw error;
    }
  }

  async get_user_growth(username) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
        include: {
          progress: true,
        },
      });

      console.dir(user);

      return user.progress;
    } catch (error) {
      console.error(error);
    }
  }

  async add_user_workout(workout, username) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
        include: {
          progress: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const userProgress = user.progress;
      console.dir(userProgress[0].workouts); // dont know why its like that but probably cuz i have not made the progress a detached table but just an array
      console.log("-------------------------------");

      const new_progress = [...userProgress[0].workouts, workout];
      console.dir(new_progress);
      // // Update the workouts field in the Progress model
      const updatedProgress = await prisma.progress.update({
        where: {
          id: userProgress[0].id,
        },
        data: {
          workouts: new_progress,
        },
      });

      return updatedProgress;
    } catch (error) {
      throw new Error(`Error adding workout to progress: ${error.message}`);
    }
  }

  async create_user(username, programJSON) {
    try {
      if (programJSON) {
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
      } else {
        const newUser = await prisma.user.create({
          data: {
            username,
            progress: {
              create: {
                workouts: [], // Progress can be added separately as needed
              },
            },
          },
          include: {
            progress: true,
          },
        });

        console.log("New user created without a custom program:", newUser);
        return newUser;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

module.exports = {
  DB,
};
