---
slug: run-postgres-script-on-init
title: Run SQL script on Postgres Container Creating. 
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [ Docker, Postgres, Containers, Images, Unix ]
date: 2025-01-25
---

Hello there! On this post we are going to see how we can run an SQL initial script when starting up a Postgres image.

<!--truncate-->

## Topics
- [Problem Description](#problem-description)
- [Dockerfile and SQL script](#dockerfile-and-sql-script)
- [Build and Run](#build-and-run)
- [Validate the table is there exec](#validate-the-table-exits-exec)
- [Conclusion](#conclusion)


This blog post won't go through what [Docker](https://www.docker.com/) or containerization is, and all images are pulled from [DockerHub](https://www.hub.docker.com/). 


## Problem Description  

### Some Context  
I was recently working on a side project in an attempt to learn a new language and I wanted to build a simple REST API with the language.  
I wanted to use [PostgresSQL](https://www.postgresql.org/) as my SQL database. I was to using the [Postgres Docker image](https://hub.docker.com/_/postgres) to achieve this.  

### The Problem
Then I had a problem: **How can I create tables on container creation so I don't need to manually create tables in the running container** because that would want me to use: `docker exec -it <Postgres-Container-ID> sh` so I can open the container's shell to do this:
```shell title="manual postgres shell"
# In postgres docker conatiner:
psql -U postgres # connect to postgres cli as default user postgres.

#  result of psql -U postgres:
postgres=# 

# manually write postgres queries here...
```  

This would've meant everytime I remove the postgres container with a command like `docker rm <postgres-container-id>` then I will always need to do the creation of my tables AGAIN!! That isn't ideal.   

Lucky for me, the Docker postgres image has a way to run a script on initial creation of the container. Let's see how we can use that to at least always create a container with the desired database tables.  

:::note
The initial run script gets run once when the container is created for the 1st time.  
This means if we update the script we would need to remove/delete the container and rebuild our Dockerfile.  
This isn't ideal for production but good enough for playing around projects. 
:::

## Dockerfile and SQL script.

### The Dockerfile

The Dockerfile we are going to use will be using the Postgres image from DockerHub as the base image and will look like this:  
```dockerfile title="Dockerfile"
FROM postgres:latest

# populate database and password arguments so we don't use the default values.
ENV POSTGRES_DB=initdb
ENV POSTGRES_PASSWORD=initpassword

# copying the sql script into docker-entrypoint-initdb.d to be run when the container is created. 
COPY ./scripts/create-initial-tables-if-not-exists.sql /docker-entrypoint-initdb.d/
```  

The `COPY` instruction is where we copy our script into the image we are building. This will take our sql into the `docker-entrypoint-initdb.d` directory.  
That is the directory which will be inspected on container initial creation.  

The environment variables `POSTGRES_DB` and `POSTGRES_PASSWORD` will be used by postgres to:
- Create a database called initdb (default database is postgres)
- Create a password for the default user in postgres called `postgres`.  

So we are essentially just overriding default values here. You can read up about the default environment variables and what they imply [here](https://hub.docker.com/_/postgres)

### The SQL script
You can store this SQL script anywhere, as long as your Dockerfile will be able to access it. I store mine in the root where I have my Dockerfile.  
It's in a directory that I chose to call `scripts`, this can be any name you like.  
  
The script looks like this:
```sql title="create-initial-tables-if-not-exists.sql"
-- connect to initdb that will be created by our Dockerfile
\c initdb;

-- Create init_user table in the initdb database
CREATE TABLE IF NOT EXISTS init_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname VARCHAR(255) NOT NULL,
    surname TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```  

The script connects to the `initdb` database using `\c initdb` the command `\c` is a Postgres command to connect to a database.
We then create a simple `init_user` table in the database named `initdb` that we specified as the `POSTGRES_DB` environment variable.  


## Build and Run

### Building the image
To build our Dockerfile we simply go:  
```bash title="build dockerfile"
# build dockerfile (assuming the shell is open in the same directory as the Dockerfile):
docker build .

# tag image for ease of reading 
docker tag <built-image-id> localhost/init_postgres
```

You can find the `built-image-id` by running `docker images` and then copying the latest built image.  
Now that the image is built, we can then use it to create a container i.e. an instance of the image.  

### Running the Image (Creating the container):
To run the container it's as simple as doing a `docker run`, here's how:
```bash title="run docker image"
# docker run will create a new container from this built image
docker run localhost/init_postgres
```
This will create your container and you will see postgres logs. Then look for log lines like these:  
```bash title="docker run output"
server started
CREATE DATABASE


/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/create-initial-tables-if-not-exists.sql
You are now connected to database "initdb" as user "postgres".
CREATE TABLE
```  
From these lines we can see that we connected to the `initdb` database as the default user (postgres).  
Another cool thing is we can see the line:   
`/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/create-initial-tables-if-not-exists.sql`  
which validates that our script is ran.  

## Validate the table exits (exec).

At this point we can rest assured that our database is created but how do we validate? We can `exec` into the running container.  
To `exec` into the container allows us to go into the running container and do some tasks like checking logs, filesystem and even run some Postgres CLI commands.  

First we need to get the created container's id by running: `docker ps` then we can see something like this:
```bash title="output of docker ps"
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS         PORTS      NAMES
496a74be5e61   localhost/init_postgres   "docker-entrypoint.s…"   7 minutes ago   Up 7 minutes   5432/tcp   loving_leavitt
```

Then copy the the `CONTAINER ID` then run the exec command: `docker exec -it 496a74be5e61 sh`. This opens a shell/terminal in the container we then need.  
After this we will be in the container, then we need to login as the default user (postres) to the Postgres CLI in the container using the command: `psql -U postgres`  
  
This will open a CLI with a prefix: `postgres=#` then we can run the following commands to connect and view the table  
```bash title="terminal in the container"
# connect to the initdb database
postgres=# \c initdb

# list all tables:
postgres=# \dt

# result of the table list operation:
           List of relations
 Schema |   Name    | Type  |  Owner   
--------+-----------+-------+----------
 public | init_user | table | postgres
(1 row)

```  
From here we can see that the table was created and we can work with it however we want. You can type `exit` into your terminal until you exit both postgres CLI and the container's shell.  

:::warning
After you are done playing around clean up by deleting uneeded images and containers. I usually go:  
- stop running container: `sudo docker stop loving_leavitt` => I got loving_leavit from `NAMES` prop of docker ps result
- delete all conatiners: `sudo docker rm $(sudo docker ps -aq)`=> This deletes all containers. You can just remove yours if you still have containers you want keep.
- delete uneeded image: `sudo docker rmi localhost/init_postgres` => deletes the image we built. We can always build it back if we need it.
:::

## Conclusion.
On this blog post we pretended to understand how we can use the Postgres docker image to create tables on initial creation of a container.  
This is helpful for situation where we want to create a table every time we want create a container and we don't want to do it manually.  
**REMINDER: THIS IS USEFUL FOR PLAYING AROUND PROJECTS OR LOCAL INSTANCES FOR LOCAL DEVELOPMENT** as it doesn't scale.  
If we add more tables or columns we will need to rebuild and re-run the image thus lossing data that we already have in the database container.  

With that being said, keep pretending until you are not, until the next time!