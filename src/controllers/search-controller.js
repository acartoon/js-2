import MovieContainer from "../components/movie-container";
import {render, hideElement, showElement, BOARDS_LIST, Position} from "../utils";
import ResultTitle from "../components/result-title";
import MovieBoard from "./movie-board";
import MovieList from "../components/movie-list";

export default class SearchController {
  constructor(container, onDataChangeMain) {
    this._container = container;
    this._title = new ResultTitle(this._container);
    this._moviecontainer = null;
    this._movieBoard = null;
    this._searchData = null
    this._init();
    this.onDataChangeMain = onDataChangeMain;
    this._boardContainer = null;
  }

  _init() {
  }

  show(boardContainer, movieData, commentsData, searchData) {
    this._searchData = searchData;
    this._boardContainer = boardContainer;
    this._boardContainer.querySelector(`.films-list__container`).innerHTML = ``;


    const resultData = movieData.filter((movie) => {
      return movie.film_info.title.toLowerCase().includes(this._searchData.toLowerCase());
    });

    if(resultData.length !== 0) {
      this._title.init(resultData.length);
      this._movieBoard = new MovieBoard(resultData, commentsData, this._boardContainer, this.onDataChangeMain);
      this._movieBoard.init();
    } else {

    }
  };

  hide() {
    this._title.hide();
    this._movieBoard = null;
  }
}
