"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MongoClient, ObjectId } = require('mongodb');
const assert = require('assert');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// (CREATE/POST) ADDS A NEW PLANT
const createPlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    const { primaryName } = req.body;
    try {
        const nameTaken = yield db.collection('plants').findOne({
            primaryName: {
                // exact match, case insensitive
                $regex: new RegExp(`^${primaryName}$`, 'i'),
            },
        });
        if (nameTaken) {
            return res.status(400).json({ message: 'A plant already exists with this botanical name.' });
        }
        else {
            const plant = yield db.collection('plants').insertOne(req.body);
            return res.status(201).json({ status: 201, plant: plant.ops[0] });
        }
    }
    catch (err) {
        console.error(err.stack);
        res.status(500).json({ message: 'Sorry, something went wrong.' });
    }
    client.close();
});
// (READ/GET) GETS ALL PLANTS
const getPlants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, sort, light, water, temperature, humidity, toxicity, review } = req.query;
    let filters = {};
    if (search) {
        const regex = search.map(str => new RegExp(str, 'i'));
        filters = Object.assign(Object.assign({}, filters), { $or: [{ primaryName: { $in: regex } }, { secondaryName: { $in: regex } }] });
    }
    if (light) {
        if (light === 'unknown') {
            filters = Object.assign(Object.assign({}, filters), { $or: [{ light: null }, { light: { $exists: false } }] });
        }
        else {
            filters = Object.assign(Object.assign({}, filters), { light });
        }
    }
    if (water) {
        if (water === 'unknown') {
            filters = Object.assign(Object.assign({}, filters), { $or: [{ water: null }, { water: { $exists: false } }] });
        }
        else {
            filters = Object.assign(Object.assign({}, filters), { water });
        }
    }
    if (temperature) {
        if (temperature === 'unknown') {
            filters = Object.assign(Object.assign({}, filters), { $or: [{ temperature: null }, { temperature: { $exists: false } }] });
        }
        else {
            filters = Object.assign(Object.assign({}, filters), { temperature });
        }
    }
    if (humidity) {
        if (humidity === 'unknown') {
            filters = Object.assign(Object.assign({}, filters), { $or: [{ humidity: null }, { humidity: { $exists: false } }] });
        }
        else {
            filters = Object.assign(Object.assign({}, filters), { humidity });
        }
    }
    if (toxicity === 'toxic') {
        filters = Object.assign(Object.assign({}, filters), { toxic: true });
    }
    else if (toxicity === 'nontoxic') {
        filters = Object.assign(Object.assign({}, filters), { toxic: false });
    }
    else if (toxicity === 'unknown') {
        filters = Object.assign(Object.assign({}, filters), { $or: [{ toxic: null }, { toxic: { $exists: false } }] });
    }
    if (review) {
        filters = Object.assign(Object.assign({}, filters), { review });
    }
    else {
        filters = Object.assign(Object.assign({}, filters), { $and: [{ review: { $ne: 'pending' } }, { review: { $ne: 'rejected' } }] });
    }
    let order;
    if (sort) {
        if (sort === 'name-asc') {
            order = { primaryName: 1 };
        }
        else if (sort === 'name-desc') {
            order = { primaryName: -1 };
        }
        else if (sort === 'most-hearts') {
            order = {
                hearts: -1,
            };
        }
        else if (sort === 'most-owned') {
            order = {
                owned: -1,
            };
        }
        else if (sort === 'most-wanted') {
            order = {
                wanted: -1,
            };
        }
    }
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        // pagination
        const page = req.params.page ? parseInt(req.params.page) : 1;
        const resultsPerPage = 24;
        const plants = yield db
            .collection('plants')
            .find(filters)
            .sort(order)
            .collation({ locale: 'en' })
            .skip(resultsPerPage * (page - 1))
            .limit(resultsPerPage)
            .toArray();
        const totalResults = yield db.collection('plants').countDocuments(filters);
        if (plants) {
            res.status(200).json({
                plants: plants,
                page: page,
                totalResults,
                nextCursor: totalResults > 24 * page ? page + 1 : null,
            });
        }
        else {
            res.status(404).json({ status: 404, message: 'No plants found.' });
        }
    }
    catch (err) {
        console.error(err);
    }
    client.close();
});
const getPlantsToReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const plants = yield db.collection('plants').find({ review: 'pending' }).toArray();
        if (plants) {
            res.status(200).json({ status: 200, plants: plants });
        }
        else {
            res.status(404).json({ status: 404, message: 'No plants found.' });
        }
    }
    catch (err) {
        console.error(err);
    }
    client.close();
});
// (READ/GET) GETS PLANT BY ID
const getPlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const plant = yield db.collection('plants').findOne({
            slug,
        });
        if (plant) {
            res.status(200).json({ status: 200, plant });
        }
        else {
            res.status(404).json({ status: 404, message: 'Plant not found.' });
        }
    }
    catch (err) {
        console.error(err);
    }
    client.close();
});
const getSimilarPlants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const plant = yield db.collection('plants').findOne({
            slug,
        });
        if (plant) {
            const regex = plant.primaryName
                // take words from plant's primary name
                .split(' ')
                // remove special characters
                .map(word => word.replace(/[^a-zA-Z ]/g, ''))
                // create case insensitive regex with word boundaries
                .map(word => new RegExp(`\\b${word}\\b`, 'i'));
            let filters = {
                // not this plant
                _id: { $ne: ObjectId(plant._id) },
                primaryName: { $in: regex },
            };
            const similarPlants = yield db.collection('plants').find(filters).limit(6).toArray();
            res.status(200).json({ status: 200, similarPlants: similarPlants });
        }
        else {
            res.status(404).json({ status: 404, message: 'Plant not found.' });
        }
    }
    catch (err) {
        console.error(err);
    }
    client.close();
});
const getRandomPlants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const plants = yield db
            .collection('plants')
            .aggregate([{ $sample: { size: 6 } }])
            .toArray();
        if (plants) {
            res.status(200).json({ status: 200, plants: plants });
        }
        else {
            res.status(404).json({ status: 404, message: 'No plants found.' });
        }
    }
    catch (err) {
        console.error(err);
    }
    client.close();
});
const getUserPlants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.query;
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        if (ids && ids.length > 0) {
            const objectIds = ids.map(id => ObjectId(id));
            const plants = yield db
                .collection('plants')
                .find({ _id: { $in: objectIds } })
                .toArray();
            if (plants) {
                res.status(200).json({ status: 200, plants: plants });
            }
            else {
                res.status(404).json({ status: 404, message: 'No plants found.' });
            }
        }
        else {
            res.status(200).json({ plants: [] });
        }
    }
    catch (err) {
        console.error(err);
    }
    client.close();
});
const getUserContributions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const contributions = yield db
            .collection('plants')
            .find({ contributorId: req.params.userId })
            .toArray();
        if (contributions) {
            res.status(200).json({ status: 200, contributions: contributions });
        }
        else {
            res.status(404).json({ status: 404, message: 'No contributions found.' });
        }
    }
    catch (err) {
        console.error(err);
    }
    client.close();
});
// (UPDATE/PUT) ADDS COMMENT TO A PLANT BY ID
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    const { id } = req.params;
    try {
        yield client.connect();
        const db = client.db('plantgeekdb');
        const plants = db.collection('plants');
        const filter = { _id: ObjectId(id) };
        let update = undefined;
        if (req.body.comments) {
            update = {
                $push: {
                    comments: req.body.comments,
                },
            };
        }
        const result = yield plants.updateOne(filter, update);
        res.status(200).json({
            status: 200,
            message: `${result.matchedCount} plant(s) matched the filter, updated ${result.modifiedCount} plant(s)`,
        });
    }
    catch (err) {
        res.status(404).json({ status: 404, message: err.message });
        console.error(err.stack);
    }
    client.close();
});
const updatePlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    const { id } = req.params;
    try {
        // prevent updating primaryName if already taken (should be unique)
        const { primaryName } = req.body;
        if (primaryName) {
            const nameTaken = yield db.collection('plants').findOne({
                primaryName: {
                    // exact match, case insensitive
                    $regex: new RegExp(`^${primaryName}$`, 'i'),
                },
                _id: { $ne: ObjectId(id) },
            });
            if (nameTaken) {
                return res
                    .status(400)
                    .json({ status: 400, message: 'A plant already exists with this botanical name.' });
            }
        }
        const filter = { _id: ObjectId(id) };
        const update = {
            $set: req.body,
        };
        yield db.collection('plants').updateOne(filter, update);
        res.status(200).json({ status: 200, message: 'Plant updated.' });
    }
    catch (err) {
        res.status(500).json({ status: 500, message: 'Sorry, something went wrong.' });
        console.error(err);
    }
    client.close();
});
const deletePlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    const { id } = req.params;
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const filter = { _id: ObjectId(id) };
        const result = yield db.collection('plants').deleteOne(filter);
        // find and remove plant id from users' collections and wishlists
        yield db.collection('users').updateMany({}, {
            $pull: {
                wishlist: id,
                collection: id,
            },
        });
        res.status(200).json({ status: 200, data: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();
});
// taking all plants and saving images to cloudinary, then updating the plant with the cloudinary image url
// const uploadToCloudinary = async () => {
//   const client = await MongoClient(MONGO_URI, options)
//   await client.connect()
//   const db = client.db('plantgeekdb')
//   try {
//     // finding plants where imageUrl includes 'shopify'
//     const plants = await db
//       .collection('plants')
//       .find({ imageUrl: { $regex: 'shopify' } })
//       .toArray()
//     if (plants) {
//       const cloudinary = require('cloudinary').v2
//       cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_KEY,
//         api_secret: process.env.CLOUDINARY_SECRET,
//       })
//       let plantsUpdated = 0
//       const promises = plants.map(async plant => {
//         try {
//           const url = `https://${plant.imageUrl}`
//           const res = await cloudinary.uploader.upload(url, {
//             folder: 'plantgeek-plants',
//           })
//           // updating plant with new image url
//           const filter = { _id: ObjectId(plant._id) }
//           const update = {
//             $set: {
//               imageUrl: res.secure_url,
//             },
//           }
//           await db.collection('plants').updateOne(filter, update)
//           plantsUpdated++
//         } catch (err) {
//           console.error('error uploading to cloudinary', err)
//         }
//       })
//       await Promise.all(promises)
//       console.log('done with image upload', 'plants updated: ', plantsUpdated)
//     } else {
//       console.log('no plants found with shopify image url')
//     }
//   } catch (err) {
//     console.error('error with image upload', err)
//   }
//   client.close()
// }
// const importPlantData = async () => {
//   // for each plant in json file, check if plant already exists in db by primaryName and secondaryName
//   const cloudinary = require('cloudinary').v2
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET,
//   })
//   const client = await MongoClient(MONGO_URI, options)
//   await client.connect()
//   const db = client.db('plantgeekdb')
//   try {
//     const plants = await db.collection('plants').find().toArray()
//     let existingPlants = 0
//     let newPlants = 0
//     const promises = plantData.map(async plant => {
//       const plantExists = plants.find(
//         p =>
//           p.primaryName.toLowerCase() === plant.primaryName.toLowerCase() ||
//           p.secondaryName.toLowerCase() === plant.secondaryName.toLowerCase() ||
//           p.primaryName.toLowerCase() === plant.secondaryName.toLowerCase() ||
//           p.secondaryName.toLowerCase() === plant.primaryName.toLowerCase()
//       )
//       // if it's new, upload image by imageUrl to cloudinary and change the imageUrl to the cloudinary url
//       if (!plantExists) {
//         try {
//           const url = plant.imageUrl
//           const result = await cloudinary.uploader.upload(url, {
//             folder: 'plantgeek-plants',
//           })
//           plant.imageUrl = result.secure_url
//         } catch (err) {
//           console.error('Error uploading image to cloudinary', err)
//         }
//         // add plant to db
//         await db.collection('plants').insertOne(plant)
//         console.log('plant imported', plant.primaryName)
//         newPlants++
//       } else {
//         console.log('plant already exists', plant.primaryName)
//         existingPlants++
//       }
//     })
//     await Promise.all(promises)
//     console.log('done', `existing plants: ${existingPlants}`, `new plants: ${newPlants}`)
//   } catch (err) {
//     console.error('Error importing plant data', err)
//   }
//   client.close()
// }
// const getSearchTerms = async (req, res) => {
//   // get 25 most common unique words from plant names in db
//   const client = await MongoClient(MONGO_URI, options)
//   await client.connect()
//   const db = client.db('plantgeekdb')
//   try {
//     // ignore plants that are pending or rejected
//     filters = {
//       $and: [{ review: { $ne: 'pending' } }, { review: { $ne: 'rejected' } }],
//     }
//     const plants = await db.collection('plants').find(filters).toArray()
//     const words = plants
//       .map(plant => {
//         const primaryName = plant.primaryName.split(' ')
//         const secondaryName = plant.secondaryName.split(' ')
//         return [...primaryName, ...secondaryName]
//       })
//       // remove short words or words with special characters
//       .flat()
//       .filter(
//         word =>
//           word.length > 2 &&
//           !word.includes("'") &&
//           !word.includes('(') &&
//           !word.includes(')') &&
//           // ignore common words & colors
//           word.toLowerCase() !== 'plant' &&
//           word.toLowerCase() !== 'green' &&
//           word.toLowerCase() !== 'blue' &&
//           word.toLowerCase() !== 'red' &&
//           word.toLowerCase() !== 'yellow' &&
//           word.toLowerCase() !== 'orange' &&
//           word.toLowerCase() !== 'purple' &&
//           word.toLowerCase() !== 'pink' &&
//           word.toLowerCase() !== 'white' &&
//           word.toLowerCase() !== 'black' &&
//           word.toLowerCase() !== 'brown' &&
//           word.toLowerCase() !== 'grey' &&
//           word.toLowerCase() !== 'gray' &&
//           word.toLowerCase() !== 'gold' &&
//           word.toLowerCase() !== 'silver'
//       )
//     // count and set the number of times each word appears
//     const wordCounts = {}
//     words.forEach(word => {
//       if (wordCounts[word]) {
//         wordCounts[word]++
//       } else wordCounts[word] = 1
//     })
//     // for admin
//     // remove duplicates
//     // const uniqueWords = [...new Set(words)]
//     // sort words alphabetically
//     // const sortedWords = uniqueWords.sort((a, b) => a.localeCompare(b))
//     // sort words by order of frequency from most to least
//     const sortedWords = Object.keys(wordCounts)
//       .sort((a, b) => {
//         return wordCounts[b] - wordCounts[a]
//       })
//       .filter(
//         // remove words with less than 4 occurrences
//         word => wordCounts[word] > 3
//       )
//       .map(word => word.toLowerCase())
//       // return top 25 words
//       .slice(0, 25)
//     res.status(200).json({ status: 200, data: sortedWords, totalResults: sortedWords.length })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ status: 500, data: req.body, message: err.message })
//   }
//   client.close()
// }
// const getFilterValues = async (req, res) => {
//   const client = await MongoClient(MONGO_URI, options)
//   await client.connect()
//   const db = client.db('plantgeekdb')
//   try {
//     const plants = await db.collection('plants').find().toArray()
//     const lightValues = plants
//       .map(plant => plant.light || 'unknown')
//       .sort((a, b) => a.localeCompare(b))
//     const waterValues = plants
//       .map(plant => plant.water || 'unknown')
//       .sort((a, b) => a.localeCompare(b))
//     const temperatureValues = plants
//       .map(plant => plant.temperature || 'unknown')
//       .sort((a, b) => a.localeCompare(b))
//     const humidityValues = plants
//       .map(plant => plant.humidity || 'unknown')
//       .sort((a, b) => a.localeCompare(b))
//     const filterValues = {
//       light: [...new Set(lightValues)],
//       water: [...new Set(waterValues)],
//       temperature: [...new Set(temperatureValues)],
//       humidity: [...new Set(humidityValues)],
//     }
//     res.status(200).json({ status: 200, data: filterValues })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ status: 500, data: req.body, message: err.message })
//   }
//   client.close()
// }
module.exports = {
    createPlant,
    getPlants,
    getPlantsToReview,
    getPlant,
    getSimilarPlants,
    getRandomPlants,
    getUserPlants,
    getUserContributions,
    addComment,
    updatePlant,
    deletePlant,
};
//# sourceMappingURL=plantHandlers.js.map