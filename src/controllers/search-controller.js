import MovieBoard from "./movie-board";
import { render, Position, unrender } from "../utils";
import NoResult from "../components/no-result";

export default class SearchController {
  constructor(container, onDataChangeMain, resultTitle) {
    this._container = container;
    this.onDataChangeMain = onDataChangeMain;
    this._resultTitle = resultTitle;
    this._noResult = new NoResult();
  }

  init(searchData, movieData, commentsData) {
    const resultData = movieData.filter((movie) => {
      return movie.film_info.title.toLowerCase().includes(searchData.toLowerCase());
    });

    this._resultTitle.init(resultData.length);

    if(resultData.length === 0) {
      render(this._container, this._noResult.getElement())
      return;
    }
    this._movieBoard = new MovieBoard(resultData, commentsData, this._container, this.onDataChangeMain);
    this._movieBoard.init();
  }

  // при обновлении фильма
  update(data) {
    this._movieBoard.updateMovie(data)
  }

  // очистака результатов поиска
  remove() {
    unrender(this._noResult.getElement());
    this._noResult.removeElement();
    this._resultTitle.hide();
  }
}
