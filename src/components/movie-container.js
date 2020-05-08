import AbstractComponent from './abstract-component.js';

export default class MovieContainer extends AbstractComponent {
  getTemplate() {
    return `<section class="films">
    </section>`;
  }
}
