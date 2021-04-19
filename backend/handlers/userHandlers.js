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

// (UPDATE/PUT) ADD A PLANT TO USER'S DATA
const addPlantToUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const username = req.params.username;
  try {
    await client.connect();
    const db = client.db("plantgeekdb");
    const users = db.collection("users");
    const filter = { username: username };
    let update = undefined;
    if (req.body.collection) {
      update = {
        $push: {
          collection: req.body.collection,
        },
      };
    } else if (req.body.favorites) {
      update = {
        $push: {
          favorites: req.body.favorites,
        },
      };
    } else if (req.body.wishlist) {
      update = {
        $push: {
          wishlist: req.body.wishlist,
        },
      };
    }
    const result = await users.updateOne(filter, update);
    res.status(200).json({
      status: 200,
      message: `${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`,
    });
    console.log(
      `${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`
    );
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message });
  }
  client.close();
};

// (UPDATE/PUT) REMOVE A PLANT FROM USER'S DATA
const removePlantFromUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const username = req.params.username;
  try {
    await client.connect();
    const db = client.db("plantgeekdb");
    const users = db.collection("users");
    const filter = { username: username };
    let update = undefined;
    if (req.body.collection) {
      update = {
        $pull: {
          collection: req.body.collection,
        },
      };
    } else if (req.body.favorites) {
      update = {
        $pull: {
          favorites: req.body.favorites,
        },
      };
    } else if (req.body.wishlist) {
      update = {
        $pull: {
          wishlist: req.body.wishlist,
        },
      };
    }
    const result = await users.updateOne(filter, update);
    res.status(200).json({
      status: 200,
      message: `${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`,
    });
    console.log(
      `${result.matchedCount} user(s) matched the filter, updated ${result.modifiedCount} user(s)`
    );
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message });
  }
  client.close();
};

// TODO: (DELETE) REMOVE A USER FROM DB

module.exports = {
  createUser,
  authenticateUser,
  getUsers,
  addPlantToUser,
  removePlantFromUser,
};
