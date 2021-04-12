const { MongoClient } = require("mongodb");
// const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// let plants = require("../data/plants.json");

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

module.exports = { getPlants };
