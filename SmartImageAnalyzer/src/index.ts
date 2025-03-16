import dotenv from 'dotenv';
import { analyzeImage } from './imageAnalyzer';
import * as path from 'path';

// 環境変数を読み込み
dotenv.config();

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY is not defined in the environment variables');
}

// 解析する画像のパスを指定
const imagePath = path.join(__dirname, 'path/to/your/image.jpg');

analyzeImage(imagePath, apiKey)
  .then((result: string) => {
    console.log('Image Analysis Result:', result);
  })
  .catch((error: Error) => {
    console.error('Error analyzing image:', error);
  });