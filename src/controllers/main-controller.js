import HomePageController from "./home-page-controller.js";
import Search from "../components/search.js";
import Profile from "../components/profile.js";
import { render } from "../utils.js";
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
    this._homePage = new HomePageController(this._mainContainer);
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
