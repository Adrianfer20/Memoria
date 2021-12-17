'use stric'
//Api Husplash
const ACCESSKEY = 'yEOJRkV-uEQrkSa5fbWUMICBsFSwBOfxGx_p6gJCHcc';
const SECRETKEY = '1AiOiV6YWM_K9ev7v_zDzX4H6OPLGlBECERfrRZYILg';
const endPoint = 'https://api.unsplash.com/search/photos';

//Get al Server
const getImages = async () => {
    try {
        let query = $id('category').value;
        let response = await fetch(endPoint + '?query=' + query + '&client_id=' + ACCESSKEY);
        let jsonResponse = await response.json();
        let imagesList = await jsonResponse.results;
        creatCardImg(imagesList);
        $id('loading').remove();
    } catch (error) {
        console.log(error);
    }
}

//DOM
const $id = selector => document.getElementById(selector);
const $wrapperPlay = $id('wrapper-play');
const $btnReplay = $id('btn-replay');

const $getCheck = selector =>{
    let nivel
    let $radios = document.querySelectorAll('input[name="nivel"]');
    $radios.forEach(element => {
        if(element.checked) return nivel = element.value;
    });
    return nivel
}

//User Interface
const creatCardImg = imagesList => {
    let listSrcImg = imagesList.map((img)=>img.urls.thumb);
    let nivel = $getCheck();
    listSrcImg.length = nivel;
    let listSrcImgDuplicate = [...listSrcImg, ...listSrcImg];

    const listRandomImgs = listSrcImgDuplicate.sort(()=> Math.random() - 0.5);
    showCardImg(listRandomImgs);
}
const showCardImg = imagesList => {
    const $document = new DocumentFragment();
    const cardMax = imagesList.length;
    for (let i = 0; i < cardMax; i++) {
        const cardImage = document.createElement('div');
        const image = document.createElement('img');
        cardImage.className = 'bg-gray-400 hover:bg-gray-500 bg-opacity-75 cursor-pointer rounded-md shadow-md';

        image.className = 'w-full h-48 object-cover opacity-0';
        image.src = imagesList[i];
        cardImage.appendChild(image);
        $document.appendChild(cardImage);

    }
    $id('wrapper-play').innerHTML = '';
    $id('wrapper-play').appendChild($document);
}


const creatModal = message => {
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

    showModal(modal)
}
const showModal = modal => document.querySelector('body').appendChild(modal);


const getCardShowing = nun => $id('wrapper-play').querySelectorAll('.opacity-100')[nun];

const newTry = (firtCard, lastCard)=>{
    const count = $id('count-fail').textContent;
    $id('count-fail').textContent = +count + 1;
    let nivel = $getCheck();
    if(nivel <= $id('count-fail').textContent) return creatModal('Perdiste!')
    setTimeout(() => {
        firtCard.classList.replace('opacity-100', 'opacity-0');
        lastCard.classList.replace('opacity-100', 'opacity-0');
    }, 700);
}
const playSuccess = (firtCard, lastCard) =>{
    firtCard.classList.remove('opacity-100');
    lastCard.classList.remove('opacity-100');
    const count = $id('count-success').textContent;
    $id('count-success').textContent = +count + 1;

    const isWinner = $id('wrapper-play').querySelector('.opacity-0');

    if(!isWinner) return creatModal('Ganaste!');
}
const play = (card) => {
    const isOpacity = !card.classList.contains('opacity-0');
    if (isOpacity) return;
    card.classList.replace('opacity-0', 'opacity-100');
    const playingMax = $id('wrapper-play').querySelectorAll('.opacity-100').length >= 2;

    if(!playingMax) return;

    const firtCard = getCardShowing(0);
    const lastCard = getCardShowing(1);

    const isWinner = firtCard.getAttribute('src') === lastCard.getAttribute('src');
    
    if(!isWinner) return newTry(firtCard,lastCard);
    playSuccess(firtCard,lastCard)
}

//BOM
document.addEventListener("DOMContentLoaded", getImages());
document.addEventListener('click', e =>{
    if(e.target.matches('btnReplay')){return location.reload()}
    if(e.target.getAttribute('src')){return play(e.target)}
});
document.addEventListener('change', (e)=>{
    if( e.target.id = 'category' || e.target.id === 'dificulta') return getImages();
});

