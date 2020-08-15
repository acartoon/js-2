import MovieContainer from "../components/movie-container";
import { render, boardList, hideElement, showElement, filterFlag, typeDataChange, filter, unrender} from "../utils";
import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";
import MovieBoardMore from "./movie-board-more";
import Sort from "../components/sort.js";
import MovieList from "../components/movie-list";
import ResultTitle from "../components/result-title";
import SearchController from "./search-controller";
import { remove } from "lodash";


export default class HomePageController {
  constructor(container, onDataChange) {
    this._mainContainer = container;
    this._container = new MovieContainer();
    this._api = null;
    this._EXTRA_COUNT_MOVIE = 2;
    this._btnShowMore = new BtnShowMore();
    this._onSortBtnClick = this._onSortBtnClick.bind(this);
    this._sort = new Sort(this._onSortBtnClick);
    this._mainBoardData = []; // для сортировки главного боарда
    this._filterType = filter.ALL.anchor;
    // из main
    this.onDataChange = onDataChange;
    // this.onDataChange = this.onDataChange.bind(this);
    this._mainBoardContainer = null;
    this._resultTitle = new ResultTitle(this._mainContainer);
    this._searchController = null;
    this._boardList = [];
  }

  load() {
    this._renderSort(this._mainContainer);
    render(this._mainContainer, this._container.getElement());
    this._initContainer = new MovieList(boardList.LOADING, false);
    render(this._container.getElement(), this._initContainer.getElement());
  }

  init(movieData, api) {
    this._api = api;

    // все фильмы
    this._movieData = movieData;

    this._mainBoardData = this._movieData;

    unrender(this._initContainer.getElement());

    this._mainBoardContainer = (this._movieData.length !== 0) ?
      new MovieList(boardList.ALL).getElement() :
      new MovieList(boardList.NO_MOVIE, false).getElement();

    render(this._container.getElement(), this._mainBoardContainer);

    if(this._movieData.length === 0) {
      return;
    }

    // this._mainBoardContainer
    this._mainBoard = new MovieBoardMore(this._mainBoardData, this._api, this._mainBoardContainer, this.onDataChange);
    this._mainBoard.init();
    this._boardList.push(this._mainBoard);

    this._initTopRatedMovie();
    this._initMostCommentedMovie();
  };

  // надо подумать над этим
  _initTopRatedMovie() {
    const topRatedMovies = this._getTopRatedMovie(this._movieData);

    // есть ли фильмы  с рейтингом
    const initTopRatedMovie = topRatedMovies.some((movie) => movie.user_details.rating != 0);

    if(initTopRatedMovie) {
      const container = new MovieList(boardList.TOP_RATED).getElement();
      render(this._container.getElement(), container);
      this._topRated = new MovieBoard(topRatedMovies, this._api, container, this.onDataChange);
      this._boardList.push(this._topRated);
      this._topRated.init();
    }
  }

  // надо подумать над этим
  _initMostCommentedMovie() {
    const initMostCommented = this._movieData.some((movie) => movie.comments.length > 0)

    if(initMostCommented) {
    const container = new MovieList(boardList.MOST_COMMENTED).getElement();
    render(this._container.getElement(), container);

    this._mostCommented = new MovieBoard(this._getMostCommentedMovie(this._movieData), this._api, container, this.onDataChange);
    this._boardList.push(this._mostCommented);
    this._mostCommented.init();
    }
  }

  _renderSort(container) {
    render(container, this._sort.getElement());
  }

  _getTopRatedMovie(movieData) {
    const topRatedMovie = movieData.slice().sort((a, b) => b.user_details.personal_rating - a.user_details.personal_rating);
    return topRatedMovie.slice(0, this._EXTRA_COUNT_MOVIE);
  }

  _getMostCommentedMovie(movieData) {
    const mostCommentedMovie =  movieData.slice().sort((a, b) => b.comments.length - a.comments.length);
    return mostCommentedMovie.slice(0, this._EXTRA_COUNT_MOVIE);
  }

  // сортировка
  _onSortBtnClick(sortType) {
    const movieDataToRender = {
      date: this._mainBoardData.slice().sort((a, b) => Date.parse(a.film_info.release.date) - Date.parse(b.film_info.release.date)),
      rating: this._mainBoardData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating),
      default: this._mainBoardData,
    };

    this._mainBoard.render(movieDataToRender[sortType], filterFlag.save);
  }

  _updateData({typeData, movieId, value}) {
    const index = this._movieData.findIndex((i) => i.id === movieId);

    if(typeData === (typeDataChange.REMOVE_COMMENT || typeDataChange.CREATE_COMMENT)) {
      this._movieData[index].comments = value.movie;
    }

    else if(typeData === typeDataChange.USER_DETAILS) {
      this._movieData[index].user_details = value;
    }
  }

  onError(data) {
    this._boardList.forEach((board) => board.onError(data));
  }

  //обновление данных с сервера
  update({typeData, movieId, value}) {
    this._updateData({typeData, movieId, value});

    // обнвление всех board
    this._boardList.forEach((board) => board.updateMovie({typeData, movieId, value}))

    this._mostCommented.updateBoard(this._getMostCommentedMovie(this._movieData));

    // если активен поиск обновить поиск
    if(this._searchController) {
      this._searchController.update({typeData, movieId, value})
    }

    // обновление главного board при примененных фильтрах
    if (this._filterType !== filter.ALL.anchor) {
      const movieData = this._getMainBoardData(this._filterType);
      this._mainBoard.render(movieData, filterFlag.save);
    }
  }

  // фильтры для главного меню
  _getMainBoardData(fulterType) {
    const data = {
      all: this._movieData,
      watchlist: this._movieData.filter((movie) => movie[`user_details`][`watchlist`] === true),
      history: this._movieData.filter((movie) => movie[`user_details`][`already_watched`] === true),
      favorites: this._movieData.filter((movie) => movie[`user_details`][`favorite`] === true),
    }

    return data[fulterType];
  }

  // отрисовка результатов поиска
  initSearch(searchData) {
    this._hideMainWindow();
    this._searchController = new SearchController(this._mainBoardContainer, this._onDataChangeMain, this._resultTitle);
    this._searchController.init(searchData, this._movieData, this._api);
  }

  // показать боадры с фильмами, хз как назвать
    show() {
    showElement(this._container.getElement());
    // это надо будет править
    if(this._searchController) {
      this._searchController.remove();
      this._searchController = null;
    }
    //
    this._sort.show();
    this._topRated.show();
    this._mostCommented.show();
    this._mainBoard.render(this._movieData, this._commentsData, filterFlag.reset);
  }

  // скрыть боарды с фильмами
  _hideMainWindow() {
    this._sort.hide();
    this._topRated.hide();
    this._mostCommented.hide();
    this._mainBoard.reset();
  }

  // скрыть весь блок
  hide() {
    hideElement(this._container.getElement());
    this._sort.hide();
  }

  // отрисовка фильмов при нажатии на главное меню
  renderFilter(filterType) {
    this._filterType = filterType;
    this._sort.default();
    this._mainBoardData = this._getMainBoardData(this._filterType);
    this._mainBoard.render(this._mainBoardData, this._commentsData, filterFlag.reset);
  }
}
