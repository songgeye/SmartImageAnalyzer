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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeAndSaveToCSV = analyzeAndSaveToCSV;
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const csvWriter = __importStar(require("csv-writer"));
const server_1 = require("../server"); // server.ts から keywordList をインポート
const imageAnalyzer_1 = require("./imageAnalyzer");
// 環境変数を読み込み
dotenv_1.default.config();
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error('API_KEY is not defined in the environment variables');
}
// 解析する画像のパスを指定
const imagePath = path.join(__dirname, 'images', 'your_image.jpg'); // 画像ファイルのパス
const csvPath = path.join(__dirname, '..', 'dist', 'result.csv'); // 出力するCSVファイルのパス
(0, imageAnalyzer_1.analyzeImage)(imagePath, apiKey)
    .then((result) => {
    console.log('Image Analysis Result:', result);
})
    .catch((error) => {
    console.error('Error analyzing image:', error);
});
// 画像を解析する関数
function analyzeAndSaveToCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 画像を解析
            const analysisResult = yield (0, imageAnalyzer_1.analyzeImage)(imagePath);
            // CSVファイルに結果を保存
            const writer = csvWriter.createObjectCsvWriter({
                path: csvPath,
                header: [
                    { id: 'I2', title: 'I2' },
                    // 他のヘッダーがあれば追加
                ],
            });
            // 解析結果と keywordList を CSV に書き込み
            yield writer.writeRecords([
                { I2: analysisResult },
                ...server_1.keywordList.map(keyword => ({ I2: keyword }))
            ]);
            console.log('CSVファイルに結果を保存しました');
        }
        catch (error) {
            console.error('解析中にエラーが発生しました:', error);
        }
    });
}
// 解析を実行
analyzeAndSaveToCSV();
