import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import Tesseract from "tesseract.js";

// 定義済みのキーワード一覧
export const keywordList: string[] = ["example", "keywords", "here", "宿泊施設", "外観", "客室", "露天風呂", "大浴場", "間取り図", "見取り図",
    "食べ物", "料理", "風景", "建物", "街並み", "町並み", "世界遺産", "夕景", "夜景", "動物", "植物", "物品",
    "イベント", "祭り", "花火", "クリスマス", "正月", "ウェディング", "乗り物", "車体", "船体", "機体",
    "人物", "女", "男", "家族", "似顔絵", "シニア", "子供", "キャラクター", "ココロちゃん", "わくわく4", "わくわく5",
    "水彩", "ポップ", "ベタ", "線画", "アイコン", "浮世絵", "俯瞰図", "女性向け", "風景画", "表紙", "地図",
    "春", "桜", "夏", "秋", "紅葉", "冬", "雪",
    "国内", "海外",
    "4K", "HD", "地上撮影", "空撮", "360°/VR", "タイムラプス", "動画テンプレート"];

// 必要なインポートや他のコード
const app = express();
const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 3000;

// ルートやミドルウェアの定義
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "画像がアップロードされていません" });
      return;
    }

    const imagePath = req.file.path;

    // アップロードされた画像に対して Tesseract.js を使用して OCR を実行
    const ocrResult = await Tesseract.recognize(imagePath, "jpn");
    const ocrText: string = ocrResult.data.text;

    // ダミーの画像認識関数
    const visualResult = await imageRecognition(imagePath);

    // テキストとビジュアル解析結果を統合
    const combinedResult = `${ocrText} ${visualResult}`;

    // 統合結果とキーワードリストを比較して一致するキーワードを見つける
    const matchedKeywords: string[] = keywordList.filter(keyword => combinedResult.includes(keyword));

    // ダミーの RAG を使用して各一致キーワードの説明を生成
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

// フロントエンドファイルを public フォルダから提供
app.use(express.static(path.join(__dirname, "../public")));

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ダミーの画像認識関数
function imageRecognition(filePath: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("建物 風景 人物");
    }, 500);
  });
}

// ダミーの RAG 説明生成関数
function generateExplanation(keyword: string): string {
  const explanations: { [key: string]: string } = {
    "客室": "広々としたデザイン、快適な宿泊環境",
    "建物": "歴史を感じさせる建築様式",
    "風景": "自然や都市の美しい景観",
    "人物": "人々の表情や動作をとらえたもの"
  };
  return explanations[keyword] || "補足説明なし";
}
