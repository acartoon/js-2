import AbstractComponent from '../../abstract-component.js';

export default class MovieCommentsContainer extends AbstractComponent {
  constructor(commentsCount) {
    super();
    this._commentsCount = commentsCount;
  }
  getTemplate() {
    console.log(this._commentsCount)
    return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">
    Comments <span class="film-details__comments-count">${this._commentsCount}</span>
    </h3>
    </section>`;
  }
}
