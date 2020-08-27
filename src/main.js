import MainController from './controllers/main-controller.js';
import API from './api/api.js';
import {TypeDataChange} from './utils.js';
import Store from "./api/store";
import Provider from './api/provider.js';
import FooterComponent from './components/footer-component.js';

const MOVIE_STORE_KEY = `movie-store-key`;
const AUTHORIZATION = `Basic ${ new Date().valueOf() }`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({storage: window.localStorage, key: MOVIE_STORE_KEY});
const provider = new Provider({api, store});

const bodyContainer = document.body;
const footer = document.querySelector(`.footer__statistics`);
const footerStatistics = new FooterComponent(footer);

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
  window.addEventListener(`online`, onWindowOnline);
});

window.addEventListener(`online`, () => {
  // console.log(`online`);
  document.title = document.title.split(`[OFFLINE]`)[0];
});

const onWindowOnline = () => {
  provider.sync();
};

const onDataChange = (({typeData, movie, comment}) => {
  switch (typeData) {
    case TypeDataChange.CREATE_COMMENT:
      provider.createComment(movie.id, comment)
      .then(({newMovie, comments}) => {
        mainController.update({newMovie, comments});
      })
      .catch(() => {
        mainController.onError();
      });
      break;
    case TypeDataChange.REMOVE_COMMENT:
      provider.removeComment(comment, movie)
        .then(({newMovie, comments}) => {
          mainController.update({newMovie, comments});
        });
      break;
    case TypeDataChange.USER_DETAILS:
      provider.updateMovie(movie.id, movie)
      .then((newMovie) => {
        console.log(newMovie)
        mainController.update({newMovie});
      })
        .catch(() => {
          mainController.onError();
        });
      break;
  }
});


const mainController = new MainController(bodyContainer, onDataChange);
mainController.init();

provider.getMovie().then((data) => {
  // запуск приложения с данными
  mainController.load(data, provider);

  // загрузка поиска, фильмов
  // mainController.init(load, provider);
  footerStatistics.init(data.length);
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
  // .then(function(reg) {
  //   // регистрация сработала
  //   // console.log(`Registration succeeded. Scope is ${reg.scope}`);
  // })
  // .catch(function(error) {
  //   // регистрация прошла неудачно
  //   // console.log(`Registration failed with ${error}`);
  // });
});
