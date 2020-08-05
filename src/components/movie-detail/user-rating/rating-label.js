import AbstractComponent from '../../abstract-component.js';
import  {DATA_CHANGE} from '../../../utils'

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

  _onClick(evt) {
    this._onDataChange({rating: this})
  }

  enable() {
    this.getElement().addEventListener(`click`, this._onClick);
  }

  disable() {
    this.getElement().removeEventListener(`click`, this._onClick);
  }

  onRed() {
    this.getElement().style.backgroundColor = `red`;
  }

  reset() {
    this.getElement().style.backgroundColor = ``;
  }

  getTemplate() {
    return `<label class="film-details__user-rating-label" for="rating-${this.value}">${this.value}</label>`;
  }
}
