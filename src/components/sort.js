import AbstractComponent from './abstract-component.js';
import { hideElement, showElement } from '../utils.js';

export default class Sort extends AbstractComponent {
  constructor(onClick) {
    super();
    this._onBtnClick();
    this._onClick = onClick;
    this._activeClass = (`sort__button--active`);
    this._activeBtn = this.getElement().querySelector(`.${this._activeClass}`);
  }

  getTemplate() {
    return `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="date" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating" class="sort__button">Sort by rating</a></li>
    </ul>`;
  }

  _onBtnClick() {
    this.getElement().addEventListener(`click`, (evt) => {
      this._onClick(evt.target.dataset.sortType);
      this._renderActiveElement(evt.target)
    });
  }

  hide() {
    hideElement(this.getElement());
  }

  show() {
    showElement(this.getElement());
    this.default()
  }


  default() {
    const defaultActiveElem = this.getElement().querySelector(`[data-sort-type="default"]`);
    this._renderActiveElement(defaultActiveElem)
  }

  _renderActiveElement(activeElem) {
    this._activeBtn.classList.remove(this._activeClass);
    this._activeBtn = activeElem;
    this._activeBtn.classList.add(this._activeClass);

  }
}
