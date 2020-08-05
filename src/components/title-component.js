import AbstractComponent from './abstract-component.js';
import { render, unrender } from '../utils.js';

export default class TitleComponent extends AbstractComponent {
  constructor(container) {
    super();
    this._container = container;
    this._LOADING_TITLE = `Loading...`;
    this._NO_NOVIE = `There are no movies in our database`;
  }

  init() {
    render(this._container, this.getElement())
  }

  // нигде не используется
  initNoMovieTitle() {
    this.getElement().innerHTML = this._NO_NOVIE;
  }

  remove() {
    unrender(this.getElement());
    this.removeElement();
  }


  getTemplate() {
    return `<h2>${this._LOADING_TITLE}</h2>` ;
  }
}
