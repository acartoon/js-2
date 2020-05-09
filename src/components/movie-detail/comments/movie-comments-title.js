import AbstractComponent from '../abstract-component.js';

export default class MovieCommentsTitle extends AbstractComponent {
  constructor(commentsDataLength) {
    super();
    this._commentsDataLength = commentsDataLength;
  }

  getTemplate() {
    return `<h3 class="film-details__comments-title">
    Comments <span class="film-details__comments-count">${this._commentsDataLength}</span>
    </h3>`;
  }
}
