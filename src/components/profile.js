import AbstractComponent from './abstract-component.js';
import { rank, render } from '../utils.js';

export default class Profile extends AbstractComponent {
  constructor() {
    super();
    this._rank = null;
  }

  init(container, rank) {
    this._rank = rank;
    render(container, this.getElement());
  }

  update(rank) {
    // this.getElement().q
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }
}
