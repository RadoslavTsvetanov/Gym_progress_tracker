# Gym_progress_tracker

#Microservice based web application to track your workout progress for exercises and displays growth of progress

why microservice based?

    Decided to do it that way since i started it as a one big app but my 2GB RAM Monster of laptop died a couple of times, it was hard to debug and the db became too messy

Technologies and techniques used

    DBs:
      Mongo (best db ever)
      Planetscale (`i wonbt host them since my pc died using postgre)
      Mysql (docker container)


      why so much dbs? - well my delicate leptop   becomes very slow when running all the data in one db and since some features doesnt need complex relationships (e.g. the sign up -> so i choose mongo) others need complex schemas for the big amount data(the exercises -> choose planetscale for that) and the notifications tracking need a bit of sql  my pc can handle(mysql)

    Stack:
      React > frontend
      Node > runtime enviroment
      Prisma > for handling complex queries and sql structure
      Nest > and a bit of for cleaning up and redoing the code later
      Python > since i am developing on windows but the containers are run on linux(alpine) I ran into problems with prisma during the build of containers in docker-compose due to the exclusion of the docker ignore i made my own ali express docker compose in py

    Techniques:
        Microservices: Adopted to improve scalability and manage different functionalities independently.
        Database Bridge: Implemented to connect between databases and the backend; allows easier migration by modifying the bridge code rather than the backend logic.

---

#HOW TO START

##with docker
RUN the RUN_DOCKER.pu but replace the paths in the <mark>**_commands.json_**</mark>

##without docker

> RUN npm install for each service
>
> > RUN npx prisma db push or prisma migrate where prisma is used
> >
> > > RUN npm start for each service



#Motivation for the project
    
    Working in "huge" (for me) codebases
    Getting experience with complex sql rellationships and ORMs for safety ( a big weakness for me since I have always worked with NoSQL)
    Learning basic docker concepts 
    Learning to deploy an app
    Tracking my workouts
