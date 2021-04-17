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

// (CREATE/POST) ADD A NEW USER TO DATABASE
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

// (READ/POST) AUTHENTICATE USER
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
      } else {
        res.status(403).json({ status: 403, message: "Incorrect password" });
      }
    } else {
      res.status(401).json({ status: 401, message: "Incorrect username" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

// (READ/GET) GETS ALL USERS IN DATABASE
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

// (UPDATE/PUT) UPDATE A USER'S DATA
const updateUserCollection = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const username = req.params.username;
  try {
    await client.connect();
    const db = client.db("plantgeekdb");
    const users = db.collection("users");
    const filter = { username: username };
    const updateDoc = {
      $set: {
        collection: [req.body.collection],
      },
    };
    const result = await users.updateOne(filter, updateDoc);
    res.status(200).json({
      status: 200,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message });
  }
  client.close();
};

const updateUserFavorites = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const username = req.params.username;
  try {
    await client.connect();
    const db = client.db("plantgeekdb");
    const users = db.collection("users");
    const filter = { username: username };
    const updateDoc = {
      $set: {
        favorites: [req.body.favorites],
      },
    };
    const result = await users.updateOne(filter, updateDoc);
    res.status(200).json({
      status: 200,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message });
  }
  client.close();
};

const updateUserWishlist = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const username = req.params.username;
  try {
    await client.connect();
    const db = client.db("plantgeekdb");
    const users = db.collection("users");
    const filter = { username: username };
    const updateDoc = {
      $set: {
        wishlist: [req.body.wishlist],
      },
    };
    const result = await users.updateOne(filter, updateDoc);
    res.status(200).json({
      status: 200,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message });
  }
  client.close();
};

// TODO: (DELETE)

module.exports = {
  createUser,
  authenticateUser,
  getUsers,
  updateUserCollection,
  updateUserFavorites,
  updateUserWishlist,
};
