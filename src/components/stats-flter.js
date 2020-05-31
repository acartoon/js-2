import AbstractComponent from './abstract-component.js';

export default class StatsFilterComponent extends AbstractComponent {
  constructor(container, onStatsLabelClick) {
    super();
    // this._onStatsLabelClick = onStatsLabelClick();
    this._onLabelClick = this._onLabelClick.bind(this);
    this._removeStr = /statistic-/;
    this._render();
  }

  _render() {
    const filters = [
      {value: `all-time`, label: `All time`},
      {value: `today`, label: `Today`},
      {value: `week`, label: `Week`},
      {value: `month`, label: `Month`},
      {value: `year`, label: `Year`},
    ]

    filters.forEach((filter) => {
      this.getElement().insertAdjacentHTML(`beforeend`, this._filterItemTemplate(filter.value, filter.label));
    });

    this.getElement().addEventListener(`click`, this._onLabelClick)

  }

  _onLabelClick(evt) {

    if(evt.target.classList.contains(`statistic__filters-label`)) {
      var newstr = evt.target.htmlFor.replace(this._removeStr, ``);
      this._onStatsLabelClick(newstr);
    }
  }

  _filterItemTemplate(value, label) {
    return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${value}" value="${value}" checked="">
    <label for="statistic-${value}" class="statistic__filters-label">${label}</label>`
  }

  getTemplate() {
    return `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      </form>`;
  }
}
