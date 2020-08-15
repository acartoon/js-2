import HomePageController from "./home-page-controller.js";
import Search from "../components/search.js";
import Profile from "../components/profile.js";
import {rank, getRank, filter, typeDataChange} from "../utils.js";
import MainNavController from "./main-nav-controller.js";
import StatsController from "./stats.js";
import {cloneDeep} from 'lodash';

export default class MainPageController {
  constructor(container, onDataChange) {
    this._container = container;
    this._profile = new Profile();
    this._onDataChangeMain = onDataChange;
    this._mainContainer = this._container.querySelector('.main');
    this._onMainBtnClick = this._onMainBtnClick.bind(this);
    this._mainNavController = new MainNavController(this._mainContainer, this._onMainBtnClick);
    this._homePage = new HomePageController(this._mainContainer, this.onDataChange.bind(this));
    this.initSearch = this.initSearch.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this._search = new Search(this.initSearch, this.resetSearch, this._MIN_LENGTH_VALUE);
    this._stats = new StatsController(this._mainContainer);
    this.onDataChange = this.onDataChange.bind(this);
    this._header = this._container.querySelector('.header');
    this._MIN_LENGTH_VALUE = 3;
    this._tmpData = null;
    this._dataChangeType = null;
    this._activeWindow = null;
    this._filterBoard = null;
  }

  load(movieData, api) {
    console.log(movieData)
    this._movieData = movieData;
    const userRank = getRank(this._movieData.length, rank);

    this._api = api;
    this.render();
    this._profile.init(this._header, userRank);


    // навигация
    this._mainNavController.init(this._movieData);
  }

  init() {
    this._profile.init(this._header, rank.NOTICE);
    this._mainNavController.init([]);
    this._homePage.load();
  }

  render(movieData) {
    // this._search.init(this._header);
    this._homePage.init(this._movieData, this._api);
    this._activeWindow = this._homePage;
  }

  _initTmpData(data) {
    this._tmpData = cloneDeep(data);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  initSearch(searchData) {
    this._homePage.initSearch(searchData);
    this._mainNavController.hide();
  }

  resetSearch() {
    this._homePage.showMainWindow();
    this._mainNavController.show();
  }

  // передача данных в main
  onDataChange({typeData, movieId, value}) {
    this._dataChangeType = typeData;
    this._movieIndex = this._movieData.findIndex((i) => i.id === movieId);
    this._initTmpData(this._movieData[this._movieIndex]);

    if(typeData === typeDataChange.USER_DETAILS) {
      this._tmpData.user_details = value;
    }

    // если с сервера приходит watching_date = null, обратно упадет ошибка
    if (!this._movieData[this._movieIndex].user_details.watching_date) {
      this._tmpData.user_details.watching_date = new Date().toISOString();
    }

    // если изменился already_watched поставить текущую дату
    if (this._tmpData.user_details.already_watched !== this._movieData[this._movieIndex].already_watched) {
      this._tmpData.user_details.watching_date = new Date().toISOString();
    }

    // название comment возможно чем-то заменить
    this._onDataChangeMain({typeData: this._dataChangeType, movie: this._tmpData, comment: value});
    this._resetTmpData();
  }

  onError() {
    this._activeWindow.onError({typeData: this._dataChangeType, movieId: this._movieData[this._movieIndex].id});
  }

  update({movie, comments}) {
    let value;
    const movieId = this._movieData[this._movieIndex].id;
    this._movieData[this._movieIndex] = cloneDeep(movie);

    switch (this._dataChangeType) {
      case typeDataChange.USER_DETAILS:
        value = this._movieData[this._movieIndex].user_details
        break;
      case typeDataChange.REMOVE_COMMENT:
        value = {}
        value[`movie`] = this._movieData[this._movieIndex][`comments`];
        value[`comments`] = comments;
        break;
      case typeDataChange.CREATE_COMMENT:
        value = {}
        value[`movie`] = this._movieData[this._movieIndex][`comments`];
        value[`comments`] = comments;
        break;
    }

    this._activeWindow.update({typeData: this._dataChangeType, movieId: movieId, value});
    this._mainNavController.init(this._movieData);
  }

  _onMainBtnClick(filterType) {
    if(filterType === filter.STATS.anchor) {
      this._stats.show(this._movieData);
      this._homePage.hide();
      this._activeWindow = this._stats;
    } else {
      switch(this._activeWindow) {
        case this._stats:
          this._stats.hide();
          this._homePage.show();
          this._activeWindow = this._homePage;
          break;
        default:
          this._homePage.renderFilter(filterType);
          break;
      }
    }
  };
}
