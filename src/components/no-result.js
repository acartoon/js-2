import AbstractComponent from './abstract-component.js';

export default class NoResult extends AbstractComponent {

  getTemplate() {
    return `<div class="no-result">
    There is no movies for your request.
  </div>`;
  }
}
