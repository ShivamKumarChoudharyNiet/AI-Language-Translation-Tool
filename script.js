const sourceText=document.getElementById('sourceText');
const targetText=document.getElementById('targetText');
const sourceSelect=document.getElementById('sourceLang');
const targetSelect=document.getElementById('targetLang');
const translateBtn=document.getElementById('translateBtn');
const btnText=document.getElementById('btnText');
const btnLoader=document.getElementById('btnLoader');
const swapBtn=document.getElementById('swapBtn');
const charCount=document.getElementById('charCount');

const languages={'en-GB':'English','hi-IN':'Hindi','fr-FR':'French','es-ES':'Spanish','de-DE':'German','ja-JP':'Japanese','zh-CN':'Chinese','ar-SA':'Arabic','bn-IN':'Bengali','ta-IN':'Tamil','te-IN':'Telugu','mr-IN':'Marathi'};
for(const c in languages){sourceSelect.innerHTML+=`<option value="${c}">${languages[c]}</option>`;targetSelect.innerHTML+=`<option value="${c}">${languages[c]}</option>`;}
sourceSelect.value='en-GB';targetSelect.value='hi-IN';
sourceText.oninput=()=>charCount.textContent=`${sourceText.value.length} / 5000`;
translateBtn.onclick=translateData;
swapBtn.onclick=()=>{[sourceSelect.value,targetSelect.value]=[targetSelect.value,sourceSelect.value];[sourceText.value,targetText.value]=[targetText.value,sourceText.value];};
copySource.onclick=()=>navigator.clipboard.writeText(sourceText.value);
copyTarget.onclick=()=>navigator.clipboard.writeText(targetText.value);
function speak(t,l){if(!t)return;const u=new SpeechSynthesisUtterance(t);u.lang=l;speechSynthesis.cancel();speechSynthesis.speak(u);}
speakSource.onclick=()=>speak(sourceText.value,sourceSelect.value);
speakTarget.onclick=()=>speak(targetText.value,targetSelect.value);
async function translateData(){const t=sourceText.value.trim();if(!t){targetText.value='';return;}btnText.textContent='Translating...';btnLoader.classList.remove('hidden');translateBtn.disabled=true;try{const r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(t)}&langpair=${sourceSelect.value}|${targetSelect.value}`);const d=await r.json();targetText.value=d?.responseData?.translatedText||'Translation failed.';}catch(e){targetText.value='Network error.';}finally{btnText.textContent='Translate Text';btnLoader.classList.add('hidden');translateBtn.disabled=false;}}
