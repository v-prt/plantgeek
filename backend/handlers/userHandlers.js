const { MongoClient, ObjectId } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// (CREATE) ADD A NEW USER TO DATABASE
const createUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("plantgeekdb");
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
    const user = await db.collection("users").insertOne({
      username: req.body.username,
      password: hashedPwd,
      joined: new Date(),
    });
    assert.strictEqual(1, user.insertedCount);
    res.status(201).json({ status: 201, data: user });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }
  client.close();
};

// (READ) GET A SPECIFIED USER FROM DATABASE
const authenticateUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("plantgeekdb");
    const user = await db
      .collection("users")
      .findOne({ username: req.body.username });
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        res.status(200).json({ status: 200, data: user });
        // FIXME: Uncaught (in promise) SyntaxError: Unexpected token W in JSON at position 0
      } else {
        res.status(403).send("Wrong password");
        // res.status(403).json({ status: 403, message: "Incorrect password" });
      }
    } else {
      res.status(401).send("Wrong username");
      // res.status(401).json({ status: 401, message: "Incorrect username" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

// (READ) GETS ALL USERS IN DATABASE
const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("plantgeekdb");
  const users = await db.collection("users").find().toArray();
  if (users) {
    res.status(200).json({ status: 200, data: users });
  } else {
    res.status(404).json({ status: 404, message: "Oops, nothing here!" });
  }
  client.close();
};

// TODO: (UPDATE)

// TODO: (DELETE)

module.exports = { createUser, authenticateUser, getUsers };
