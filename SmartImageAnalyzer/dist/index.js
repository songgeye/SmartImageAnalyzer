"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const imageAnalyzer_1 = require("./imageAnalyzer");
// 環境変数を読み込み
dotenv_1.default.config();
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error('API_KEY is not defined in the environment variables');
}
const imagePath = 'path/to/your/image.jpg';
(0, imageAnalyzer_1.analyzeImage)(imagePath, apiKey)
    .then((result) => {
    console.log('Image Analysis Result:', result);
})
    .catch((error) => {
    console.error('Error analyzing image:', error);
});
