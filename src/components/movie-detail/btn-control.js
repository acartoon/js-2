import AbstractComponent from '../abstract-component.js';
import {createDocumentFragment} from '../../utils.js';

export default class BtnControlComponents extends AbstractComponent {
  constructor({name, label, dataType}, data, onDataChange) {
    super();
    this._name = name;
    this._label = label;
    this._data = data;
    this._dataType = dataType;
    this._onDataChange = onDataChange.bind(this);
    this._onClick();
  }

  getTemplate() {
    return `<input type="checkbox" class="film-details__control-input visually-hidden" id="${this._name}" name="${this._name}"
    ${this._data ? `checked` : ``}><label for="${this._name}" class="film-details__control-label film-details__control-label--${this._name}">${this._label}
    </label>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createDocumentFragment(this.getTemplate());
    }
    return this._element;
  }

  _onClick() {
    this.getElement().querySelector(`.film-details__control-label`).addEventListener(`click`, () => {
      this._onDataChange(this._dataType);
    });
  }

}
