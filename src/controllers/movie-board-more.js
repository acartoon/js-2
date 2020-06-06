import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";
import { render, hideElement, filterFlag, unrender, showElement } from "../utils";

export default class MovieBoardMore extends MovieBoard {
  constructor(movieData, api, container, onDataChangeMain) {
    super(movieData, api, container, onDataChangeMain);
    this._btn = new BtnShowMore();
    this._STEP_TO_RENDER = 5;
    this._countMovieToRender = this._STEP_TO_RENDER;
    this._onClick = this._onClick.bind(this);
  }

  init() {
    this._countMovieToRender = this._STEP_TO_RENDER;
    const movieToRender = this._movieData.slice(0, this._countMovieToRender);
    this._renderMovie(movieToRender);

    if(this._movieData.length > this._STEP_TO_RENDER) {
      this._renderBtn();
    }
  }

  _renderBtn() {
    render(this._container, this._btn.getElement());
    this._btn.getElement().addEventListener('click', this._onClick);
  }

  _showBtn() {
    showElement(this._btn.getElement())
    this._btn.getElement().addEventListener('click', this._onClick);
}

  hideBtn() {
    hideElement(this._btn.getElement());
    this._btn.getElement().removeEventListener('click', this._onClick);
  }

  reset() {
    this._boardContainer.innerHTML = null;
    this.hideBtn();
  }

  _onClick() {
    const movieToRender = this._movieData.slice(this._countMovieToRender, this._countMovieToRender + this._STEP_TO_RENDER)
    this._countMovieToRender += this._STEP_TO_RENDER;
    this._renderMovie(movieToRender);

    if (this._movieData.length <= this._countMovieToRender) {
      this.hideBtn();
    }
  }

  render(movieData, flag) {
    console.log(movieData)
    this._movieData = movieData;
    this._countMovieToRender = (flag === filterFlag.save) ? this._countMovieToRender : this._STEP_TO_RENDER;
    if (this._movieData.length > this._countMovieToRender) {
      this._showBtn();
    }
    else {
      this.hideBtn();
    }

   this._boardContainer.innerHTML = ``;
    const movieToRender = this._movieData.slice(0, this._countMovieToRender);
    this._renderMovie(movieToRender);
  }
}
