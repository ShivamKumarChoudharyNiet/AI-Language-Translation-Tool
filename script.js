// API Translation Call
async function translateData() {
    const text = sourceText.value.trim();
    const translateFrom = sourceSelect.value; // ex: "en-GB"
    const translateTo = targetSelect.value;   // ex: "hi-IN"

    if (!text) {
        targetText.value = "";
        return;
    }

    // Loader Show
    btnText.textContent = "Translating...";
    btnLoader.classList.remove("hidden");
    translateBtn.disabled = true;

    try {
        // FIXED: Kisi split ki zarurat nahi hai, MyMemory API full locales (en-GB|hi-IN) par accuracy barkarar rakhti hai
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.responseData) {
            targetText.value = data.responseData.translatedText;
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
