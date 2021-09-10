'use strict';
//Array donde voy a guardar las series que me devuelve el servidor
let series = [];
//donde voy a pintar mis series
let seriesList = document.querySelector('.js-series-list');
//traemos el input del HTML
const input = document.querySelector('.js-input');
//traemos el botón de HTML
const btn = document.querySelector('.js-btn');

//funcion para que al pulsar el botón llame a la api
function handleGetInfoSeries() {
  getApi();
}

//funcion para llamar a la api
function getApi() {
  const getInfo = input.value;
  const url = `http://api.tvmaze.com/search/shows?q=${getInfo}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      series = data;
      paintSeries();
});
}

//funcion para pintar las series
function paintSeries() {
  let html = '';
  for (const serie of series) {
    const serieTitle = serie.show.name;
    let img = serie.show.image;
    let imgDefault = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    if (img === null) {
      img = imgDefault;
    } else {
      img = serie.show.image.medium;
    }
    html += `<li class="list--li">`;
    html += `<img src="${img}" width="350" height="350" class="serie-img"/>`;
    html += `<h3 class="serie-title">${serieTitle}</h3>`;
    html += `</li>`;
  }
  seriesList.innerHTML = html;
}

//funcion para prevenir que el btn recargue la pagina por defecto
function preventBtn(ev) {
  ev.preventDefault();
}

btn.addEventListener('click', handleGetInfoSeries);
btn.addEventListener('click', preventBtn);
