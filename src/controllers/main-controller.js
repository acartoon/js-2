import HomePageController from "./home-page-controller.js";
import Search from "../components/search.js";
import Profile from "../components/profile.js";
import { render, DATA_CHANGE } from "../utils.js";
import MainNavController from "./main-nav-controller.js";
import FilterController from "./filter-controller.js";

export default class MainPageController {
  constructor(container, movieData, commentsData) {
    this._container= container;
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._search = new Search();
    this._profile = new Profile();
    this._mainContainer = this._container.querySelector('.main');
    this._onMainBtnClick = this._onMainBtnClick.bind(this);
    this._mainNavController = new MainNavController(this._mainContainer, this._onMainBtnClick);
    this._homePage = new HomePageController(this._mainContainer, this.onDataChange.bind(this));
    this._activeWindow = null;
    this._filterBoard = null;
    this._filterController = new FilterController(this._mainContainer);
  }

  init() {
    // запуск главной страницы
    const header = this._container.querySelector('.header');
    this._renderSearchForm(header);
    this._renderProfile(header);
    this._mainNavController.init(this._movieData);
    this._homePage.init(this._movieData, this._commentsData);
    this._activeWindow = this._homePage;
    this.onDataChange = this.onDataChange.bind(this);
  }

  onDataChange(typeData, movieId, data, movie) {

    const index = this._movieData.findIndex((i) => i.id === movieId);

    if(typeData === DATA_CHANGE.WATCHLIST) {
      this._movieData[index].user_details.watchlist = data;
    } else if(typeData === DATA_CHANGE.FAVORITE) {
      this._movieData[index].user_details.favorite = data;
    } else if(typeData === DATA_CHANGE.ALREADY_WATCHED) {
      this._movieData[index].user_details.already_watched = data;
    } else if(typeData === DATA_CHANGE.CREATE_COMMENT) {

    } else if(typeData === DATA_CHANGE.REMOVE_COMMENT) {

    } else if(typeData === DATA_CHANGE.RATING) {

    }
    this._activeWindow.update(movie, movieId, this._movieData[index].user_details);
  }

  _onMainBtnClick(filterType) {
    // this._activeWindow.hide();
    if(filterType === `stats`) {
      this._stats.show(this._movieData);
    } else {
      this._homePage.show(this._movieData, filterType);
    }
  };

  _renderSearchForm(container) {
    render(container, this._search.getElement())
  }

  _renderProfile(container) {
    render(container, this._profile.getElement())
  }

  _renderStats() {

  }
}
