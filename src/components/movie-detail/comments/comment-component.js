import AbstractComponent from '../../abstract-component.js';
import moment from 'moment';
import {unrender, TypeDataChange, DateFormat} from '../../../utils.js';

export default class CommentComponent extends AbstractComponent {
  constructor({id, comment, author, date, emotion}, onDataChange) {
    super();
    this.id = id;
    this._emotion = emotion;
    this._comment = comment;
    this._author = author;
    this._date = date;
    this._onDataChange = onDataChange;
    this._titleBtn = `Deleting…`;
    this._deleteBtn = this.getElement().querySelector(`.film-details__comment-delete`);
    this._onWindowsOffline = this._onWindowsOffline.bind(this);
    this._onWindowsOnline = this._onWindowsOnline.bind(this);
    this._minHours = 1;
    this._maxHours = 24;

    this._init();
  }

  getTemplate() {
    return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
      <img src="./images/emoji/${this._emotion}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
      <p class="film-details__comment-text">${this._comment}</p>
      <p class="film-details__comment-info">
      <span class="film-details__comment-author">${this._author}</span>
      <span class="film-details__comment-day">${this._getDateFormat(this._date)}</span>
      <button class="film-details__comment-delete">Delete</button>
      </p>
      </div>
      </li>`;
  }

  remove() {
    unrender(this.getElement());
    this.removeElement();
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  _init() {
    this._onClick();
    window.addEventListener(`offline`, this._onWindowsOffline);

    if (!this._isOnline()) {
      this._onWindowsOffline();
    }
  }

  _getDateFormat() {
    let value = ``;
    const date = moment(this._date);
    const now = moment(new Date());
    const duration = moment.duration(now.diff(date));
    const minutes = parseInt(duration.asMinutes());
    const hours = parseInt(duration.asHours());
    const days = parseInt(duration.asDays());

    if (minutes <= 0) {
      value = DateFormat.NOW;
    } else if (minutes <= this._minHours + 2) {
      value = DateFormat.MINUTE;
    } else if (hours > this._minHours && hours < this._minHours + 1 ) {
      value = DateFormat.HOURE;
    } else if (hours > this._minHours + 1 && hours < this._maxHours) {
      value = DateFormat.FEW_HOURS;
    } else if (days >= this._minHours) {
      value = `a ${days} day ago`;
    }
    return value;
  }

  _onClick() {
    this._deleteBtn.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._deleteBtn.innerHTML = this._titleBtn;
      this._deleteBtn.disabled = true;
      // в CommentsController
      this._onDataChange({typeData: TypeDataChange.REMOVE_COMMENT, value: this});
    });
  }

  _onWindowsOffline() {
    this._deleteBtn.disabled = true;
    window.addEventListener(`online`, this._onWindowsOnline);
  }

  _onWindowsOnline() {
    this._deleteBtn.disabled = false;
  }
}
