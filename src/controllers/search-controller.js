import MovieBoard from "./movie-board";
import { render, Position, unrender } from "../utils";
import NoResult from "../components/no-result";

export default class SearchController {
  constructor(mainContainer, container, onDataChangeMain, resultTitle) {
    this._container = container;
    this.onDataChangeMain = onDataChangeMain;
    this._movieData = null;
    this._commentsData = null;
    this._searchData = null;
    this._resultTitle = resultTitle;
    this._noResult = new NoResult();
  }

  init(searchData, movieData, commentsData) {
    this._searchData = searchData;
    this._movieData = movieData;
    this._commentsData = commentsData;
    const resultData = this._movieData.filter((movie) => {
      return movie.film_info.title.toLowerCase().includes(this._searchData.toLowerCase());
    });

    this._resultTitle.init(resultData.length)

    if(resultData.length === 0) {
      render(this._container, this._noResult.getElement())
      return;
    }
    this._movieBoard = new MovieBoard(resultData, this._commentsData, this._container, this.onDataChangeMain);
    this._movieBoard.init();

  }

  update(data) {
    this._movieBoard.updateMovie(data)
  }

  remove() {
    unrender(this._noResult.getElement());
    this._noResult.removeElement();
    this._resultTitle.hide();

  }
}
