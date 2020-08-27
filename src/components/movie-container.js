import AbstractComponent from './abstract-component.js';
import {hideElement, showElement} from '../utils.js';

export default class MovieContainer extends AbstractComponent {

  getTemplate() {
    return `<section class="films">
    </section>`;
  }

  hide() {
    hideElement(this.getElement());
  }

  show() {
    showElement(this.getElement());
  }

}
