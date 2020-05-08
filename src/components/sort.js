import AbstractComponent from './abstract-component.js';

export default class Sort extends AbstractComponent {
  constructor(onClick) {
    super();
    this._callback();
    this._onClick = onClick;
  }

  getTemplate() {
    return `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="date" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating" class="sort__button">Sort by rating</a></li>
    </ul>`;
  }

  _callback() {
    this.getElement().addEventListener(`click`, (evt) => {
      this._onClick(evt.target.dataset.sortType);
      this.getElement().querySelectorAll(`.sort__button--active`)
        .forEach((i) => i.classList.remove(`sort__button--active`));
      evt.target.classList.add(`sort__button--active`);
    });
  }
}
