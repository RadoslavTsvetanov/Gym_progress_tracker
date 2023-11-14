# Gym_progress_tracker

#Microservice based web application to track your workout progress for exercises and displays growth of progress
why microservice based? 
-Decided to do it that way since i started it as a one big app but my 2GB RAM Monster of laptop died a couple of times, it was hard to debug and the db became too messy
Technologies and techniques used
-DBs -> Mongo (best db ever) and Planetscale (`i wonbt host them since my pc died using postgre)
-Stack -> React, Node and a bit of Nest for cleaning up and redoing the code later
-Techniques -> microservices and a db_bridge between db and backend(if i change a db i will need to change the bridge code and not the actual backend logic) 
