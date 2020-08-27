import AbstractComponent from './abstract-component.js';

export default class NavigationElement extends AbstractComponent {
  constructor({title, anchor, active}, count) {
    super();
    this._title = title;
    this._active = active;
    this._count = count;
    this._anchor = anchor;
    this._activeClass = `main-navigation__item--active`;
    // this._onClick = this._onClick.bind(this);
  }
  getTemplate() {
    return `<a href="#${this._anchor}" class="main-navigation__item ${this._active? this._activeClass : ``} ${this._anchor === `stats` ? `main-navigation__item--additional` : ``}
    ">${this._title} ${this._count !== null ? `<span class="main-navigation__item-count"> ${this._count} </span>` : ``}</a>`;
  }

  init(onAction) {
    this._onClick(onAction)
  }

  _onClick(onAction) {
    this.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();
      onAction(this._anchor, this);
      this.select();
    });
  }

  select() {
    this.getElement().classList.add(this._activeClass);
  }

  deactive() {
    this.getElement().classList.remove(this._activeClass);
  }
}
