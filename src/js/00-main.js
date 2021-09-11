/* eslint-disable no-console */
'use strict';
//Arrays donde voy a guardar las series que me devuelve el servidor y las series favs
let series = [];
let seriesFavs = [];
//donde voy a pintar mis series
let seriesList = document.querySelector('.js-series-list');
//donde voy a pintar mis series favoritas
const seriesFavourites = document.querySelector('.js-favs');
//traemos el input del HTML
const input = document.querySelector('.js-input');
//traemos el botón de HTML
const btn = document.querySelector('.js-btn');

//funcion para que al pulsar el botón llame a la api
function handleGetInfoSeries() {
  getApi();
}

btn.addEventListener('click', handleGetInfoSeries);

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
    html += `<li class="list--li js-serieBox" id="${serie.show.id}">`;
    html += `<img src="${img}" width="350" height="350" class="serie-img"/>`;
    html += `<h3 class="serie-title">${serieTitle}</h3>`;
    html += `</li>`;
  }
  seriesList.innerHTML = html;
  listenSerie();
}

//funcion para prevenir que el btn recargue la pagina por defecto
function preventBtn(ev) {
  ev.preventDefault();
}

btn.addEventListener('click', preventBtn);

//funcion para que me diga donde he hecho click
function handleClickEv(ev) {
  console.log(ev.currentTarget);
  console.log(ev.currentTarget.id);
  //obtener el id de la serie clickada
  const serieId = parseInt(ev.currentTarget.id);
  //busco el id de la serie clickada en el array de series
  const serieClicked = series.find(  serieObject  =>   serieObject.show.id ===  serieId   );
  //busco la posicion del elemento que clicko en el array de favs
  const favsFound = seriesFavs.findIndex((fav) => {
    return fav.show.id === serieId;
  });
  //si la serie no esta en favs findIndex me devuelve -1
  if ( favsFound === -1 ) {
    //añado al array de favs
    seriesFavs.push(serieClicked);
  } else {
    seriesFavs.splice(favsFound, 1);
  }
  console.log(seriesFavs);
  paintFavs();
}

//funcion para clickar sobre el li que contiene la serie
function listenSerie() {
  const serieBox = document.querySelectorAll('.js-serieBox');
  for (const serieLi of serieBox) {
    serieLi.addEventListener('click', handleClickEv);
  }
}

//pintar favs
function paintFavs() {
  let favSeriesHtml = '<li class="title-fav">Series favoritas: </li>';
  for (const fav of seriesFavs) {
    let title = fav.show.name;
    let id = fav.show.id;
    let img = fav.show.image;
    let imgDefault = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    if (img === null) {
      img = imgDefault;
    } else {
      img = fav.show.image.medium;
    }
    favSeriesHtml += `<li class=" js-serieBox" id="${id}">`;
    favSeriesHtml += `<img src="${img}" width="250" height="250" class="img-fav />`;
    favSeriesHtml += `<h3 class="serie-title">${title}</h3>`;
    favSeriesHtml += `</li>`;
  }
  seriesFavourites.innerHTML = favSeriesHtml;
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

//almacenar listado de series favs en localStorage