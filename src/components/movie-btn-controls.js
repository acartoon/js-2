import AbstractComponent from './abstract-component.js';

export default class MovieBtnControls extends AbstractComponent {
  constructor({state, classBtn, title}, data, onDataChange) {
    super();
    this._state = state;
    this._classBtn = classBtn;
    this._data = data;
    this._title = title;
    this._onDataChange = onDataChange;

    this._onClick();
  }

  getTemplate() {
    return `<button class="film-card__controls-item button film-card__controls-item--${this._classBtn}
    ${this._data ? `film-card__controls-item--active` : ``}">${this._title} </button>`;
  }

  _onClick() {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._onDataChange(`userState`, this._state);
    });
  }
}
