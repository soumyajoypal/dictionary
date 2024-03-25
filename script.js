const URL = "https://api.dictionaryapi.dev/api/v2/entries/en";
const resText = document.querySelector('.result');
const inputWord = document.querySelector('input');
const searchBtn = document.querySelector('.search-button');
const main = document.querySelector('main');
const errorMsg = document.querySelector('.Error');

searchBtn.addEventListener('click', readWord);
inputWord.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && inputWord.value.trim() !== '') {
        readWord();
    }
});

let speech = new SpeechSynthesisUtterance();

function readWord() {
    const word = inputWord.value.trim().toLowerCase();
    inputWord.value = '';
    findWord(word);
}

async function findWord(word) {
    try {
        const nURL = `${URL}/${word}`;
        const res = await fetch(nURL);
        if (!res.ok) {
            deleteSections();
            errorMsg.innerText = 'Word Not Found';
            return;
        }
        errorMsg.innerText = '';
        const data = await res.json();
        displayResult(data);
    } catch (error) {
        console.error("Error Fetching data:", error);
    }
}

function displayResult(data) {
    deleteSections();
    if (data.length === 0) {
        errorMsg.innerText = 'Word Not Found';
        return;
    }
    metaInfo(data);
    detailInfo(data);
}

function deleteSections() {
    const elements = document.querySelectorAll('main section');
    elements.forEach((element) => {
        main.removeChild(element);
    });
}

function addVoice(phoneticW, icon) {
    icon.addEventListener('click', () => {
        speech.text = phoneticW.innerText;
        window.speechSynthesis.speak(speech);
    });
}

function metaInfo(data) {
    const section = document.createElement('section');
    section.classList.add('meta-info');
    const wordName = document.createElement('h2');
    wordName.innerText = data[0].word;
    const phoneticW = document.createElement('p');
    phoneticW.innerText = data[0].phonetic ? data[0].phonetic : data[0].word;
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-volume-low');
    addVoice(wordName, icon);
    section.appendChild(wordName);
    section.appendChild(phoneticW);
    section.appendChild(icon);
    main.appendChild(section);
}

function detailInfo(data) {
    const meanings = data[0].meanings;
    const detailsInfo = document.createElement('section');
    detailsInfo.classList.add('detailsInfo');
    const details = document.createElement('ol');
    meanings.forEach((meaning) => {
        const LI = document.createElement('li');
        const heading = document.createElement('h3');
        heading.innerText = meaning.partOfSpeech;
        const definitionList = document.createElement('ul');
        meaning.definitions.forEach((definition) => {
            const listItem = document.createElement('li');
            listItem.innerText = definition.definition;
            if (definition.example) {
                const example = document.createElement('p');
                example.innerHTML = `<span>Example:</span> ${definition.example}`;
                listItem.appendChild(example);
                example.classList.add('exaT');
            }
            definitionList.appendChild(listItem);
        });
        LI.appendChild(heading);
        LI.appendChild(definitionList);
        details.appendChild(LI);
    });
    detailsInfo.appendChild(details);
    main.appendChild(detailsInfo);
}