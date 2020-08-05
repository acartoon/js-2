// import {movie, comments} from './data.js';
import MainController from './controllers/main-controller.js';
import API from './api/api.js';
import { CREATE_COMMENT, REMOVE_COMMENT, DATA_CHANGE_USER_DETAILS, RATING } from './utils.js';
import Store from "./api/store";
import Provider from './api/provider.js';
import TitleComponent from './components/title-component.js';
import FooterComponent from './components/footer-component.js';


const MOVIE_STORE_KEY = `movie-store-key`;
const AUTHORIZATION = `Basic ${ new Date().valueOf() }`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({storage: window.localStorage, key: MOVIE_STORE_KEY});
const provider = new Provider({api, store});

const bodyContainer = document.body;
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer__statistics`);
const footerStatistics = new FooterComponent(footer);


const mainController = new MainController(bodyContainer, onDataChange);
// mainController.init();

// loading
const title = new TitleComponent(main);
title.init();
debugger;

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
  window.addEventListener(`online`,  onWindowOnline);
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];;
});

const onWindowOnline = () => {
  provider.sync()
}

const onDataChange = (({typeDataChange, movie, value}) => {

  switch (typeDataChange) {
    case CREATE_COMMENT:
      provider.createComment(movie.id, value)
      .then(({movie, comments}) => {
        mainController.update({movie, comments})
      })
      .catch(() => {
        mainController.onError();
      })
      break;
    case REMOVE_COMMENT:
      provider.removeComment(value, movie).
        then(({movie, comments}) => {
          mainController.update({movie, comments});
        });
      break;
    case DATA_CHANGE_USER_DETAILS:
      provider.updateMovie(movie.id, value)
      .then((movie) => {
          mainController.update({movie: movie});
        })
        .catch(() => {
          mainController.onError();
        });
        break;
        case RATING:
          provider.updateMovie(movie.id, value).
          then((movie) => {
            mainController.update({movie: movie});
          })
          .catch(() => {
            mainController.onError();
          });
      break;

    }
  });



provider.getMovie().then((data) => {
  title.remove();

  // запуск приложения с данными
  mainController.init(data, provider);
  footerStatistics.init(data.length);
});
window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
  .then(function(reg) {
    // регистрация сработала
    console.log(`Registration succeeded. Scope is ${reg.scope}`);
  })
  .catch(function(error) {
    // регистрация прошла неудачно
    console.log(`Registration failed with ${error}`);
  });
});
