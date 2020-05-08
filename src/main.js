import {movie, comments} from './data.js';
import MainController from './controllers/main-controller.js';

const bodyContainer = document.body;

const mainController = new MainController(bodyContainer, movie, comments);
mainController.init();

// const footerStatistics = document.querySelector(`.footer__statistics p`);
// footerStatistics.innerHTML = `${movie.length} movies inside`;
