import AbstractComponent from './abstract-component.js';
import { hideElement, showElement } from '../utils.js';

export default class NavigationContainer extends AbstractComponent {

  getTemplate() {
    return `<nav class="main-navigation"></nav>`;
  }

  hide() {
    hideElement(this.getElement());
  }

  show() {
    showElement(this.getElement());
  }

}
