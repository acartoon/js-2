import AbstractComponent from './abstract-component.js';

export default class NavigationElement extends AbstractComponent {
  constructor({title, count, link}, onAction) {
    super();
    this._title = title;
    this._count = count;
    this._link = link;
    this._onClick();
    this._onAction = onAction;
  }
  getTemplate() {
    return `<a href="${this._link}" class="main-navigation__item ${this._link === `stats` ? `main-navigation__item--additional` : ``}
    ">${this._title} ${this._count ? `<span class="main-navigation__item-count"> ${this._count} </span>` : ``}</a>`;
  }

  _onClick() {
    this.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();
      this._onAction(this._link);
    })
  }
}
