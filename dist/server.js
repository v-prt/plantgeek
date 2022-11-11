"use strict";
// 'npm run dev' to start development server
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan")); // logs request on the terminal (example: Get /users 100ms 200)
const path_1 = __importDefault(require("path"));
const source_map_support_1 = __importDefault(require("source-map-support"));
source_map_support_1.default.install();
// HANDLERS
const userHandlers_js_1 = require("./handlers/userHandlers.js");
const plantHandlers_js_1 = require("./handlers/plantHandlers.js");
const suggestionHandlers_js_1 = require("./handlers/suggestionHandlers.js");
// run on whatever port heroku has available or 4000 (local)
const PORT = process.env.PORT || 4000;
const API_URL = process.env.API_URL;
const app = (0, express_1.default)();
app
    .use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, PUT, POST, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})
    .use((0, morgan_1.default)('tiny'))
    .use(express_1.default.json())
    // ENDPOINTS
    // users
    .post(`${API_URL}/users`, userHandlers_js_1.createUser)
    .post(`${API_URL}/verification-email/:userId`, userHandlers_js_1.resendVerificationEmail)
    .post(`${API_URL}/login`, userHandlers_js_1.authenticateUser)
    .post(`${API_URL}/token`, userHandlers_js_1.verifyToken)
    .post(`${API_URL}/verify-email/:code`, userHandlers_js_1.verifyEmail)
    .post(`${API_URL}/password-reset-code`, userHandlers_js_1.sendPasswordResetCode)
    .post(`${API_URL}/password`, userHandlers_js_1.resetPassword)
    .get(`${API_URL}/users`, userHandlers_js_1.getUsers)
    .get(`${API_URL}/users/:id`, userHandlers_js_1.getUser)
    .get(`${API_URL}/wishlist/:userId`, userHandlers_js_1.getWishlist)
    .get(`${API_URL}/collection/:userId`, userHandlers_js_1.getCollection)
    .put(`${API_URL}/users/:id`, userHandlers_js_1.updateUser)
    .post(`${API_URL}/lists/:userId`, userHandlers_js_1.updateLists)
    .delete(`${API_URL}/users/:id`, userHandlers_js_1.deleteUser)
    // plants
    .post(`${API_URL}/plants`, plantHandlers_js_1.createPlant)
    .get(`${API_URL}/plants/:page`, plantHandlers_js_1.getPlants)
    .get(`${API_URL}/plants-to-review`, plantHandlers_js_1.getPlantsToReview)
    .get(`${API_URL}/plant/:slug`, plantHandlers_js_1.getPlant)
    .get(`${API_URL}/similar-plants/:slug`, plantHandlers_js_1.getSimilarPlants)
    .get(`${API_URL}/random-plants`, plantHandlers_js_1.getRandomPlants)
    .get(`${API_URL}/user-plants/:page`, plantHandlers_js_1.getUserPlants)
    .get(`${API_URL}/contributions/:userId`, plantHandlers_js_1.getUserContributions)
    .put(`${API_URL}/plants/:id`, plantHandlers_js_1.updatePlant)
    .put(`${API_URL}/plants/:id/comments`, plantHandlers_js_1.addComment)
    .delete(`${API_URL}/plants/:id`, plantHandlers_js_1.deletePlant)
    // suggestions
    .post(`${API_URL}/suggestions/:plantId`, suggestionHandlers_js_1.createSuggestion)
    .get(`${API_URL}/suggestions`, suggestionHandlers_js_1.getSuggestions)
    .get(`${API_URL}/suggestions/:slug`, suggestionHandlers_js_1.getSuggestionsBySlug)
    .put(`${API_URL}/suggestions/:id`, suggestionHandlers_js_1.updateSuggestion);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, 'frontend', 'build')));
}
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'frontend', 'build', 'index.html'));
});
app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
//# sourceMappingURL=server.js.map