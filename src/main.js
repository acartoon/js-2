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
const title = new TitleComponent(main);


const onDataChange = (({typeDataChange, movie, value}) => {

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
  footerStatistics.innerHTML = `${data.length} movies inside`;
  if(data.length === 0) {
    title.initNoMovieTitle();
    return;
  }
  title.remove();

  footerStatistics.init(data.length)
  mainController.init(data, provider);
});
