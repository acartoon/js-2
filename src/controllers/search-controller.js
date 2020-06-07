import MovieBoard from "./movie-board";
import { render, Position } from "../utils";

export default class SearchController {
  constructor(mainContainer, container, onDataChangeMain, resultTitle) {
    this._container = container;
    this.onDataChangeMain = onDataChangeMain;
    this._movieData = null;
    this._commentsData = null;
    this._searchData = null;
    this._resultTitle = resultTitle;
  }

  init(searchData, movieData, commentsData) {
    this._searchData = searchData;
    this._movieData = movieData;
    this._commentsData = commentsData;
    const resultData = this._movieData.filter((movie) => {
      return movie.film_info.title.toLowerCase().includes(this._searchData.toLowerCase());
    });

    if(resultData.length !== 0) {
      this._resultTitle.init(resultData.length)
      this._movieBoard = new MovieBoard(resultData, this._commentsData, this._container, this.onDataChangeMain);
      this._movieBoard.init();
    } else {

    }
  }

  update(data) {
    console.log(data)
    this._movieBoard.updateMovie(data)
  }
}
