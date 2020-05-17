import AbstractComponent from './abstract-component.js';
import { hideElement, showElement } from '../utils.js';

export default class MovieContainer extends AbstractComponent {


  hide() {
    hideElement(this.getElement());
  }

  show() {
    showElement(this.getElement());
  }

  getTemplate() {
    return `<section class="films">
    </section>`;
  }
}
