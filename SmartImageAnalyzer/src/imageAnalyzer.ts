import * as fs from 'fs';
import * as csvWriter from 'csv-writer';
import { analyzeImage } from './path/to/your/image/analysis/module'; // 画像解析モジュールをインポート

const imagePath = './src/images/your_image.jpg'; // 画像ファイルのパス
const csvPath = './dist/result.csv'; // 出力するCSVファイルのパス

// 画像を解析する関数
async function analyzeAndSaveToCSV() {
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

    await writer.writeRecords([{ I2: analysisResult }]); // 解析結果をI2列に書き込み
    console.log('CSVファイルに結果を保存しました');
  } catch (error) {
    console.error('解析中にエラーが発生しました:', error);
  }
}

// 解析を実行
analyzeAndSaveToCSV();
