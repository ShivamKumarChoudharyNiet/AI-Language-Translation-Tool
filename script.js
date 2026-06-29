const sourceText = document.getElementById("sourceText");
const targetText = document.getElementById("targetText");

const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");

const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");

const copySource = document.getElementById("copySource");
const copyTarget = document.getElementById("copyTarget");

const speakSource = document.getElementById("speakSource");
const speakTarget = document.getElementById("speakTarget");

const charCount = document.getElementById("charCount");

const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");

sourceText.addEventListener("input", () => {
    charCount.textContent = `${sourceText.value.length} / 5000`;
});

translateBtn.addEventListener("click", translateText);

swapBtn.addEventListener("click", () => {

    const tempLang = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = tempLang;

    const tempText = sourceText.value;
    sourceText.value = targetText.value;
    targetText.value = tempText;

    charCount.textContent = `${sourceText.value.length} / 5000`;

});

copySource.addEventListener("click", () => {

    if (!sourceText.value) return;

    navigator.clipboard.writeText(sourceText.value);

});

copyTarget.addEventListener("click", () => {

    if (!targetText.value) return;

    navigator.clipboard.writeText(targetText.value);

});

function speak(text, lang) {

    if (!text) return;

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = lang;

    speech.rate = 1;

    speech.pitch = 1;

    speechSynthesis.speak(speech);

}

speakSource.addEventListener("click", () => {

    speak(sourceText.value, sourceLang.value);

});

speakTarget.addEventListener("click", () => {

    speak(targetText.value, targetLang.value);

});

async function translateText() {

    const text = sourceText.value.trim();

    if (text === "") {

        targetText.value = "";

        return;

    }

    btnText.textContent = "Translating...";

    btnLoader.classList.remove("hidden");

    translateBtn.disabled = true;

    try {

        const url =
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang.value}|${targetLang.value}`;

        const response = await fetch(url);

        const data = await response.json();

        if (
            data &&
            data.responseData &&
            data.responseData.translatedText
        ) {

            targetText.value = data.responseData.translatedText;

        } else {

            targetText.value = "Translation failed.";

        }

    } catch (error) {

        console.error(error);

        targetText.value = "Network Error.";

    } finally {

        btnLoader.classList.add("hidden");

        btnText.textContent = "Translate";

        translateBtn.disabled = false;

    }

}

sourceText.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key === "Enter") {

        translateText();

    }

});
