// Frontend logic using TypeScript
// This file handles image upload, drag & drop UI, and interaction with the backend.

const dropArea = document.getElementById("drop-area") as HTMLElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const progressIndicator = document.getElementById("progress-indicator") as HTMLElement;
const keywordListElement = document.getElementById("keyword-list") as HTMLElement;
const outputTextArea = document.getElementById("output-text") as HTMLTextAreaElement;
const errorSection = document.getElementById("error-section") as HTMLElement;
const errorMessage = document.getElementById("error-message") as HTMLElement;
const retryButton = document.getElementById("retry-button") as HTMLButtonElement;
const resultSection = document.getElementById("result-section") as HTMLElement;

// Predefined keyword list
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

// Map keywords to categories for UI color-coding (this is an example assignment)
const keywordCategories: { [keyword: string]: string } = {
  "宿泊施設": "button-hotel",
  "外観": "button-hotel",
  "客室": "button-hotel",
  "露天風呂": "button-hotel",
  "大浴場": "button-hotel",
  "間取り図": "button-hotel",
  "見取り図": "button-hotel",
  "食べ物": "button-food",
  "料理": "button-food",
  "風景": "button-landscape",
  "建物": "button-landscape",
  "街並み": "button-landscape",
  "町並み": "button-landscape",
  "世界遺産": "button-landscape",
  "夕景": "button-landscape",
  "夜景": "button-landscape",
  "動物": "button-landscape",
  "植物": "button-landscape",
  "物品": "button-landscape",
  "イベント": "button-event",
  "祭り": "button-event",
  "花火": "button-event",
  "クリスマス": "button-event",
  "正月": "button-event",
  "ウェディング": "button-event",
  "乗物": "button-transport",
  "車体": "button-transport",
  "船体": "button-transport",
  "機体": "button-transport",
  "人物": "button-person",
  "女": "button-person",
  "男": "button-person",
  "家族": "button-person",
  "似顔絵": "button-person",
  "シニア": "button-person",
  "子供": "button-person",
  "キャラクター": "button-character",
  "ココロちゃん": "button-character",
  "わくわく4": "button-character",
  "わくわく5": "button-character",
  "水彩": "button-art",
  "ポップ": "button-art",
  "ベタ": "button-art",
  "線画": "button-art",
  "アイコン": "button-art",
  "浮世絵": "button-art",
  "俯瞰図": "button-art",
  "女性向け": "button-art",
  "風景画": "button-art",
  "表紙": "button-art",
  "地図": "button-art",
  "春": "button-season",
  "桜": "button-season",
  "夏": "button-season",
  "秋": "button-season",
  "紅葉": "button-season",
  "冬": "button-season",
  "雪": "button-season",
  "国内": "button-region",
  "海外": "button-region",
  "4K": "button-method",
  "HD": "button-method",
  "地上撮影": "button-method",
  "空撮": "button-method",
  "360°/VR": "button-method",
  "タイムラプス": "button-method",
  "動画テンプレート": "button-method"
};

// Helper function to show/hide elements
function toggleVisibility(element: HTMLElement, show: boolean) {
  if (show) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

// Drag & Drop events
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragover");
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    handleImageUpload(files[0]);
  }
});

// File input change event
fileInput.addEventListener("change", () => {
  if (fileInput.files && fileInput.files[0]) {
    handleImageUpload(fileInput.files[0]);
  }
});

// Retry button event for error handling
retryButton.addEventListener("click", () => {
  errorMessage.innerText = "";
  toggleVisibility(errorSection, false);
  // Allow user to re-select file (or trigger last analysis again)
});

// Main function to send the image to the backend and process results
async function handleImageUpload(file: File) {
  toggleVisibility(progressIndicator, true);
  toggleVisibility(resultSection, false);
  toggleVisibility(errorSection, false);

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("解析エラーが発生しました");
    }

    // Expected response format: { matchedKeywords: string[], explanations: { [keyword: string]: string } }
    const data = await response.json();
    displayKeywords(data.matchedKeywords, data.explanations);
    toggleVisibility(resultSection, true);
  } catch (err: any) {
    errorMessage.innerText = err.message || "不明なエラーです";
    toggleVisibility(errorSection, true);
  } finally {
    toggleVisibility(progressIndicator, false);
  }
}

// Function to display keywords as clickable buttons
function displayKeywords(matchedKeywords: string[], explanations: { [keyword: string]: string }) {
  // Clear existing buttons
  keywordListElement.innerHTML = "";
  matchedKeywords.forEach(keyword => {
    const button = document.createElement("button");
    button.textContent = keyword;
    // Determine category style for the keyword; use a default style if not in our map
    button.className = "button-category " + (keywordCategories[keyword] || "button-default");
    button.addEventListener("click", () => {
      const text = `${keyword}: ${explanations[keyword]}\n`;
      outputTextArea.value += text;
    });
    keywordListElement.appendChild(button);
  });
}