import AbstractComponent from './abstract-component.js';
import { hideElement, showElement } from '../utils.js';

export default class NavigationContainer extends AbstractComponent {


  hide() {
    hideElement(this.getElement());
  }

  show() {
    showElement(this.getElement());
  }

  getTemplate() {
    return `<nav class="main-navigation"></nav>`;
  }
}
