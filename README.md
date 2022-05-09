# Parcours Développeur Web - Projet 6

## Backend Installation

You will need to have Node and `npm` installed locally on your machine.
From the `backend` folder, run `npm install`.

## Connecting to MongoDB

You will need to create a `.env` file in the `backend` folder.
That file will include 3 variables :
`JWT_SECRET_TOKEN=cIkqM0vFNsk8m75o`
`DB_USERNAME=mentor`
`DB_PASSWORD=soutenance`
The status of the connection is printed to the console when the server starts: `Connection to MongoDB succeeded` or `Connection to MongoDB failed`.

## Running the server

You can then run the server with `node server` or `nodemon server`.
The server should run on `localhost` with default port `3000`.
When the server starts, the following message is printed `Listening on port 3000`.
