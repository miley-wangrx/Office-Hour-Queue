# Office Hour Queue

### Brief

A platform for students to sign up and briefly describe their problem during office hour. The TA can see all the problems and come to each student in turn.

### How to run this project

1. open any terminal, run `docker run -p 127.0.0.1:27017:27017 -d --rm --name mongo mongo:6.0.2` (since MongoDB is containerized by Docker, and docker is configured as global in my laptop)
    
    ![Untitled](README%2040de1f65256b4cb080164084150276be/Untitled.png)
    
2. open MongoDB compass, connect
    
    ![Untitled](README%2040de1f65256b4cb080164084150276be/Untitled%201.png)
    
3. cd to `server/`
4. run `npm run setup` （如果MongoDB Compass has already started, then skip this step）
    
    ![Untitled](README%2040de1f65256b4cb080164084150276be/Untitled%202.png)
    
    Then we can see the query in Mongo:
    
    ![Untitled](README%2040de1f65256b4cb080164084150276be/Untitled%203.png)
    
5. run `npm start` in `/server` and `/ui`