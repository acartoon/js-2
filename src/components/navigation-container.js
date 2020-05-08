import AbstractComponent from './abstract-component.js';

export default class NavigationContainer extends AbstractComponent {
  getTemplate() {
    return `<nav class="main-navigation"></nav>`;
  }
}
