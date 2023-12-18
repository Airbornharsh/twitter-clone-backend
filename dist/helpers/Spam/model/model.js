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
exports.loadAndPredict = void 0;
const TweetHelper_1 = require("../../TweetHelper");
const dictionary_1 = require("./dictionary");
const tf = __importStar(require("@tensorflow/tfjs"));
const ENCODING_LENGTH = 21;
const loadAndPredict = async (inputText) => {
    let lowercaseSentenceArray = inputText
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(" ");
    lowercaseSentenceArray = lowercaseSentenceArray.slice(0, 20);
    let results = TweetHelper_1.AIModel.predict(tokenize(lowercaseSentenceArray));
    const level = parseFloat(results.toString().split(",")[1].split("]")[0]) * 100;
    const spam = level > 60 ? true : false;
    return spam;
};
exports.loadAndPredict = loadAndPredict;
const tokenize = (wordArray) => {
    let returnArray = [dictionary_1.START];
    for (var i = 0; i < wordArray.length; i++) {
        let encoding = dictionary_1.LOOKUP[wordArray[i]];
        returnArray.push(encoding === undefined ? dictionary_1.UNKNOWN : encoding);
    }
    while (returnArray.length < ENCODING_LENGTH) {
        returnArray.push(dictionary_1.PAD);
    }
    return tf.tensor2d([returnArray]);
};
