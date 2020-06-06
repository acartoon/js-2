// import {movie, comments} from './data.js';
import MainController from './controllers/main-controller.js';
import API from './controllers/api.js';
import { CREATE_COMMENT, REMOVE_COMMENT, DATA_CHANGE_USER_DETAILS, RATING } from './utils.js';
import Store from "./controllers/store";
import Provider from './controllers/provider.js';
const MOVIE_STORE_KEY = `movie-store-key`;
const bodyContainer = document.body;

// const footerStatistics = document.querySelector(`.footer__statistics p`);
// footerStatistics.innerHTML = `${movie.length} movies inside`;

//////////////
//// main.js
//////////////
const AUTHORIZATION = `Basic ${ new Date().valueOf() }`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({storage: window.localStorage, key: MOVIE_STORE_KEY});
const provider = new Provider({api, store});

// const onDataChange = ((action, id, array) => {
const onDataChange = (({typeDataChange, movie, value}) => {

  console.log(movie)
  switch (typeDataChange) {
    case CREATE_COMMENT:
      provider.createComment(movie.id, value).
      then(({movie, comments}) => {
        console.log(movie, comments)
        mainController.update({movie, comments})
      });
      break;
    case REMOVE_COMMENT:
      provider.removeComment(value, movie).
        then(({movie, comments}) => {
          console.log(movie, comments)
          mainController.update({movie, comments});
        });
      break;
    case DATA_CHANGE_USER_DETAILS:
      provider.updateMovie(movie.id, value).
        then((movie) => {
          mainController.update({movie: movie});
        });
      break;
    case RATING:
      provider.updateMovie(movie.id, value).
        then((movie) => {
          mainController.update({movie: movie});
        });
      break;

    }
  });

const mainController = new MainController(bodyContainer, onDataChange);

provider.getMovie().then((data) => {
  mainController.init(data, provider);
});
