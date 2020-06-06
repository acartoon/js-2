import AbstractComponent from '../../abstract-component.js';

export default class RatingInput extends AbstractComponent{
  constructor(value, checked) {
    super();
    this._value = value;
    this._checked = checked
  }

  getTemplate() {
    return `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${this._value}" id="rating-${this._value}" ${this._checked ? `checked`: ``}>`;
  }
}
