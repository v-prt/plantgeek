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
exports.deleteUser = exports.updateLists = exports.updateUser = exports.getCollection = exports.getWishlist = exports.getUser = exports.getUsers = exports.resetPassword = exports.sendPasswordResetCode = exports.verifyEmail = exports.verifyToken = exports.authenticateUser = exports.resendVerificationEmail = exports.createUser = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const { MongoClient, ObjectId } = mongodb_1.default;
const assert_1 = __importDefault(require("assert"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const saltRounds = 10;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
// template for new signups & resending verification email
const EMAIL_VERIFICATION_TEMPLATE_ID = process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID;
// template for when email has changed
const NEW_EMAIL_VERIFICATION_TEMPLATE_ID = process.env.SENDGRID_NEW_EMAIL_VERIFICATION_TEMPLATE_ID;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// (CREATE/POST) ADDS A NEW USER
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const hashedPwd = yield bcrypt_1.default.hash(req.body.password, saltRounds);
        const existingEmail = yield db.collection('users').findOne({
            email: { $regex: new RegExp(`^${req.body.email}$`, 'i') },
        });
        const existingUsername = yield db.collection('users').findOne({
            username: { $regex: new RegExp(`^${req.body.username}$`, 'i') },
        });
        if (existingEmail) {
            res.status(409).json({ status: 409, message: 'That email is already in use' });
        }
        else if (existingUsername) {
            res.status(409).json({ status: 409, message: 'That username is taken' });
        }
        else {
            const code = crypto_1.default.randomBytes(20).toString('hex');
            const user = yield db.collection('users').insertOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
                password: hashedPwd,
                joined: new Date(),
                friends: [],
                collection: [],
                wishlist: [],
                verificationCode: code,
            });
            assert_1.default.strictEqual(1, user.insertedCount);
            const message = {
                personalizations: [
                    {
                        to: {
                            email: req.body.email,
                            name: `${req.body.firstName} ${req.body.lastName}`,
                        },
                        dynamic_template_data: {
                            first_name: req.body.firstName,
                            verification_link: `https://www.plantgeek.co/verify-email/${code}`,
                        },
                    },
                ],
                from: { email: ADMIN_EMAIL, name: 'plantgeek' },
                template_id: EMAIL_VERIFICATION_TEMPLATE_ID,
            };
            yield mail_1.default.send(message).catch(err => { var _a, _b; return console.error((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.errors); });
            res.status(201).json({
                status: 201,
                data: user,
                token: jsonwebtoken_1.default.sign({ userId: user.insertedId }, process.env.TOKEN_SECRET, {
                    expiresIn: '7d',
                }),
            });
        }
    }
    catch (err) {
        res.status(500).json({ status: 500, data: req.body, message: err.message });
        console.error(err.stack);
    }
    client.close();
});
exports.createUser = createUser;
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const code = crypto_1.default.randomBytes(20).toString('hex');
        yield db
            .collection('users')
            .updateOne({ _id: ObjectId(userId) }, { $set: { verificationCode: code } });
        const message = {
            personalizations: [
                {
                    to: {
                        email: req.body.email,
                        name: `${req.body.firstName} ${req.body.lastName}`,
                    },
                    dynamic_template_data: {
                        first_name: req.body.firstName,
                        verification_link: `https://www.plantgeek.co/verify-email/${code}`,
                    },
                },
            ],
            from: { email: ADMIN_EMAIL, name: 'plantgeek' },
            template_id: EMAIL_VERIFICATION_TEMPLATE_ID,
        };
        yield mail_1.default.send(message).catch(err => console.error(err));
        res.status(200).json({ status: 200, message: 'Email sent' });
    }
    catch (err) {
        console.error(err.stack);
        return res.status(500).send('Internal server error');
    }
    client.close();
});
exports.resendVerificationEmail = resendVerificationEmail;
// (READ/POST) AUTHENTICATES USER WHEN LOGGING IN
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    try {
        const db = client.db('plantgeekdb');
        const user = yield db.collection('users').findOne(
        // find by username or email
        {
            $or: [
                { username: { $regex: new RegExp(`^${req.body.username}$`, 'i') } },
                { email: { $regex: new RegExp(`^${req.body.username}$`, 'i') } },
            ],
        });
        if (user) {
            const isValid = yield bcrypt_1.default.compare(req.body.password, user.password);
            if (isValid) {
                client.close();
                return res.status(200).json({
                    // TODO: look into how "expiresIn" works, remove from local storage if expired
                    token: jsonwebtoken_1.default.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '7d' }),
                    data: user,
                });
            }
            else {
                client.close();
                return res.status(403).json({ message: 'Incorrect password' });
            }
        }
        else {
            client.close();
            // FIXME: 404
            return res.status(401).json({ message: 'User not found' });
        }
    }
    catch (err) {
        console.error(err.stack);
        return res.status(500).send('Internal server error');
    }
});
exports.authenticateUser = authenticateUser;
// (READ/POST) VERIFIES JWT TOKEN
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    try {
        yield client.connect();
        const db = client.db('plantgeekdb');
        const verifiedToken = jsonwebtoken_1.default.verify(req.body.token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return false;
            }
            else {
                return decoded.userId;
            }
        });
        if (verifiedToken) {
            try {
                const user = yield db.collection('users').findOne({
                    _id: ObjectId(verifiedToken),
                });
                if (user) {
                    res.status(200).json({ status: 200, user: user });
                }
                else {
                    res.status(404).json({ status: 404, message: 'User not found' });
                }
            }
            catch (err) {
                console.error(err.stack);
                res.status(500).json({ status: 500, message: err.message });
            }
        }
        else {
            res.status(400).json({ status: 400, message: `Token couldn't be verified` });
        }
    }
    catch (err) {
        console.error(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
    client.close();
});
exports.verifyToken = verifyToken;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    const { code } = req.params;
    const { userId } = req.body;
    try {
        const user = yield db.collection('users').findOne({
            _id: ObjectId(userId),
        });
        if (user) {
            if (user.verificationCode === code) {
                yield db
                    .collection('users')
                    .updateOne({ _id: ObjectId(userId) }, { $set: { emailVerified: true, verificationCode: null } });
                res.status(200).json({ status: 200, message: 'Email verified' });
            }
            else {
                res.status(400).json({ status: 400, message: 'Invalid verification link' });
            }
        }
        else {
            res.status(404).json({ status: 404, message: 'User not found' });
        }
    }
    catch (err) {
        console.error(err.stack);
        res.status(500).json({ status: 500, message: err.message });
    }
    client.close();
});
exports.verifyEmail = verifyEmail;
const sendPasswordResetCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    const { email } = req.body;
    try {
        const user = yield db.collection('users').findOne({ email });
        if (user) {
            const code = Math.floor(100000 + Math.random() * 900000);
            const hashedCode = yield bcrypt_1.default.hash(code.toString(), saltRounds);
            yield db.collection('users').updateOne({ email }, { $set: { passwordResetCode: hashedCode } });
            const msg = {
                to: email,
                from: ADMIN_EMAIL,
                subject: 'Recover password on plantgeek',
                text: `Your password reset code is: ${code}`,
                html: `Your password reset code is: <strong>${code}</strong>`,
            };
            mail_1.default
                .send(msg)
                .then(() => {
                res.status(200).json({ message: 'Code sent' });
            })
                .catch(error => {
                console.error(error);
            });
        }
        else {
            res.status(404).json({ message: 'Email not found' });
        }
    }
    catch (err) {
        console.error(err.stack);
        return res.status(500).send('Internal server error');
    }
    client.close();
});
exports.sendPasswordResetCode = sendPasswordResetCode;
// RESET PASSWORD WITH CODE
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    const { email, code, newPassword } = req.body;
    try {
        const user = yield db.collection('users').findOne({ email });
        if (user) {
            const isValid = yield bcrypt_1.default.compare(code.toString(), user.passwordResetCode);
            if (isValid) {
                const hashedPwd = yield bcrypt_1.default.hash(newPassword, saltRounds);
                yield db
                    .collection('users')
                    .updateOne({ email }, { $set: { password: hashedPwd, passwordResetCode: null } });
                res.status(200).json({ message: 'Password changed' });
            }
            else {
                res.status(403).json({ message: 'Incorrect code' });
            }
        }
        else {
            res.status(404).json({ message: 'Email not found' });
        }
    }
    catch (err) {
        console.error(err.stack);
        return res.status(500).send('Internal server error');
    }
    client.close();
});
exports.resetPassword = resetPassword;
// (READ/GET) GETS ALL USERS
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const users = yield db.collection('users').find().toArray();
        if (users) {
            res.status(200).json({ status: 200, data: users });
        }
        else {
            res.status(404).json({ status: 404, message: 'No users found' });
        }
    }
    catch (err) {
        console.error(err);
    }
    client.close();
});
exports.getUsers = getUsers;
// (READ/GET) GETS USER BY ID
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id === 'undefined') {
        return null;
    }
    else {
        const client = yield MongoClient(MONGO_URI, options);
        yield client.connect();
        const db = client.db('plantgeekdb');
        try {
            const user = yield db.collection('users').findOne({ _id: ObjectId(req.params.id) });
            if (user) {
                res.status(200).json({ status: 200, user: user });
            }
            else {
                res.status(404).json({ status: 404, message: 'User not found' });
            }
        }
        catch (err) {
            console.error('Error getting user', err);
        }
        client.close();
    }
});
exports.getUser = getUser;
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.params;
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const user = yield db.collection('users').findOne({ _id: ObjectId(userId) });
        // convert ids in user.wishlist to objectids
        const ids = (_a = user.wishlist) === null || _a === void 0 ? void 0 : _a.map(id => ObjectId(id));
        const wishlist = yield db
            .collection('plants')
            .find({ _id: { $in: ids } })
            .toArray();
        res.status(200).json({ status: 200, wishlist });
    }
    catch (err) {
        console.error('Error getting wishlist', err);
        res.status(500).json({ status: 500, message: 'Internal server error' });
    }
    client.close();
});
exports.getWishlist = getWishlist;
const getCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { userId } = req.params;
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const user = yield db.collection('users').findOne({ _id: ObjectId(userId) });
        // convert ids in user.wishlist to objectids
        const ids = (_b = user.collection) === null || _b === void 0 ? void 0 : _b.map(id => ObjectId(id));
        const collection = yield db
            .collection('plants')
            .find({ _id: { $in: ids } })
            .toArray();
        res.status(200).json({ status: 200, collection });
    }
    catch (err) {
        console.error('Error getting collection', err);
        res.status(500).json({ status: 500, message: 'Internal server error' });
    }
    client.close();
});
exports.getCollection = getCollection;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ObjectId(req.params.id);
    const { email, username, currentPassword, newPassword } = req.body;
    const client = yield MongoClient(MONGO_URI, options);
    try {
        yield client.connect();
        const db = client.db('plantgeekdb');
        const filter = { _id: userId };
        const user = yield db.collection('users').findOne({ _id: userId });
        let update = {};
        if (newPassword) {
            const hashedPwd = yield bcrypt_1.default.hash(newPassword, user.password);
            const passwordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!passwordValid) {
                return res.status(400).json({ message: 'Incorrect password' });
            }
            else {
                update = {
                    $set: {
                        password: hashedPwd,
                    },
                };
            }
        }
        else
            update = {
                $set: req.body,
            };
        const existingEmail = yield db.collection('users').findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') },
        });
        const existingUsername = yield db.collection('users').findOne({
            username: { $regex: new RegExp(`^${username}$`, 'i') },
        });
        if (existingEmail && !existingEmail._id.equals(userId)) {
            return res.status(400).json({ message: 'That email is already in use' });
        }
        else if (existingUsername && !existingUsername._id.equals(userId)) {
            return res.status(400).json({ message: 'That username is taken' });
        }
        else {
            // check if email is being updated, if so set emailVerified to false and send new verification email
            if (email !== user.email) {
                const code = crypto_1.default.randomBytes(20).toString('hex');
                update.$set.verificationCode = code;
                update.$set.emailVerified = false;
                const message = {
                    personalizations: [
                        {
                            to: {
                                email: req.body.email,
                                name: `${req.body.firstName} ${req.body.lastName}`,
                            },
                            dynamic_template_data: {
                                first_name: req.body.firstName,
                                verification_link: `https://www.plantgeek.co/verify-email/${code}`,
                            },
                        },
                    ],
                    from: { email: ADMIN_EMAIL, name: 'plantgeek' },
                    template_id: NEW_EMAIL_VERIFICATION_TEMPLATE_ID,
                };
                yield mail_1.default.send(message).catch(err => console.error(err));
            }
            const result = yield db.collection('users').updateOne(filter, update);
            res.status(200).json({ status: 200, data: result });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(400).json(err);
    }
    client.close();
});
exports.updateUser = updateUser;
const updateLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { plantId, hearts, owned, wanted, collection, wishlist } = req.body;
    const client = yield MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        // update user's collection and wishlist (lists of plantIds)
        const userUpdate = yield db.collection('users').updateOne({ _id: ObjectId(userId) }, {
            $set: {
                collection,
                wishlist,
            },
        });
        // update lists of userIds in hearts, owned, and wanted on plant to be able to sort by most liked/owned/wanted and show totals on profile
        const plantUpdate = yield db.collection('plants').updateOne({ _id: ObjectId(plantId) }, {
            $set: {
                hearts,
                owned,
                wanted,
            },
        });
        res.status(200).json({ status: 200, data: { userUpdate, plantUpdate } });
    }
    catch (err) {
        console.error(err);
        return res.status(400).json(err);
    }
});
exports.updateLists = updateLists;
// (DELETE) REMOVE A USER
// TODO: remove from other users' friends
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield MongoClient(MONGO_URI, options);
    const { id } = req.params;
    yield client.connect();
    const db = client.db('plantgeekdb');
    try {
        const filter = { _id: ObjectId(id) };
        const result = yield db.collection('users').deleteOne(filter);
        // find and remove user's id from plants' hearts
        yield db.collection('plants').updateMany({}, {
            $pull: {
                hearts: id,
                owned: id,
                wanted: id,
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
exports.deleteUser = deleteUser;
// module.exports = {
//   createUser,
//   resendVerificationEmail,
//   authenticateUser,
//   verifyToken,
//   verifyEmail,
//   sendPasswordResetCode,
//   resetPassword,
//   getUsers,
//   getUser,
//   getWishlist,
//   getCollection,
//   updateUser,
//   updateLists,
//   deleteUser,
// }
//# sourceMappingURL=userHandlers.js.map