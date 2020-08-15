import AbstractComponent from '../../abstract-component.js';

export default class RatingLabel extends AbstractComponent{
  constructor(value, onDataChange) {
    super();
    this.value = value;
    this._onDataChange = onDataChange;
    this._onClick = this._onClick.bind(this);
    this._init();
  }

  _init() {
    this.getElement().addEventListener(`click`, (evt) => evt.preventDefault());
    this.getElement().addEventListener(`click`, this._onClick);
  }

  enable() {
    this.getElement().addEventListener(`click`, this._onClick);
  }

  disable() {
    this.getElement().removeEventListener(`click`, this._onClick);
  }

  showError() {
    this.getElement().style.backgroundColor = `red`;
  }

  removeError() {
    this.getElement().style.backgroundColor = ``;
  }

  getTemplate() {
    return `<label class="film-details__user-rating-label" for="rating-${this.value}">${this.value}</label>`;
  }

  _onClick(evt) {
    this._onDataChange({rating: this})
  }
}
