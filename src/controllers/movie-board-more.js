import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";
import { render, hideElement, filterFlag } from "../utils";

export default class MovieBoardMore extends MovieBoard {
  constructor({isExtra, title}, movieData, commentsData, container) {
    super({isExtra, title}, movieData, commentsData, container);
    this._btn = new BtnShowMore();
    this._STEP_TO_RENDER = 5;
    this._countMovieToRender = this._STEP_TO_RENDER;
    this._onClick = this._onClick.bind(this);
  }

  init() {
    this._renderContainer();

    this._countMovieToRender = this._STEP_TO_RENDER;
    const movieToRender = this._movieData.slice(0, this._countMovieToRender);
    this._renderMovie(movieToRender);

    if(this._movieData.length > this._STEP_TO_RENDER) {
      this._showBtn();
    }
  }

  _showBtn() {
    const container = this._movieListContainer.getElement();
    render(container, this._btn.getElement());
    this._btn.getElement().addEventListener('click', this._onClick);
  }

  _hideBtn() {
    hideElement(this._btn.getElement());
    this._btn.getElement().removeEventListener('click', this._onClick);
  }

  _onClick() {
    const movieToRender = this._movieData.slice(this._countMovieToRender, this._countMovieToRender + this._STEP_TO_RENDER)
    this._countMovieToRender += this._STEP_TO_RENDER;
    this._renderMovie(movieToRender);

    if (this._movieData.length <= this._countMovieToRender) {
      this._hideBtn();
    }
  }

  render(movieData, flag) {
    this._movieData = movieData;
    this._countMovieToRender = (flag === filterFlag.save) ? this._countMovieToRender : this._STEP_TO_RENDER;

    if (this._movieData.length >= this._countMovieToRender) {
      this._btn.getElement().classList.remove(`visually-hidden`);
      this._btn.getElement().addEventListener('click', this._onClick);

   }

    this._movieListContainer.getElement().querySelector(`.films-list__container`).innerHTML = ``;
    const movieToRender = this._movieData.slice(0, this._countMovieToRender);
    this._renderMovie(movieToRender);
  }
}
