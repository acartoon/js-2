import AbstractComponent from '../abstract-component.js';

export default class BtnControlsLabel extends AbstractComponent {
  constructor({name, label, dataType}, onDataChange) {
    super();
    this._name = name;
    this._label = label;
    this._dataType = dataType;
    this._onDataChange = onDataChange.bind(this);
    this._onClick();
  }

  _onClick() {
    this.getElement().addEventListener(`click`, () => {
      this._onDataChange(this._dataType);
    });
  }

  getTemplate() {
    return `<label for="${this._name}" class="film-details__control-label film-details__control-label--${this._name}">${this._label}
    </label>`;
  }
}
