"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSuggestion = exports.getSuggestionsBySlug = exports.getSuggestions = exports.createSuggestion = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const { MongoClient, ObjectId } = mongodb_1.default;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const createSuggestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    const { suggestion, sourceUrl, userId } = req.body;
    const plantId = req.params.plantId;
    const data = {
        plantId,
        userId,
        suggestion,
        sourceUrl,
        dateSubmitted: new Date(),
        status: 'pending',
    };
    try {
        const result = yield db.collection('suggestions').insertOne(data);
        res.status(201).json({ status: 201, data: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();
});
exports.createSuggestion = createSuggestion;
const getSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const suggestions = yield db.collection('suggestions').find().toArray();
        const result = yield Promise.all(suggestions.map((suggestion) => __awaiter(void 0, void 0, void 0, function* () {
            const plant = yield db.collection('plants').findOne({ _id: ObjectId(suggestion.plantId) });
            const user = yield db.collection('users').findOne({ _id: ObjectId(suggestion.userId) });
            return Object.assign(Object.assign({}, suggestion), { plant, user });
        })));
        res.status(200).json({ status: 200, suggestions: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();
});
exports.getSuggestions = getSuggestions;
const getSuggestionsBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    const { slug } = req.params;
    try {
        const plant = yield db.collection('plants').findOne({ slug });
        const plantSuggestions = yield db
            .collection('suggestions')
            .find({ plantId: plant._id.toString() })
            .toArray();
        // find user by userId in each suggestion and include in response
        const result = yield Promise.all(plantSuggestions.map((suggestion) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield db.collection('users').findOne({ _id: ObjectId(suggestion.userId) });
            return Object.assign(Object.assign({}, suggestion), { user });
        })));
        res.status(200).json({ status: 200, suggestions: result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();
});
exports.getSuggestionsBySlug = getSuggestionsBySlug;
const updateSuggestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    const id = req.params.id;
    try {
        const filter = { _id: ObjectId(id) };
        const update = {
            $set: req.body,
        };
        const result = yield db.collection('suggestions').updateOne(filter, update);
        console.log(result);
        res.status(200).json({ status: 200, data: result });
    }
    catch (err) {
        res.status(500).json({ status: 500, data: req.body, message: err.message });
        console.error(err);
    }
    client.close();
});
exports.updateSuggestion = updateSuggestion;
//# sourceMappingURL=suggestionHandlers.js.map