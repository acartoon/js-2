import AbstractComponent from '../../abstract-component.js';
import moment from 'moment';
import { DATA_CHANGE, unrender } from '../../../utils.js';

export default class CommentComponent extends AbstractComponent {
  // constructor(data, onDataChange) {
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
      <span class="film-details__comment-day">${this._onDate(this._date)}</span>
      <button class="film-details__comment-delete">Delete</button>
      </p>
      </div>
      </li>`;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  _init() {
    this._onClick();
    window.addEventListener(`offline`, this._onWindowsOffline);
    // this._onDate();

    if(!this._isOnline()) {
      this._onWindowsOffline();
    }
  }

  _onDate() {
    let value = ``;
    const date = moment(this._date);
    const now = moment(new Date());
    const duration = moment.duration(now.diff(date));
    const minutes = parseInt(duration.asMinutes());
    const hours = parseInt(duration.asHours());
    const days = parseInt(duration.asDays());

    if(minutes <= 0) {
      value = `now`
    } else if (minutes <= 3) {
      value = `a minute ago`
    } else if(hours > 1 && hours < 2 ) {
      value = `a hour ago`
    } else if (hours > 2 && hours < 24) {
      value = `a few hours ago`
    } else if(days => 1) {
      value = `a ${days} day ago`
    }

    return value;
  }


  _onClick() {
    // const deleteBtn = this.getElement().querySelector(`.film-details__comment-delete`);
    this._deleteBtn.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._deleteBtn.innerHTML = this._titleBtn;
      this._deleteBtn.disabled = true;
      this._onDataChange({typeDataChange: DATA_CHANGE.REMOVE_COMMENT, value: this});
    });
  }

  _onWindowsOffline() {
    this._deleteBtn.disabled = true;
    window.addEventListener(`online`, this._onWindowsOnline);
  }

  _onWindowsOnline() {
    this._deleteBtn.disabled = false;
  }

  remove() {
    unrender(this.getElement());
    this.removeElement();
  }
}
