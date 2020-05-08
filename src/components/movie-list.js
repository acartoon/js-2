import AbstractComponent from './abstract-component.js';

export default class MovieList extends AbstractComponent {
  constructor(isExtra, title) {
    super();
    this._isExtra = isExtra;
    this._title = title;
  }

  getTemplate() {
    return `<section class="films-list${this._isExtra ? `--extra` : ``}">
    <h2 class="films-list__title ${this._isExtra ? `` : `visually-hidden`}">${this._title}</h2>
      <div class="films-list__container"></div>
    </section>`;
  }
}
