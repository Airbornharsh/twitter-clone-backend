"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const DbConfig_1 = __importDefault(require("./config/DbConfig"));
const Route_1 = __importDefault(require("./routes/Route"));
const TweetHelper_1 = require("./helpers/TweetHelper");
const app = (0, express_1.default)();
const router = express_1.default.Router();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, DbConfig_1.default)();
(0, TweetHelper_1.AIModelInit)();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api", router);
(0, Route_1.default)(router);
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
module.exports = app;
