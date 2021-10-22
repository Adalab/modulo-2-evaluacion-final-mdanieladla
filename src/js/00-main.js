/* eslint-disable no-console */
'use strict';
// * Arrays donde voy a guardar las series que me devuelve el servidor y las series favs * \\
let series = [];
let seriesFavs = [];
// * donde voy a pintar mis series * \\
let seriesList = document.querySelector('.js-series-list');
// * donde voy a pintar mis series favoritas * \\
const seriesFavourites = document.querySelector('.js-favs');
// * traemos el input del HTML * \\
const input = document.querySelector('.js-input');
// *traemos el botón de HTML * \\
const btn = document.querySelector('.js-btn');
// * traemos el botón de reset de HTML * \\
const resetBtn = document.querySelector('.js-btn-delete');
// * traemos el icono de HTML * \\
const deleteIcon = document.querySelector('.js-icon');
// traemos elemento de donde pintamos los resultados.
let results = document.querySelector('.js-results');

let arr = [2, 5, 9];

function handleRunLoop() {
  for (const item of arr) {
    if (series.length > item) {
      console.log(
        `El número de resultados es: ${series.length} y es mayor que ${item}`
      );
    } else {
      console.log(
        `El número de resultados es: ${series.length} y es menor que ${item}`
      );
    }
  }
}

results.addEventListener('click', handleRunLoop);
// *** función para que al pulsar el botón llame a la api *** \\\
function handleGetInfoSeries() {
  getApi();
}

btn.addEventListener('click', handleGetInfoSeries);

// *** función para pintar las series *** \\\
function paintSeries() {
  results.innerHTML = `<Número de series que coinciden: ${series.length}`;
  let html = '';
  let favClass = '';
  for (const serie of series) {
    const isFavorite = isFav(serie);
    if (isFavorite) {
      favClass = 'color-fav';
    } else {
      favClass = '';
    }
    const serieTitle = serie.show.name;
    let img = serie.show.image;
    let imgDefault =
      'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    if (img === null) {
      img = imgDefault;
    } else {
      img = serie.show.image.medium;
    }
    let dateOfPremiere = serie.show.premiered;
    if (dateOfPremiere === null) {
      dateOfPremiere = 'No se ha estrenado todavía.';
    } else {
      dateOfPremiere;
    }
    html += `<li class="list--li js-serieBox ${favClass}" id="${serie.show.id}">`;
    html += `<img src="${img}" width="315" height="315" class="serie-img"/>`;
    html += `<div class="premiere"> ${dateOfPremiere}</div>`;
    html += `<h3 class="serie-title">${serieTitle}</h3>`;
    html += `</li>`;
  }
  seriesList.innerHTML = html;
  listenSerie();
}

// *** función para prevenir que el btn recargue la pagina por defecto *** \\\
function preventBtn(ev) {
  ev.preventDefault();
}

btn.addEventListener('click', preventBtn);

// *** función para que me diga donde he hecho click *** \\\
function handleClickEv(ev) {
  //obtener el id de la serie clickada
  const serieId = parseInt(ev.currentTarget.id);
  //busco el id de la serie clickada en el array de series
  const serieClicked = series.find(
    (serieObject) => serieObject.show.id === serieId
  );
  //busco la posición del elemento que clicko en el array de favs
  const favsFound = seriesFavs.findIndex((fav) => {
    return fav.show.id === serieId;
  });
  //si la serie no esta en favs, findIndex me devuelve -1
  if (favsFound === -1) {
    //añado al array de favs
    seriesFavs.push(serieClicked);
  } else {
    seriesFavs.splice(favsFound, 1);
  }
  paintFavs();
  paintSeries();
  setLocalStorage();
}

// *** función para clickar sobre el li que contiene la serie *** \\\
function listenSerie() {
  const serieBox = document.querySelectorAll('.js-serieBox');
  for (const serieLi of serieBox) {
    serieLi.addEventListener('click', handleClickEv);
  }
}

