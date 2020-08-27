import {render, CardControls, TypeDataChange} from '../utils.js';
import moment from 'moment';
import 'moment-duration-format';
import MovieBaseComponent from './movie-base-component.js';
import MovieBtnControls from './movie-btn-controls.js';
import {cloneDeep} from 'lodash';

export default class MovieCard extends MovieBaseComponent {
  constructor(data, onDataChange) {
    super(data);
    this.onDataChange = this.onDataChange.bind(this);
    this._onDataChangeMain = onDataChange;
    this._movieCommentsCount = null;
    this._tmpData = null;
    this._init();
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


  update({typeData, value}) {
    this._updateMovieData({typeData, value});
    if (typeData === TypeDataChange.USER_DETAILS) {
      this._updateBtnControls();
    } else if (typeData === TypeDataChange.REMOVE_COMMENT || typeData === TypeDataChange.CREATE_COMMENT) {
      this._updateCommentsCount(this._comments.length);
    }
  }

  _init() {
    this._renderBtnControls(this._user_details);
  }

  _initTmpData() {
    this._tmpData = cloneDeep(this._user_details);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  _updateMovieData({typeData, value}) {
    if (typeData === TypeDataChange.USER_DETAILS) {
      this._user_details = value;
    } else if (typeData === TypeDataChange.REMOVE_COMMENT || typeData === TypeDataChange.CREATE_COMMENT) {
      this._comments = value.movie;
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
    Object.keys(CardControls).forEach((key) => {
      const btn = new MovieBtnControls(CardControls[key], this._user_details[key], this.onDataChange);
      render(btnContainer, btn.getElement());
    });
  }

  onDataChange(typeData) {
    this._initTmpData();

    // поменять когда исправлю тип данных
    switch (typeData) {
      case TypeDataChange.WATCHLIST :
        this._tmpData.watchlist = !this._tmpData.watchlist;
        break;
      case TypeDataChange.ALREADY_WATCHED :
        this._tmpData.already_watched = !this._tmpData.already_watched;
        break;
      case TypeDataChange.FAVORITE :
        this._tmpData.favorite = !this._tmpData.favorite;
        break;
    }

    this._onDataChangeMain({typeData: TypeDataChange.USER_DETAILS, value: this._tmpData});
    this._resetTmpData();
  }
}
