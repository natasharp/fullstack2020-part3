# Full Stack Open 2020 - Part 3

This repository contains exercise solutions for part 3 of the [Full Stack Open 2020](https://fullstackopen.com/en) course from the University of Helsinki.

## Part 3 - [Typescript](https://fullstackopen.com/en/part3)
Part 3 covers creating and deploying REST API in Node.js using Express library and document MongoDB database for saving data. 
This repository contains REST API for manipulating and fetching data about contacts for the phonebook React app from part2.
The phonebook app deployed with Heroku is available [here](https://radiant-dawn-17502.herokuapp.com/).

##Available Scripts

### `npm start`

Starts the server after passing in environmental variables from the .env file

### `npm run dev`

Launches the server in watch mode using the nodemon library. Changes to the code will relaunch the server

### `npm run build:ui`

The script needs to be edited to point to the frontend from part2. It runs the build script and copies over the files to /build directory