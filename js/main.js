'use stric'
const ACCESSKEY = 'yEOJRkV-uEQrkSa5fbWUMICBsFSwBOfxGx_p6gJCHcc';
const SECRETKEY = '1AiOiV6YWM_K9ev7v_zDzX4H6OPLGlBECERfrRZYILg';

const endPoint = 'https://api.unsplash.com/search/photos';

async function getImages(query) {
    let response = await fetch(endPoint + '?query=' + query + '&client_id=' + ACCESSKEY);
    let jsonResponse = await response.json();
    let imagesList = await jsonResponse.results;
    createImages(imagesList);
}


function createImages(imagesList) {
    let imagesSrc = imagesList.map((img)=>img.urls.thumb);
    imagesSrc.length = 6;
    let listDuplicate = [...imagesSrc, ...imagesSrc];

    const random = listDuplicate.sort(()=> Math.random() - 0.5);
    $id('wrapper-play').innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const cardImage = document.createElement('div');
        const image = document.createElement('img');
        cardImage.className = 'bg-green-400 hover:bg-green-600 cursor-pointer rounded-md shadow-md';

        image.className = 'w-full h-48 object-cover opacity-0';
        image.src = random[i];
        cardImage.appendChild(image);
        $id('wrapper-play').appendChild(cardImage);
    }
}


const $id = selector => document.getElementById(selector);
const $wrapperPlay = $id('wrapper-play');
const $btnReplay = $id('btn-replay');

const showModal = (message)=>{
    const modal = document.createElement('div');
    const btnReplay = document.createElement('button');
    const title = document.createElement('h2');

    modal.id = 'modal';
    modal.className = 'fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center text-center bg-gray-900 bg-opacity-70';

    btnReplay.id = 'btnReplay';
    btnReplay.className = 'absolute top-4 right-4 bg-gray-200 text-gray-900 shadow-sm rounded px-2 py-1';
    btnReplay.textContent = 'Volver a Cargar';

    title.className = 'text-6xl text-gray-100 uppercase font-bold';
    title.textContent = message;

    modal.appendChild(btnReplay);
    modal.appendChild(title);

    document.querySelector('body').appendChild(modal);
}

const getCardShowing = nun => $id('wrapper-play').querySelectorAll('.opacity-100')[nun];

const newTry = (firt, last)=>{
    const count = $id('count-fail').textContent;
    $id('count-fail').textContent = +count + 1;
    setTimeout(() => {
        firt.classList.replace('opacity-100', 'opacity-0');
        last.classList.replace('opacity-100', 'opacity-0');
    }, 700);
}

const success = (firt, last) =>{
    firt.classList.remove('opacity-100');
    last.classList.remove('opacity-100');
    const count = $id('count-success').textContent;
    $id('count-success').textContent = +count + 1;

    const isWinner = $id('wrapper-play').querySelector('.opacity-0');

    if(!isWinner) return showModal('Ganaste.');
}

const play = (card) => {
    const isOpacity = !card.classList.contains('opacity-0');
    if (isOpacity) return;

    card.classList.replace('opacity-0', 'opacity-100');
    const playingMax = $id('wrapper-play').querySelectorAll('.opacity-100').length >= 2;

    if(!playingMax) return;

    const firtCard = getCardShowing(0);
    const lastCard = getCardShowing(1);

    const isWinner = firtCard.getAttribute('src') === lastCard.getAttribute('src')
    
    if(!isWinner) return newTry(firtCard,lastCard);
    success(firtCard,lastCard)
}

$wrapperPlay.addEventListener('click', (e) => {
    play(e.target);
});

const $category = $id('category');

getImages($category.value);

$category.addEventListener('change', ()=>{
    console.log($id('category').value);
    getImages($id('category').value);
})
document.querySelector('body').addEventListener('click', (e)=>{
    if(e.target.id == 'btnReplay'){
        location.reload();
    }
})