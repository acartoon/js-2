// import MovieBaseComponent from './movie-base-component.js';
// import MovieBtnState from './movie-btn-state.js';
import {render, unrender, BTN_CARD_CONTROLS, DATA_CHANGE, MOVIE_DETAIL_BTN_CONTROLS} from '../utils.js';
import moment from 'moment';
import MovieBaseComponent from './movie-base-component.js';
import MovieBtnControls from './movie-btn-controls.js';
// import MovieCommentsCount from './movie-comments-count';

export default class MovieCard extends MovieBaseComponent {
  constructor(data, onDataChange) {
    super(data);
    // this._onDataChangeMain = onDataChangeMain;
    this.onDataChange = onDataChange;
    this._movieCommentsCount = null;

    this._init();
  }

  _init() {
    this._renderBtnControls(this._user_details);
    // this.renderCommentsCount(this._comments.length);
  }

  renderCommentsCount(commentsCount) {
    this._movieCommentsCount = new MovieCommentsCount(commentsCount);
    this.getElement().querySelector(`.film-card__controls`).before(this._movieCommentsCount.getElement());
  }

  _updateData(user_details) {
    this._user_details = user_details;
  }

  update(user_details) {
    this._updateData(user_details);
    this._updateBtnControls();
  }

  _updateBtnControls() {
    this.getElement().querySelector(`.film-card__controls`).innerHTML = ``;
    this._renderBtnControls();
  }

  _renderBtnControls() {
    const btnContainer = this.getElement().querySelector(`.film-card__controls`);
    Object.keys(BTN_CARD_CONTROLS).forEach((key) => {
      const btn = new MovieBtnControls(BTN_CARD_CONTROLS[key], this._user_details[key], this.onDataChange);
      render(btnContainer, btn.getElement());
    });
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${moment(this._releaseDate).format(`YYYY`)}</span>
      <span class="film-card__duration">${this._runtime}</span>
      <span class="film-card__genre">${Array.from(this._genre)[0]}</span>
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description.length < 140 ? this._description : `${this._description.slice(0, 139).trim()}…`}</p>
    <form class="film-card__controls"></form>
    </article>`;
  }
}
