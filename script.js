// Supported Languages List
const countries = {
    "en-GB": "English",
    "hi-IN": "Hindi",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "de-DE": "German",
    "ar-SA": "Arabic",
    "zh-CN": "Chinese (Simplified)",
    "ja-JP": "Japanese",
    "ru-RU": "Russian",
    "it-IT": "Italian"
};

// DOM Elements
const sourceSelect = document.getElementById("sourceLang");
const targetSelect = document.getElementById("targetLang");
const sourceText = document.getElementById("sourceText");
const targetText = document.getElementById("targetText");
const translateBtn = document.getElementById("translateBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const swapBtn = document.getElementById("swapBtn");
const charCount = document.getElementById("charCount");

// Populate Language Dropdowns
function populateLanguages() {
    Object.entries(countries).forEach(([code, name]) => {
        let optionSource = `<option value="${code}">${name}</option>`;
        let optionTarget = `<option value="${code}">${name}</option>`;
        sourceSelect.insertAdjacentHTML("beforeend", optionSource);
        targetSelect.insertAdjacentHTML("beforeend", optionTarget);
    });
    
    // Default selections
    sourceSelect.value = "en-GB";
    targetSelect.value = "hi-IN";
}

// Character Counter
sourceText.addEventListener("input", () => {
    charCount.textContent = `${sourceText.value.length} / 5000`;
});

// Swap Languages and Texts
swapBtn.addEventListener("click", () => {
    let tempLang = sourceSelect.value;
    sourceSelect.value = targetSelect.value;
    targetSelect.value = tempLang;

    let tempText = sourceText.value;
    sourceText.value = targetText.value;
    targetText.value = tempText;
    
    charCount.textContent = `${sourceText.value.length} / 5000`;
});

// Accurate Google Translate Alternative API Call
async function translateData() {
    const text = sourceText.value.trim();
    const translateFrom = sourceSelect.value.split('-')[0]; // "en"
    const translateTo = targetSelect.value.split('-')[0];   // "hi"

    if (!text) {
        targetText.value = "";
        return;
    }

    // Loader Show
    btnText.textContent = "Translating...";
    btnLoader.classList.remove("hidden");
    translateBtn.disabled = true;

    try {
        // High Accuracy Google Translate Engine Endpoint
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${translateFrom}&tl=${translateTo}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Parse Google Translate output layout safely
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            targetText.value = data[0][0][0];
        } else {
            targetText.value = "Translation Error. Please try again.";
        }
    } catch (error) {
        console.error("API Error:", error);
        targetText.value = "Network error. Check connection.";
    } finally {
        // Loader Hide
        btnText.textContent = "Translate Text";
        btnLoader.classList.add("hidden");
        translateBtn.disabled = false;
    }
}

translateBtn.addEventListener("click", translateData);

// --- Usability Features (Copy & Text-To-Speech) ---

// Copy Functions
document.getElementById("copySource").addEventListener("click", () => {
    if(sourceText.value) navigator.clipboard.writeText(sourceText.value);
});
document.getElementById("copyTarget").addEventListener("click", () => {
    if(targetText.value) navigator.clipboard.writeText(targetText.value);
});

// Text-to-Speech Function
function speak(text, langCode) {
    if ('speechSynthesis' in window && text) {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        window.speechSynthesis.speak(utterance);
    }
}

document.getElementById("speakSource").addEventListener("click", () => {
    speak(sourceText.value, sourceSelect.value);
});

document.getElementById("speakTarget").addEventListener("click", () => {
    speak(targetText.value, targetSelect.value);
});

// Initialize on load
populateLanguages();
