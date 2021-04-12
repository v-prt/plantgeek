// require("dotenv").config();
// const assert = require("assert");
// const fs = require("file-system");
// const { MongoClient } = require("mongodb");
// const { MONGO_URI } = process.env;

// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// const plants = JSON.parse(fs.readFileSync("backend/data/plants.json"));

// const batchImport = async () => {
//   const client = await MongoClient(MONGO_URI, options);

//   try {
//     await client.connect();
//     const db = client.db("plantgeekdb");
//     const result = await db.collection("plants").insertMany(plants);
//     assert.strictEqual(plants.length, result.insertedCount);
//     return console.log("Succesfully added plants to database!");
//   } catch (err) {
//     console.log(err.stack);
//   }

//   client.close();
// };

// batchImport();
