import HomePageController from "./home-page-controller.js";
// import Search from "../components/search.js";
import Profile from "../components/profile.js";
import {Rank, getRank, Filter, TypeDataChange} from "../utils.js";
import MainNavController from "./main-nav-controller.js";
import StatsController from "./stats.js";
import {cloneDeep} from 'lodash';

export default class MainPageController {
  constructor(container, onDataChange) {
    this._container = container;
    this._profile = new Profile();
    this._onDataChangeMain = onDataChange;
    this._mainContainer = this._container.querySelector(`.main`);
    this.onMainBtnClick = this.onMainBtnClick.bind(this);
    this._mainNavController = new MainNavController(this._mainContainer, this.onMainBtnClick);
    this._homePage = new HomePageController(this._mainContainer, this.onDataChange.bind(this));
    this._stats = new StatsController(this._mainContainer);
    this.onDataChange = this.onDataChange.bind(this);
    this._header = this._container.querySelector(`.header`);
    this._MIN_LENGTH_VALUE = 3;
    this._tmpData = null;
    this._dataChangeType = null;
    this._activeWindow = null;
    this._filterBoard = null;
  }

  init() {
    this._profile.init(this._header, Rank.NOTICE);
    this._mainNavController.init([]);
    this._homePage.load();
  }

  load(movieData, api) {
    console.log(movieData);
    this._movieData = movieData;
    const userRank = getRank(this._movieData.length);

    this._api = api;

    this._homePage.init(this._movieData, this._api);
    this._activeWindow = this._homePage;

    this._profile.init(this._header, userRank);

    // навигация
    this._mainNavController.init(this._movieData);
  }

  update({newMovie, comments}) {
    let value;
    const movieId = this._movieData[this._movieIndex].id;
    this._movieData[this._movieIndex] = cloneDeep(newMovie);

    switch (this._dataChangeType) {
      case TypeDataChange.USER_DETAILS:
        value = this._movieData[this._movieIndex].user_details;
      break;
      default:
        value = {};
        value[`movie`] = this._movieData[this._movieIndex][`comments`];
        value[`comments`] = comments;
    }
    this._homePage.update({typeData: this._dataChangeType, movieId: movieId, value});
    this._mainNavController.init(this._movieData);
  }

  _initTmpData(data) {
    this._tmpData = cloneDeep(data);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  onMainBtnClick(filterType) {
    switch (filterType) {
      case Filter.STATS.anchor:
        this._stats.show(this._movieData);
        this._homePage.hide();
        this._activeWindow = this._stats;
        break;
      default:
        if (this._activeWindow === this._stats) {
          this._stats.hide();
          this._homePage.show();
          this._activeWindow = this._homePage;
        }
        this._homePage.renderFilter(filterType);
    }
  }

  // передача данных в main
  onDataChange({typeData, movieId, value}) {
    this._dataChangeType = typeData;
    this._movieIndex = this._movieData.findIndex((i) => i.id === movieId);
    this._initTmpData(this._movieData[this._movieIndex]);

    if (typeData === TypeDataChange.USER_DETAILS) {
      this._tmpData.user_details = value;
    }

    // если с сервера приходит watching_date = null, надо поставить дату, иначе упадет ошибка
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
}
