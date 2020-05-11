import MovieContainer from "../components/movie-container";
import { render, Position, BOARDS_LIST, hideElement, filterFlag } from "../utils";
import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";
import MovieBoardMore from "./movie-board-more";
import Sort from "../components/sort.js";

export default class HomePageController {
  constructor(container, onDataChangeMain) {
    this._mainContainer = container;
    this._container = new MovieContainer();
    this._EXTRA_COUNT_MOVIE = 2;
    this._btnShowMore = new BtnShowMore();
    this._onSortBtnClick = this._onSortBtnClick.bind(this);
    this._sort = new Sort(this._onSortBtnClick);
    this._mainBoardData = [];
    this._filterType = 'all';
    this._onDataChangeMain = onDataChangeMain;
    this.onDataChange = this.onDataChange.bind(this)
  }

  init(movieData, commentsData) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._mainBoardData = this._movieData;

    this._renderSort(this._mainContainer);
    render(this._mainContainer, this._container.getElement(), Position.BEFOREEND);


    this._mainBoard = new MovieBoardMore(BOARDS_LIST.ALL, this._mainBoardData, this._commentsData, this._container.getElement(), this.onDataChange);
    this._mainBoard.init();

    this._topRated = new MovieBoard(BOARDS_LIST.TOP_RATED, this._getTopRatedMovie(this._movieData), this._commentsData, this._container.getElement(), this.onDataChange);
    this._topRated.init();

    this._mostCommented = new MovieBoard(BOARDS_LIST.MOST_COMMENTED, this._getMostCommentedMovie(this._movieData), this._commentsData, this._container.getElement(), this.onDataChange);
    this._mostCommented.init();
  };

  _renderSort(container) {
    render(container, this._sort.getElement());
  }

  _getTopRatedMovie(movieData) {
    const topRatedMovie = movieData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating);
     return topRatedMovie.slice(0, this._EXTRA_COUNT_MOVIE)
  }

  _getMostCommentedMovie(movieData) {
    const mostCommentedMovie =  movieData.slice().sort((a, b) => b.comments.length - a.comments.length);
     return mostCommentedMovie.slice(0, this._EXTRA_COUNT_MOVIE);
  }

  _rerendMainBoard(movieData, flag) {
    this._mainBoard.render(movieData, flag);
  }

  _onSortBtnClick(sortType) {
    const movieDataToRender = {
      date: this._mainBoardData.slice().sort((a, b) => a.film_info.release.date - b.film_info.release.date),
      rating: this._mainBoardData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating),
      default: this._mainBoardData,
      // 'comments': movieData.slice().sort((a, b) => b.comments.length - a.comments.length),
    };
    this._rerendMainBoard(movieDataToRender[sortType], filterFlag.save);
  }

  onDataChange(typeData, movieId, data, movie) {
    this._onDataChangeMain(typeData, movieId, data, movie);

    // const index = this._movieData.findIndex((i) => i.id === movieId);
    // this._movieData[index].user_details = userDetails;
    // console.log(this._movieData);
  }

  _updateData(movieId, user_details) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    this._movieData[index].user_details = user_details;
  }

  update(movie, movieId, user_details) {
    this._updateData(movieId, user_details);

    this._mainBoard.update(movie, movieId, user_details);
    this._topRated.update(movie, movieId, user_details);
    this._mostCommented.update(movie, movieId, user_details);
  }

  _getMainBoardData(fulterType) {
    const data = {
      all: this._movieData,
      watchlist: this._movieData.filter((movie) => movie[`user_details`][`watchlist`] === true),
      history: this._movieData.filter((movie) => movie[`user_details`][`already_watched`] === true),
      favorites: this._movieData.filter((movie) => movie[`user_details`][`favorite`] === true),
    }
    return data[fulterType];
  }

  hide() {

  }

  show(movieData, filterType) {
    this._sort.default();
    this._movieData = movieData;
    this._mainBoardData = this._getMainBoardData(filterType);
    this._rerendMainBoard(this._mainBoardData, filterFlag.reset)
  }
}
