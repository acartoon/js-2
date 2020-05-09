import AbstractComponent from '../abstract-component.js';
import moment from 'moment';

export default class CommentComponent extends AbstractComponent {
  // constructor(data, onDataChange) {
  constructor({id, comment, author, date, emotion}, onDataChange) {
    super();
    this._id = id;
    this._emotion = emotion;
    this._comment = comment;
    this._author = author;
    this._date = date;
    this._onDataChange = onDataChange;

    this._onClick();
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
      <span class="film-details__comment-day">${moment(this._date).format(`DD MMM YYYY`)}</span>
      <button class="film-details__comment-delete">Delete</button>
      </p>
      </div>
      </li>`;
  }

  _onClick() {
    const deleteDtn = this.getElement().querySelector(`.film-details__comment-delete`);
    deleteDtn.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onDataChange(`comment`, this._id);
    });
  }
}
