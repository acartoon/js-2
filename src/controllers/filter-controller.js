import { render } from "../utils.js";
import MovieBoardMore from "./movie-board-more.js";

export default class FilterController {
  constructor(container) {
    this._container = container;
    this._movieData = [];
    this._commentsData = [];
    // this._mainContainer = this._container.querySelector('.main');
    // this._mainNavController = new MainNavController(this._container.querySelector('.main'));
  }

  init(movieData, commentsData, filterType) {
    this._movieData = movieData;
    this._commentsData = commentsData;

    const filterData = {
      'watchlist': this._getWachList(),
      'history': this._getHistoryList(),
      'favorites': this._getFavoriteList(),
    }

    const data = filterData[filterType];
    this._render(data);
  }

  _render(data) {
    console.log(data)
    this._movieData = data;
    const parameters = {movieData: this._movieData, isExtra: false, title: `All movies. Upcoming`};
    console.log(this._container)
    // this._container.innerHTML = ``;
    this._filterBoard = new MovieBoardMore(parameters, this._commentsData, this._container);
    this._filterBoard.init();
  }

  _getWachList() {
    return this._movieData.filter((movie) => {
      return movie[`user_details`][`watchlist`] === true;
    });
  }

  _getHistoryList() {
    return this._movieData.filter((movie) => {
      return movie[`user_details`][`already_watched`] === true;
    });

  }

  _getFavoriteList() {
    return this._movieData.filter((movie) => {
      return movie[`user_details`][`favorite`] === true;
    });
  }
}
