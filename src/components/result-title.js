import AbstractComponent from './abstract-component.js';
import { render, hideElement, showElement, Position } from '../utils.js';

export default class ResultTitle extends AbstractComponent {
  constructor(container) {
    super();
    this._count = null;
    this._container = container;
    this._init();
  }

  _init() {
    // render(this._container, this.getElement(), Position.AFTERBEGIN);
    this._container.prepend(this.getElement())
    this.hide();
  }

  init(count) {
    this._count = count;
    this.getElement().querySelector(`.result__count`).innerHTML = this._count;
    this.show();
  }

  hide() {
    hideElement(this.getElement());
  }

  show() {
    showElement(this.getElement());
  }

  getTemplate() {
    return `<div class="result">
    <p class="result__text">Result <span class="result__count">${this._count}</span></p>
  </div>`;
  }
}
