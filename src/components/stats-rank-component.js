import AbstractComponent from './abstract-component.js';

export default class StatsRankComponent extends AbstractComponent {

  init(rankName) {
    const rank = this.getElement().querySelector(`.statistic__rank-label`);
    rank.innerHTML = rankName;
  }

  getTemplate() {
    return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>
  </section>`;
  }
}
