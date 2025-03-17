import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import * as csvWriter from 'csv-writer';
import { keywordList } from '../server'; // server.ts から keywordList をインポート
import { analyzeImage } from './imageAnalyzer';
import { analyzeImage } from './imageAnalysisModule'; // 画像解析モジュールをインポート


// 環境変数を読み込み
dotenv.config();

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY is not defined in the environment variables');
}

// 解析する画像のパスを指定
const imagePath = path.join(__dirname, 'images', 'your_image.jpg'); // 画像ファイルのパス
const csvPath = path.join(__dirname, '..', 'dist', 'result.csv'); // 出力するCSVファイルのパス

analyzeImage(imagePath, apiKey)
  .then((result: string) => {
    console.log('Image Analysis Result:', result);
  })
  .catch((error: Error) => {
    console.error('Error analyzing image:', error);
  });

// 画像を解析する関数
export async function analyzeAndSaveToCSV() {
  try {
    // 画像を解析
    const analysisResult = await analyzeImage(imagePath);

    // CSVファイルに結果を保存
    const writer = csvWriter.createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'I2', title: 'I2' },
        // 他のヘッダーがあれば追加
      ],
    });

    // 解析結果と keywordList を CSV に書き込み
    await writer.writeRecords([
      { I2: analysisResult },
      ...keywordList.map(keyword => ({ I2: keyword }))
    ]);

    console.log('CSVファイルに結果を保存しました');
  } catch (error) {
    console.error('解析中にエラーが発生しました:', error);
  }
}

// 解析を実行
analyzeAndSaveToCSV();
