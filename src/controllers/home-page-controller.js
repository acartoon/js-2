import MovieContainer from "../components/movie-container";
import {render, BoardList, hideElement, showElement, CountFlag, TypeDataChange, Filter, unrender} from "../utils";
import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";
import MovieBoardMore from "./movie-board-more";
import Sort from "../components/sort.js";
import MovieList from "../components/movie-list";
import ResultTitle from "../components/result-title";

export default class HomePageController {
  constructor(container, onDataChange) {
    this._mainContainer = container;
    this._container = new MovieContainer();
    this._EXTRA_COUNT_MOVIE = 2;
    this._btnShowMore = new BtnShowMore();
    this._onSortBtnClick = this._onSortBtnClick.bind(this);
    this._sort = new Sort(this._onSortBtnClick);
    this._mainBoardData = []; // для сортировки главного боарда
    this._filterType = Filter.ALL.anchor;
    this.onDataChange = onDataChange; // из main
    this._mainBoardContainer = null;
    this._resultTitle = new ResultTitle(this._mainContainer);
    this._searchController = null;
    this._boardList = [];
    this._api = null;
  }

  load() {
    this._renderSort(this._mainContainer);
    render(this._mainContainer, this._container.getElement());
    this._initContainer = new MovieList(BoardList.LOADING, false);
    render(this._container.getElement(), this._initContainer.getElement());
  }

  init(movieData, api) {
    this._api = api;

    // все фильмы
    this._movieData = movieData;
    this._mainBoardData = this._movieData; // для сортировки фильмов в this._mainBoardContainer

    unrender(this._initContainer.getElement());

    this._mainBoardContainer = (this._movieData.length !== 0) ?
      new MovieList(BoardList.ALL).getElement() :
      new MovieList(BoardList.NO_MOVIE, false).getElement();

    render(this._container.getElement(), this._mainBoardContainer);

    if (this._movieData.length === 0) {
      return;
    }

    this._mainBoard = new MovieBoardMore(this._mainBoardData, this._api, this._mainBoardContainer, this.onDataChange);
    this._mainBoard.init();
    this._boardList.push(this._mainBoard);

    this._initTopRatedMovie();
    this._initMostCommentedMovie();
  }


  // отрисовка фильмов при нажатии на главное меню
  renderFilter(filterType) {
    this._filterType = filterType;
    this._sort.default();
    this._mainBoardData = this._getMainBoardData(this._filterType);
    this._mainBoard.render(this._mainBoardData, this._commentsData, CountFlag.reset);
  }

  // показать боадры с фильмами, хз как назвать
  show() {
    showElement(this._container.getElement());
    // это надо будет править
    this._sort.show();
    this._mainBoard.render(this._movieData, this._commentsData, CountFlag.reset);
  }

  // скрыть весь блок
  hide() {
    hideElement(this._container.getElement());
    this._sort.hide();
  }

  // обновление данных с сервера
  update({typeData, movieId, value}) {

    this._updateData({typeData, movieId, value});

    // обнвление всех board
    this._mainBoard.updateMovie({typeData, movieId, value});

    const mostCommentedMovie = this._getMovieBySortType(`mostCommented`, this._movieData).slice(0, this._EXTRA_COUNT_MOVIE);
    this._mostCommented.updateBoard(mostCommentedMovie);

    // обновление главного board при примененных фильтрах
    if (this._filterType !== Filter.ALL.anchor) {
      const movieData = this._getMainBoardData(this._filterType);
      this._mainBoard.render(movieData, CountFlag.save);
    }
  }


  // надо подумать над этим
  _initTopRatedMovie() {
    const topRatedMovies = this._getMovieBySortType(`topRated`, this._movieData).slice(0, this._EXTRA_COUNT_MOVIE);

    // есть ли фильмы  с рейтингом
    const isTopRatedMovie = topRatedMovies.some((movie) => movie.user_details.rating !== 0);

    if (isTopRatedMovie) {
      const container = new MovieList(BoardList.TOP_RATED).getElement();
      render(this._container.getElement(), container);
      this._topRated = new MovieBoard(topRatedMovies, this._api, container, this.onDataChange);
      this._boardList.push(this._topRated);
      this._topRated.init();
    }
  }

  // надо подумать над этим
  _initMostCommentedMovie() {
    const isMostCommented = this._movieData.some((movie) => movie.comments.length > 0);

    if (isMostCommented) {
      const container = new MovieList(BoardList.MOST_COMMENTED).getElement();
      render(this._container.getElement(), container);
      const mostCommentedMovie = this._getMovieBySortType(`mostCommented`, this._movieData).slice(0, this._EXTRA_COUNT_MOVIE);

      this._mostCommented = new MovieBoard(mostCommentedMovie, this._api, container, this.onDataChange);
      this._boardList.push(this._mostCommented);
      this._mostCommented.init();
    }
  }

  _renderSort(container) {
    render(container, this._sort.getElement());
  }

  _updateData({typeData, movieId, value}) {
    const index = this._movieData.findIndex((i) => i.id === movieId);

    if (typeData === (TypeDataChange.REMOVE_COMMENT || TypeDataChange.CREATE_COMMENT)) {
      this._movieData[index].comments = value.movie;
    } else if (typeData === TypeDataChange.USER_DETAILS) {
      this._movieData[index].user_details = value;
    }
  }

  // фильтры для главного меню
  _getMainBoardData(fulterType) {
    const filter = {
      all: this._movieData,
      watchlist: this._movieData.filter((movie) => movie[`user_details`][`watchlist`] === true),
      history: this._movieData.filter((movie) => movie[`user_details`][`already_watched`] === true),
      favorites: this._movieData.filter((movie) => movie[`user_details`][`favorite`] === true),
    };

    return filter[fulterType];
  }

  // сортировка фильмов по фильтру
  _getMovieBySortType(typeSort, movieData) {
    const sort = {
      topRated: movieData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating),
      mostCommented: movieData.slice().sort((a, b) => b.comments.length - a.comments.length),
      date: movieData.slice().sort((a, b) => Date.parse(a.film_info.release.date) - Date.parse(b.film_info.release.date)),
      rating: movieData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating),
      default: movieData,
    };
    return sort[typeSort];
  }

  onError(props) {
    this._boardList.forEach((board) => board.onError(props));
  }

  // сортировка
  _onSortBtnClick(sortType) {
    const movie = this._getMovieBySortType(sortType, this._mainBoardData);
    this._mainBoard.render(movie, CountFlag.save);
  }
}
