import MovieContainer from "../components/movie-container";
import { render, Position, BOARDS_LIST, hideElement, showElement, filterFlag, RATING, DATA_CHANGE_COMMENTS, DATA_CHANGE_USER_DETAILS, FILTER_TYPE, REMOVE_COMMENT, CREATE_COMMENT} from "../utils";
import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";
import MovieBoardMore from "./movie-board-more";
import Sort from "../components/sort.js";
import MovieList from "../components/movie-list";
// import ResultTitle from "../components/result-title";
import SearchController from "./search-controller";


export default class HomePageController {
  constructor(container, onDataChangeMain) {
    this._mainContainer = container;
    this._container = new MovieContainer();
    this._api = null;
    this._EXTRA_COUNT_MOVIE = 2;
    this._btnShowMore = new BtnShowMore();
    this._onSortBtnClick = this._onSortBtnClick.bind(this);
    this._sort = new Sort(this._onSortBtnClick);
    this._mainBoardData = [];
    this._filterType = 'all';
    this._onDataChangeMain = onDataChangeMain;
    this.onDataChange = this.onDataChange.bind(this);
    this._mainBoardContainer = null;
    // this._resultTitle = new ResultTitle(this._mainContainer);
    this._searchController = null;
  }

  init(movieData, api) {
    this._api = api;
    this._movieData = movieData;
    this._mainBoardData = this._movieData;

    this._renderSort(this._mainContainer);
    render(this._mainContainer, this._container.getElement(), Position.BEFOREEND);

    this._mainBoardContainer = new MovieList(BOARDS_LIST.ALL).getElement();
    render(this._container.getElement(), this._mainBoardContainer)
    this._mainBoard = new MovieBoardMore(this._mainBoardData, this._api, this._mainBoardContainer, this.onDataChange);
    this._mainBoard.init();

    const topRatedContainer = new MovieList(BOARDS_LIST.TOP_RATED).getElement();
    render(this._container.getElement(), topRatedContainer);
    this._topRated = new MovieBoard(this._getTopRatedMovie(this._movieData), this._api, topRatedContainer, this.onDataChange);
    this._topRated.init();

    const mostCommentedContainer = new MovieList(BOARDS_LIST.MOST_COMMENTED).getElement();
    render(this._container.getElement(), mostCommentedContainer);
    this._mostCommented = new MovieBoard(this._getMostCommentedMovie(this._movieData), this._api, mostCommentedContainer, this.onDataChange);
    this._mostCommented.init();
  };

  _renderSort(container) {
    render(container, this._sort.getElement());
  }

  _getTopRatedMovie(movieData) {
    const topRatedMovie = movieData.slice().sort((a, b) => b.user_details.personal_rating - a.user_details.personal_rating);
    return topRatedMovie.slice(0, this._EXTRA_COUNT_MOVIE)
  }

  _getMostCommentedMovie(movieData) {
    const mostCommentedMovie =  movieData.slice().sort((a, b) => b.comments.length - a.comments.length);
    return mostCommentedMovie.slice(0, this._EXTRA_COUNT_MOVIE);
  }

  // сортировка
  _onSortBtnClick(sortType) {
    console.log(sortType)
    const movieDataToRender = {
      date: this._mainBoardData.slice().sort((a, b) => Date.parse(a.film_info.release.date) - Date.parse(b.film_info.release.date)),
      rating: this._mainBoardData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating),
      default: this._mainBoardData,
    };
    this._mainBoard.render(movieDataToRender[sortType], filterFlag.save);
  }
  onDataChange(data) {
    this._onDataChangeMain(data);
  }

  _updateData({typeDataChange, movieId, value}) {
    console.log(value)
    const index = this._movieData.findIndex((i) => i.id === movieId);
    if(typeDataChange === REMOVE_COMMENT) {
      this._movieData[index].comments = value.movie;
    } else if(typeDataChange === CREATE_COMMENT) {
      this._movieData[index].comments = value.movie;
    } else if(typeDataChange === DATA_CHANGE_USER_DETAILS || typeDataChange === RATING) {
      this._movieData[index].user_details = value;
    }
  }

  // update(typeData, movieId, data, comments = false) {
  update({typeDataChange, movieId, value}) {
    this._updateData({typeDataChange, movieId, value});
    this._mainBoard.updateMovie({typeDataChange, movieId, value});
    this._topRated.updateMovie({typeDataChange, movieId, value});
    this._mostCommented.updateMovie({typeDataChange, movieId, value});

    switch(typeDataChange) {
      case REMOVE_COMMENT:
        this._mostCommented.updateBoard(this._getMostCommentedMovie(this._movieData));
      case CREATE_COMMENT:
        this._mostCommented.updateBoard(this._getMostCommentedMovie(this._movieData));
      case RATING:
        this._mostCommented.updateBoard(this._getMostCommentedMovie(this._movieData));
    }

    if (this._filterType !== FILTER_TYPE.ALL.anchor) {
      const movieData = this._getMainBoardData(this._filterType);
      this._mainBoard.render(movieData, filterFlag.save);
    }
  }

  _getMainBoardData(fulterType) {
    const data = {
      all: this._movieData,
      watchlist: this._movieData.filter((movie) => movie[`user_details`][`watchlist`] === true),
      history: this._movieData.filter((movie) => movie[`user_details`][`already_watched`] === true),
      favorites: this._movieData.filter((movie) => movie[`user_details`][`favorite`] === true),
    }

    this._mainBoardData = data[fulterType];
    return data[fulterType];
  }

  initSearch(searchData) {
    this._hide();
    this._searchController = new SearchController(this._mainContainer, this._mainBoardContainer);
    this._searchController.init(searchData, this._movieData, this._api);
  }

  home() {
    showElement(this._container.getElement())
    this._searchController = null;
    this._sort.show();
    this._topRated.show();
    this._mostCommented.show();
    this._mainBoard.render(this._movieData, this._commentsData, filterFlag.reset);
  }

  _hide() {
    this._sort.hide();
    this._topRated.hide();
    this._mostCommented.hide();
    this._mainBoard.reset();
  }

  hide() {
    hideElement(this._container.getElement())
    this._sort.hide();
  }

  renderFilter(filterType) {
    this._filterType = filterType;
    this._sort.default();
    const movieData = this._getMainBoardData(filterType);
    this._mainBoard.render(movieData, this._commentsData, filterFlag.reset);
  }
}
