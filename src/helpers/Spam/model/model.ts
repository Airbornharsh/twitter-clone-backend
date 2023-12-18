import { AIModel } from "../../TweetHelper";
import { LOOKUP, PAD, START, UNKNOWN } from "./dictionary";
import * as tf from "@tensorflow/tfjs";
const ENCODING_LENGTH = 21;

const loadAndPredict = async (inputText: string) => {
  let lowercaseSentenceArray = inputText
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(" ");
  lowercaseSentenceArray = lowercaseSentenceArray.slice(0, 20);

  let results = AIModel.predict(tokenize(lowercaseSentenceArray));

  const level =
    parseFloat(results.toString().split(",")[1].split("]")[0]) * 100;

  const spam = level > 60 ? true : false;
  return spam;
};

const tokenize = (wordArray: string[]) => {
  let returnArray = [START];
  for (var i = 0; i < wordArray.length; i++) {
    let encoding = LOOKUP[wordArray[i]];
    returnArray.push(encoding === undefined ? UNKNOWN : encoding);
  }
  while (returnArray.length < ENCODING_LENGTH) {
    returnArray.push(PAD);
  }
  return tf.tensor2d([returnArray]);
};

export { loadAndPredict };
