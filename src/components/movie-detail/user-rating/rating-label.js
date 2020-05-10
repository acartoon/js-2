import AbstractComponent from '../../abstract-component.js';

export default class RatingLabel extends AbstractComponent{
  constructor(value) {
    super();
    this._value = value;
  }

  getTemplate() {
    return `<label class="film-details__user-rating-label" for="rating-${this._value}">${this._value}</label>`;
  }
}
