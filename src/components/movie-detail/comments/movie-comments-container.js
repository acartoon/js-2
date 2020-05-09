import AbstractComponent from '../abstract-component.js';

export default class MovieCommentsContainer extends AbstractComponent {
  getTemplate() {
    return `<section class="film-details__comments-wrap"></section>`;
  }
}
