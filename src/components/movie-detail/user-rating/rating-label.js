import AbstractComponent from '../../abstract-component.js';
import  {DATA_CHANGE} from '../../../utils'

export default class RatingLabel extends AbstractComponent{
  constructor(value, onDataChange) {
    super();
    this._value = value;
    this._onDataChange = onDataChange;
    this._onClick = this._onClick.bind(this);
    this._init();
  }

  _init() {
    this.getElement().addEventListener(`click`, this._onClick)
  }

  _onClick(evt) {
    this._onDataChange(DATA_CHANGE.RATING, this._value)
    console.log(evt.target)
  }

  getTemplate() {
    return `<label class="film-details__user-rating-label" for="rating-${this._value}">${this._value}</label>`;
  }
}
