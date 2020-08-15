import MainController from './controllers/main-controller.js';
import API from './api/api.js';
import {typeDataChange} from './utils.js';
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
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer__statistics`);
const footerStatistics = new FooterComponent(footer);


// const mainController = new MainController(bodyContainer, onDataChange);
// запуск меню, фильтров, статуса пользователя
// mainController.init();

// loading
// const title = new TitleComponent(main);
// title.init();

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

const onDataChange = (({typeData, movie, comment}) => {
  switch (typeData) {
    case typeDataChange.CREATE_COMMENT:
      provider.createComment(movie.id, comment)
      .then(({movie, comments}) => {
        mainController.update({movie, comments})
      })
      .catch(() => {
        mainController.onError();
      })
      break;
    case typeDataChange.REMOVE_COMMENT:
      provider.removeComment(comment, movie)
        .then(({movie, comments}) => {
          mainController.update({movie, comments});
        });
      break;
    case typeDataChange.USER_DETAILS:
      provider.updateMovie(movie.id, movie)
      .then((movie) => {
          mainController.update({movie: movie});
        })
        .catch((movie) => {
          mainController.onError();
        });
        break;
    // case typeDataChange.RATING:
    //   provider.updateMovie(movie.id, value)
    //   .then((movie) => {
    //     mainController.update({movie: movie});
    //   })
    //   .catch(() => {
    //     mainController.onError();
    //   });
    //   break;
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