// *** función para pintar las series favoritas *** \\\
function paintFavs() {
  seriesFavourites.innerHTML = '';
  let favsTitle = `<li class="title-fav">Series favoritas: </li>`;
  let favSeriesHtml = '';
  for (const fav of seriesFavs) {
    let title = fav.show.name;
    let id = fav.show.id;
    let img = fav.show.image;
    let imgDefault =
      'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    if (img === null) {
      img = imgDefault;
    } else {
      img = fav.show.image.medium;
    }
    favSeriesHtml += `<li class="li--fav js-serieBox" id="${id}">`;
    favSeriesHtml += `<img src="${img}" width="200" height="200" class="img-fav" />`;
    favSeriesHtml += `<h3 class="serie-title">${title}</h3>`;
    favSeriesHtml += `<button  id="${id}" class="js-delete-btn delete-btn">X</button>`;
    favSeriesHtml += `</li>`;
  }
  seriesFavourites.innerHTML += favsTitle;
  seriesFavourites.innerHTML += favSeriesHtml;
}

// *** función para buscar si la serie se encuentra dentro de favoritos o no ***\\\
function isFav(serie) {
  const favoriteFound = seriesFavs.find((fav) => {
    return fav.show.id === serie.show.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

// *** función para eliminar los favs desde el botón X de cada uno *** \\\
function deleteFavSerie() {
  const deleteBtn = document.querySelectorAll('.js-delete-btn');
  for (const removeBtn of deleteBtn) {
    removeBtn.addEventListener('click', deleteFavorite);
  }
}

// *** función para saber cual es el id de la serie que clickamos para quitar de favoritos y poder quitar del LS el que coincida con el ID que clickamos. *** \\\
function deleteFavorite(ev) {
  const selectedSerieId = parseInt(ev.currentTarget.id);
  const clickedSerie = seriesFavs.findIndex((fav) => {
    return fav.show.id === selectedSerieId;
  });
  if (clickedSerie !== -1) {
    seriesFavs.splice(clickedSerie, 1);
  }
  paintFavs();
  paintSeries();
}

// *** función para borrar todas la series de favoritos del LS a la vez pulsando un solo botón *** \\\
function deleteAllFavs() {
  seriesFavs = [];
  paintFavs();
  localStorage.clear();
}

deleteIcon.addEventListener('click', deleteAllFavs);

// *** función para añadir la info al local storage *** \\\
function setLocalStorage() {
  const stringSeries = JSON.stringify(seriesFavs);
  //añadimos a LS los datos
  localStorage.setItem('seriesFavs', stringSeries);
}

// *** función para llamar al api *** \\\
function getApi() {
  const getInfo = input.value;
  const url = `https://api.tvmaze.com/search/shows?q=${getInfo}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      series = data;
      paintSeries();
      setLocalStorage();
    });
}

// *** almacenar listado de series favs en localStorage para no tener que hacer petición al servidor cada vez que cargue la página *** \\\
function getLocalStorage() {
  //Obtenemos lo que hay en el localStorage
  const localStorageSeries = localStorage.getItem('seriesFavs');
  //comprobar si tengo datos o es la primera vez que entro a la página
  if (localStorageSeries === null) {
    //no tengo datos asi que llamo al API
    getApi();
  } else {
    //si tengo datos en el LS, los parseo a un JSON
    const arrayFavs = JSON.parse(localStorageSeries);
    //y los guardo en la variable global de series favoritas
    seriesFavs = arrayFavs;
    //cada vez que modifico los arrays de series favoritas lo vuelvo a pintar y a escuchar eventos.
    paintFavs();
    deleteFavSerie();
  }
}

// *** start app, cuando se carga la página *** \\\
getLocalStorage();

// *** función para hacer que me refresque la página al darle al boton de reset *** \\\
function handleClickResetBtn() {
  location.reload();
}

resetBtn.addEventListener('click', handleClickResetBtn);
