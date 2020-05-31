import {render, unrender, BTN_CARD_CONTROLS, DATA_CHANGE_USER_DETAILS, DATA_CHANGE_COMMENTS, REMOVE_COMMENT, CREATE_COMMENT} from '../utils.js';
import moment from 'moment';
import 'moment-duration-format';
import MovieBaseComponent from './movie-base-component.js';
import MovieBtnControls from './movie-btn-controls.js';

export default class MovieCard extends MovieBaseComponent {
  constructor(data, onDataChange) {
    super(data);
    this.onDataChange = onDataChange;
    this._movieCommentsCount = null;

    this._init();
  }

  _init() {
    this._renderBtnControls(this._user_details);
  }


  _updateData(typeData, data) {
    if(typeData === DATA_CHANGE_USER_DETAILS) {
      this._user_details = data
    } else if(typeData === REMOVE_COMMENT || typeData === CREATE_COMMENT) {
      this._comments = data;
    }
  }

  update(typeData, data) {
    this._updateData(typeData, data);
    if(typeData === DATA_CHANGE_USER_DETAILS) {
      this._updateBtnControls();
    } else if(typeData === REMOVE_COMMENT || typeData === CREATE_COMMENT) {
      this._updateCommentsCount(this._comments.length)
    }
  }

  _updateBtnControls() {
    this.getElement().querySelector(`.film-card__controls`).innerHTML = ``;
    this._renderBtnControls();
  }

  _updateCommentsCount(count) {
    this.getElement().querySelector(`.film-card__comments`).innerHTML = `${count} comments`;
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
      <span class="film-card__duration">${moment.duration(this._runtime, `minutes`).format(`h[h] mm[m]`)}</span>
      <span class="film-card__genre">${Array.from(this._genre)[0]}</span>
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description.length < 140 ? this._description : `${this._description.slice(0, 139).trim()}…`}</p>
    <a class="film-card__comments">${this._comments.length} comments</a>
    <form class="film-card__controls"></form>
    </article>`;
  }
}
