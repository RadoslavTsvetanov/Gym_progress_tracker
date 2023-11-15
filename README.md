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

    Techniques:
        Microservices: Adopted to improve scalability and manage different functionalities independently.
        Database Bridge: Implemented to connect between databases and the backend; allows easier migration by modifying the bridge code rather than the backend logic.

