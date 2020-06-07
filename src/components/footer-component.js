import AbstractComponent from './abstract-component.js';
import { render } from '../utils.js';

export default class FooterComponent extends AbstractComponent {
  constructor(container) {
    super();
    this._container = container;
  }

  init(movieCount) {
    this._movieCount = movieCount;
    render(this._container, this.getElement());
  }

  getTemplate() {
    return `<p>${this._movieCount} movies inside</p>`;
  }
}
