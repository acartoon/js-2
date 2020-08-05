import AbstractComponent from './abstract-component.js';

export default class MovieList extends AbstractComponent {
  constructor({isExtra, title}, state = true) {
    super();
    this._isExtra = isExtra;
    this._title = title;
    this._state = state;
  }

  getTemplate() {
    return `<section class="films-list${this._isExtra ? `--extra` : ``}">
    <h2 class="films-list__title ${this._isExtra || !this._state ? `` : `visually-hidden`}">${this._title}</h2>
      ${this._state ? `<div class="films-list__container"></div>` : ``}
    </section>`;
  }
}
