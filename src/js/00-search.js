'use strict';
//Array donde voy a guardar las series que me devuelve el servidor
let series = [];
//donde voy a pintar mis series
const seriesList = document.querySelector('.js-series-list');
//traemos el input del HTML
const info = document.querySelector('.js-input');
//cogemos el valor que escribe el usuario en el input
const getInfo = info.value;
//url + valor que mete el usuario ->`http://api.tvmaze.com/search/shows?q=${getInfo}`;
const url = 'http://api.tvmaze.com/search/shows?q=girls';
//traemos el botón de HTML
const btn = document.querySelector('.js-btn');


function paintSeries() {
  let html = '';
  for (const serie of series) {
   console.log(serie);
   html += `<li class="js-series section__series--serie">`;
   html += `<h3 class="name-serie">${serie.show}</h3>`;
   html += `<img src="${serie.image}"`;
   html += `</li>`;
    }
    seriesList.innerHTML = html;
}


//NO FUNCIONA METER EL INPUT QUE QUIERAS Y QUE TE DEVUELVA LA SERIE
//peticion al servidor
function handleGetInfoSeries() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      series = data;
      paintSeries();
    });
}

btn.addEventListener('click', handleGetInfoSeries);

/*
const btn = document.querySelector('.js-btn');

const getInfoSerie = document.querySelector('.js-input');

const getSerie = getInfoSerie.value;

const url = '//api.tvmaze.com/search/shows?q=' + getSerie;


function handleGetInfoSeries(ev) {
  ev.preventDefault();
}

btn.addEventListener('click', handleGetInfoSeries);

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    series = data.name;
});*/