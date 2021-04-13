const { MongoClient, ObjectId } = require("mongodb");
// const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// GETS ALL PLANTS IN DATABASE
const getPlants = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("plantgeekdb");
  const plants = await db.collection("plants").find().toArray();
  if (plants) {
    res.status(200).json({ status: 200, data: plants });
  } else {
    res.status(404).json({ status: 404, message: "Oops, nothing here!" });
  }
  client.close();
};

// GETS PLANT BY ID FROM DATABASE
const getPlant = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.params._id;
  await client.connect();
  const db = client.db("plantgeekdb");
  const plant = await db.collection("plants").findOne({ _id: ObjectId(_id) });
  if (plant) {
    res.status(200).json({ status: 200, data: plant });
  } else {
    res.status(404).json({ status: 404, message: "Oops, nothing here!" });
  }
  client.close();
};

module.exports = { getPlants, getPlant };
