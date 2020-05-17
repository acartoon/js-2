import MovieContainer from "../components/movie-container";
import {render, hideElement, showElement, BOARDS_LIST, Position} from "../utils";
import ResultTitle from "../components/result-title";
import MovieBoard from "./movie-board";

export default class SearchController {
  constructor(container, onDataChangeMain) {
    this._container = container;
    this._title = new ResultTitle(this._container);
    this._moviecontainer = null;
    this._movieBoard = null;
    this._searchData = null
    this._init();
    this.onDataChangeMain = onDataChangeMain;
  }

  _init() {
  }

  show(movieData, commentsData, searchData) {
    this._moviecontainer = this._container.querySelector('.films');
    this._moviecontainer.firstElementChild.remove();
    this._show();
    this._searchData = searchData;

    const resultData = movieData.filter((movie) => {
      console.log(movie)
      console.log(this._searchData)
      return movie.film_info.title.includes(this._searchData);
    });

    this._movieBoard = new MovieBoard(BOARDS_LIST.ALL, resultData, commentsData, this._moviecontainer, this.onDataChangeMain, Position.AFTERBEGIN);
    this._movieBoard.init();
  };

  hide() {
    this._title.hide();
    hideElement(this._moviecontainer.getElement());
    this._moviecontainer.getElement().remove()
    this._movieBoard = null;
  }

  _show() {
    this._title.show();
    // showElement(this._moviecontainer.getElement());
  }
}
