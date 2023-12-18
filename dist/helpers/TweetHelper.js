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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTweet = exports.AIModelInit = exports.isOtherUserAuthorised = exports.isAuthorised = exports.AIModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const tfn = __importStar(require("@tensorflow/tfjs-node"));
const model_1 = require("./Spam/model/model");
const isAuthorised = (user, otherUser) => {
    if (user._id.equals(otherUser._id)) {
        return true;
    }
    else if (otherUser.blocked.some((a) => a.equals(user._id))) {
        return false;
    }
    else if (!otherUser.private) {
        return true;
    }
    else if (otherUser.allowed.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.followers.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.following.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.pending.some((a) => a.equals(user._id))) {
        return false;
    }
    else if (otherUser.pendingBy.some((a) => a.equals(user._id))) {
        return false;
    }
    return false;
};
exports.isAuthorised = isAuthorised;
const isOtherUserAuthorised = (user, otherUser) => {
    if (user._id.equals(otherUser._id)) {
        return true;
    }
    else if (otherUser.blocked.some((a) => a.equals(user._id))) {
        return false;
    }
    else if (!otherUser.private) {
        return true;
    }
    else if (otherUser.allowed.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.followers.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.following.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.pending.some((a) => a.equals(user._id))) {
        return false;
    }
    else if (otherUser.pendingBy.some((a) => a.equals(user._id))) {
        return false;
    }
    return false;
};
exports.isOtherUserAuthorised = isOtherUserAuthorised;
const AIModelInit = async () => {
    const handler = tfn.io.fileSystem("./src/helpers/Spam/model/modelConfig.json");
    exports.AIModel = await tf.loadLayersModel(handler);
};
exports.AIModelInit = AIModelInit;
const filterTweet = async (res, tweet) => {
    // const level = await loadAndPredict(tweet);
    // console.log(level);
    // spam.classify(tweet).then((level: any) => {
    //   console.log(level);
    //   if (level === "spam") {
    //     res.status(400).json({ message: "Tweet contains spam!" });
    //     return true;
    //   }
    // });
    const toxic = await (0, model_1.loadAndPredict)(tweet);
    if (toxic) {
        res.status(400).json({ message: "Tweet contains bad words!" });
        return true;
    }
    return toxic;
};
exports.filterTweet = filterTweet;
