const { MongoClient, ObjectId } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

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
    const user = await db.collection("users").insertOne(req.body);
    assert.strictEqual(1, user.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }
  client.close();
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

module.exports = { createUser, getUsers };
