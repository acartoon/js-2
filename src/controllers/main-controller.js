import HomePageController from "./home-page-controller.js";
import Search from "../components/search.js";
import Profile from "../components/profile.js";
import { render, DATA_CHANGE, DATA_CHANGE_TYPE, DATA_CHANGE_USER_DETAILS, DATA_CHANGE_COMMENTS } from "../utils.js";
import MainNavController from "./main-nav-controller.js";

export default class MainPageController {
  constructor(container, movieData, commentsData) {
    this._container= container;
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._profile = new Profile();
    this._mainContainer = this._container.querySelector('.main');
    this._onMainBtnClick = this._onMainBtnClick.bind(this);
    this._mainNavController = new MainNavController(this._mainContainer, this._onMainBtnClick);
    this._homePage = new HomePageController(this._mainContainer, this.onDataChange.bind(this));
    this._activeWindow = null;
    this._filterBoard = null;
    this.initSearch = this.initSearch.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this._MIN_LENGTH_VALUE = 3;
    this._search = new Search(this.initSearch, this.resetSearch, this._MIN_LENGTH_VALUE);
  }

  init() {
    const header = this._container.querySelector('.header');
    this._renderSearchForm(header);
    this._renderProfile(header);
    this._mainNavController.init(this._movieData);
    this._homePage.init(this._movieData, this._commentsData);
    this._activeWindow = this._homePage;
    this.onDataChange = this.onDataChange.bind(this);
  }

  initSearch(searchData) {
    this._homePage.initSearch(searchData);
    this._mainNavController.hide();
  }

  resetSearch() {
    this._homePage.home();
    this._mainNavController.show();
  }

  onDataChange(typeData, movieId, data, movie) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    let dataChange;

    switch (typeData) {
      case DATA_CHANGE.WATCHLIST:
        this._movieData[index].user_details.watchlist = data;
        dataChange = this._movieData[index].user_details;
        break;
      case DATA_CHANGE.FAVORITE:
        this._movieData[index].user_details.favorite = data;
        dataChange = this._movieData[index].user_details;
        break;
      case DATA_CHANGE.ALREADY_WATCHED:
        this._movieData[index].user_details.already_watched = data;
        dataChange = this._movieData[index].user_details;
        if(!this._movieData[index].user_details.already_watched) {
          this._movieData[index].user_details.personal_rating = null;
          this._movieData[index].user_details.watching_date = null;
        }
        break;
      case DATA_CHANGE.CREATE_COMMENT:
        this._movieData[index].comments.unshift(data.id)
        this._commentsData.unshift(data);
        dataChange = {};
        dataChange[DATA_CHANGE_USER_DETAILS] = this._movieData[index].comments;
        dataChange[DATA_CHANGE_COMMENTS] = this._commentsData;
        break;
      case DATA_CHANGE.REMOVE_COMMENT:
        const commentIndex = this._movieData[index].comments.findIndex((i) => i === data);
        const commentIndex1 = this._commentsData.findIndex((i) => i.id === data);
        this._movieData[index].comments.splice(commentIndex, 1);
        this._commentsData.splice(commentIndex1, 1);
        dataChange = {};
        dataChange[DATA_CHANGE_USER_DETAILS] = this._movieData[index].comments;
        dataChange[DATA_CHANGE_COMMENTS] = this._commentsData;
        break;
        case DATA_CHANGE.RATING:
          this._movieData[index].user_details.personal_rating = data;
          this._movieData[index].user_details.watching_date = new Date();
          dataChange = this._movieData[index].user_details;
          break;
    }
    this._activeWindow.update(DATA_CHANGE_TYPE[typeData], movie, movieId, dataChange);
  }

  _onMainBtnClick(filterType) {
    if(filterType === `stats`) {
      this._stats.show(this._movieData);
    } else {
      this._homePage.renderFilter(filterType);
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
