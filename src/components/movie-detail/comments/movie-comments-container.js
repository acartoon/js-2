import AbstractComponent from '../../abstract-component.js';

export default class MovieCommentsContainer extends AbstractComponent {
  constructor(commentsCount) {
    super();
    this._commentsCount = commentsCount;
  }

  update(commentsCount) {
    this._commentsCount =commentsCount;
    const title = this.getElement().querySelector(`.film-details__comments-count`);
    title.innerHTML = this._commentsCount;
  }
  getTemplate() {
    return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">
    Comments <span class="film-details__comments-count">${this._commentsCount}</span>
    </h3>
    </section>`;
  }
}
