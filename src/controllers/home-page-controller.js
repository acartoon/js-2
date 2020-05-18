import MovieContainer from "../components/movie-container";
import { render, Position, BOARDS_LIST, hideElement, filterFlag, RATING, DATA_CHANGE_COMMENTS, DATA_CHANGE_USER_DETAILS} from "../utils";
import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";
import MovieBoardMore from "./movie-board-more";
import Sort from "../components/sort.js";
import MovieList from "../components/movie-list";

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
    this.onDataChange = this.onDataChange.bind(this);
  }

  init(movieData, commentsData) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._mainBoardData = this._movieData;

    this._renderSort(this._mainContainer);
    render(this._mainContainer, this._container.getElement(), Position.BEFOREEND);

    const mainBoardContainer = new MovieList(BOARDS_LIST.ALL).getElement();
    render(this._container.getElement(), mainBoardContainer)
    this._mainBoard = new MovieBoardMore(this._mainBoardData, this._commentsData, mainBoardContainer, this.onDataChange);
    this._mainBoard.init();

    const topRatedContainer = new MovieList(BOARDS_LIST.TOP_RATED).getElement();
    render(this._container.getElement(), topRatedContainer);
    this._topRated = new MovieBoard(this._getTopRatedMovie(this._movieData), this._commentsData, topRatedContainer, this.onDataChange);
    this._topRated.init();

    const mostCommentedContainer = new MovieList(BOARDS_LIST.MOST_COMMENTED).getElement();
    render(this._container.getElement(), mostCommentedContainer);
    this._mostCommented = new MovieBoard(this._getMostCommentedMovie(this._movieData), this._commentsData, mostCommentedContainer, this.onDataChange);
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

  _rerendMainBoard(movieData, flag) {
    this._mainBoard.render(movieData, flag);
  }

  // сортировка
  _onSortBtnClick(sortType) {
    const movieDataToRender = {
      date: this._mainBoardData.slice().sort((a, b) => a.film_info.release.date - b.film_info.release.date),
      rating: this._mainBoardData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating),
      default: this._mainBoardData,
    };
    this._rerendMainBoard(movieDataToRender[sortType], filterFlag.save);
  }

  onDataChange(typeData, movieId, data, movie) {
    this._onDataChangeMain(typeData, movieId, data, movie);
  }

  _updateData(typeData, movieId, data) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    if(typeData === DATA_CHANGE_COMMENTS) {
      this._movieData[index].comments = data[DATA_CHANGE_USER_DETAILS];
      this._commentsData = data[DATA_CHANGE_COMMENTS];

    } else if(typeData === DATA_CHANGE_USER_DETAILS || typeData === RATING) {
      this._movieData[index].user_details = data;
    }
  }

  update(typeData, movie, movieId, data) {
    this._updateData(typeData, movieId, data);
    this._mainBoard.updateMovie(typeData, movie, movieId, data);
    this._topRated.updateMovie(typeData, movie, movieId, data);
    this._mostCommented.updateMovie(typeData, movie, movieId, data);
    if(typeData === DATA_CHANGE_COMMENTS) {
      this._mostCommented.updateBoard(this._getMostCommentedMovie(this._movieData), this._commentsData);
    }
    if(typeData === RATING) {
      this._topRated.updateBoard(this._getMostCommentedMovie(this._movieData), this._commentsData);
    }
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
    this._sort.hide();
    this._topRated.hide();
    this._mostCommented.hide();
    this._mainBoard.reset();
  }

  show(movieData, commentsData) {
    this._sort.show();
    this._topRated.show();
    this._mostCommented.show();
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._mainBoard.render(this._movieData, this._commentsData, filterFlag.reset);
  }

  renderFilter(filterType) {
    const movieData = this._getMainBoardData(filterType);
    this._mainBoard.render(movieData, this._commentsData, filterFlag.reset);
  }
}
