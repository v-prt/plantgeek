// yarn dev to start development server

"use strict"; // helps write more secure javascript

const express = require("express");
const morgan = require("morgan"); // logs request on the terminal (example: Get /users 100ms 200)

// HANDLERS
const { getUsers } = require("./handlers/userHandlers");
const { getPlants } = require("./handlers/plantHandlers");

const PORT = 4000;

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE, PATCH"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.json())

  // ENDPOINTS
  .get("/users", getUsers)
  .get("/plants", getPlants)

  // CATCH-ALL ENDPOINT
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "Oops, nothing here!",
    });
  })

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));