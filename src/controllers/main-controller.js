import HomePageController from "./home-page-controller.js";

export default class MainPageController {
  constructor(container, movieData, commentsData) {
    this._container= container;
    this._movieData = movieData;
    this._commentsData = commentsData;
  }

  init() {
    // запуск главной страницы
    const container = this._container.querySelector('.main');
    const homePage = new HomePageController(container, this._movieData, this._commentsData);
    homePage.init();
  }
}
