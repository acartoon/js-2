import AbstractComponent from '../abstract-component.js';

export default class BtnControlsInput extends AbstractComponent {
  constructor(data, name) {
    super();
    this._data = data;
    this._name = name;
  }

  getTemplate() {
    return `<input type="checkbox" class="film-details__control-input visually-hidden" id="${this._name}" name="${this._name}"
    ${this._data ? `checked` : ``}>`;
  }
}
