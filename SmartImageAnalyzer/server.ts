import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import Tesseract from "tesseract.js";

export const keywordList: string[] = ["example", "keywords", "here"];

// 必要なインポートや他のコード
const app = express();
const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 3000;

// ルートやミドルウェアの定義
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// サーバーの起動
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// ファイルアップロード用マルチのセットアップ
const upload = multer({
  dest: path.join(__dirname, "uploads/")
});

// 定義済みキーワード一覧
const keywordList: string[] = [
  "宿泊施設", "外観", "客室", "露天風呂", "大浴場", "間取り図", "見取り図",
  "食べ物", "料理",
  "風景", "建物", "街並み", "町並み", "世界遺産", "夕景", "夜景", "動物", "植物", "物品",
  "イベント", "祭り", "花火", "クリスマス", "正月", "ウェディング",
  "乗物", "車体", "船体", "機体",
  "人物", "女", "男", "家族", "似顔絵", "シニア", "子供",
  "キャラクター", "ココロちゃん", "わくわく4", "わくわく5",
  "水彩", "ポップ", "ベタ", "線画", "アイコン", "浮世絵", "俯瞰図", "女性向け", "風景画", "表紙", "地図",
  "春", "桜", "夏", "秋", "紅葉", "冬", "雪",
  "国内", "海外",
  "4K", "HD", "地上撮影", "空撮", "360°/VR", "タイムラプス", "動画テンプレート"
];

// Dummy image recognition function
function imageRecognition(filePath: string): Promise<string> {
  // For a real implementation, call an image recognition API or library.
  // Here, we return a dummy result including some keywords.
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate image recognition returning a string containing some keywords.
      resolve("建物 風景 人物");
    }, 500);
  });
}

// Dummy RAG explanation generator
function generateExplanation(keyword: string): string {
  // In a real system, this might call an external language model API.
  // Here we simulate a short description.
  const explanations: { [key: string]: string } = {
    "客室": "広々としたデザイン、快適な宿泊環境",
    "建物": "歴史を感じさせる建築様式",
    "風景": "自然や都市の美しい景観",
    "人物": "人々の表情や動作をとらえたもの"
  };
  return explanations[keyword] || "補足説明なし";
}

// Endpoint to handle image processing
app.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "画像がアップロードされていません" });
      return;
    }

    const imagePath = req.file.path;

    // Perform OCR using Tesseract.js on the uploaded image
    const ocrResult = await Tesseract.recognize(imagePath, "jpn");
    const ocrText: string = ocrResult.data.text;

    // Call dummy image recognition to obtain visual keywords (as a string)
    const visualResult = await imageRecognition(imagePath);

    // Merge text and visual analysis results
    const combinedResult = `${ocrText} ${visualResult}`;

    // Compare combined result with the keyword list to find matches
    const matchedKeywords: string[] = keywordList.filter(keyword => combinedResult.includes(keyword));

    // Generate explanations for each matched keyword using dummy RAG
    const explanations: { [key: string]: string } = {};
    matchedKeywords.forEach(keyword => {
      explanations[keyword] = `${keyword}: ${generateExplanation(keyword)}`;
    });

    res.json({ matchedKeywords, explanations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "画像解析中にエラーが発生しました" });
  }
});

app.use(express.static(path.join(__dirname, "../public"))); // Serve frontend files from public folder

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
