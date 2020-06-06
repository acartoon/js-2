import AbstractComponent from './abstract-component.js';

export default class StatsListComponent extends AbstractComponent {
  constructor(container) {
    super();

  }

  getValue(count, duration, genre) {
    const hours = parseInt(duration/60);
    const min = parseInt(duration % 60);

    const countContainer = this.getElement().querySelector(`[data-type="count"]`);
    const timeContainer = this.getElement().querySelector(`[data-type="time"]`);
    const genreContainer = this.getElement().querySelector(`[data-type="genre"]`);

    countContainer.firstChild.data = count;
    timeContainer.firstChild.data = hours;
    timeContainer.childNodes[2].data = min;
    genreContainer.innerHTML = genre;
  }

  getTemplate() {
    return `<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p data-type="count" class="statistic__item-text">
          <span class="statistic__item-description">movies</span>
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p data-type="time" class="statistic__item-text">
          <span class="statistic__item-description">h</span>
          <span class="statistic__item-description">m</span>
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p data-type="genre" class="statistic__item-text"></p>
      </li>
    </ul>`;
  }
}
