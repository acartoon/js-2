import StatsRankComponent from "../components/stats-rank-component";
import {render, showElement, hideElement, StatsParam, getRank} from "../utils";
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import StatsFilterComponent from "../components/stats-flter";
import StatsListComponent from "../components/stats-list";
import ChartWrapComponent from "../components/chart-wrap";


export default class StatsController {
  constructor(container) {
    this._container = container;
    this._statsRank = new StatsRankComponent(this._container);
    this.onFilterBtnClick = this.onFilterBtnClick.bind(this);
    this._filter = new StatsFilterComponent(this.onFilterBtnClick);
    this._list = new StatsListComponent(this._container);
    this._chartWrap = new ChartWrapComponent(this._container);
    this._chart = null;
    this._init();
    this._commentsData = [];
    this._movieData = [];
    this._noData = `&ndash;`;
  }

  // отрисовать блоки со статистикой
  _init() {
    render(this._container, this._statsRank.getElement());
    render(this._statsRank.getElement(), this._filter.getElement());
    render(this._statsRank.getElement(), this._list.getElement());
    render(this._statsRank.getElement(), this._chartWrap.getElement());

    this.hide();
  }

  // обработчик клика на фильтры
  onFilterBtnClick(filter) {
    const filterType = {
      all: this._movieData,
      today: this._movieData.filter((movie) => moment(movie.user_details.watching_date).isSame(moment(), `day`)),
      week: this._movieData.filter((movie) => moment(movie.user_details.watching_date).isSame(moment(), `week`)),
      month: this._movieData.filter((movie) => moment(movie.user_details.watching_date).isSame(moment(), `month`)),
      year: this._movieData.filter((movie) => moment(movie.user_details.watching_date).isSame(moment(), `year`)),
    };

    this._destroyChart();
    this._initStats(filterType[filter]);
  }

  // отрисовка статистики
  _initStats(movieData) {
    if (movieData.length === 0) {
      this._list.getValue(0, 0, this._noData);
      return;
    }
    const container = this._chartWrap.getElement().querySelector(`.statistic__chart`);

    const duration = this._getDurationWachedMovie(movieData);
    const movieGenre = this._getGenresMovie(movieData);
    const countMovie = movieData.length;
    const topGenre = Object.entries(movieGenre).sort((a, b) => b[1] - a[1])[0][0];

    this._list.getValue(countMovie, duration, topGenre);
    container.height = StatsParam.BAR_HEIGHT * Object.keys(movieGenre).length;
    this._renderChart(container, movieGenre);
  }

  // отрисовать статистику
  show(movieData, commentsData) {
    this._movieData = movieData.filter((movie) => movie.user_details.already_watched === true);
    this._commentsData = commentsData;

    const userRank = getRank(movieData.length);
    this._statsRank.init(userRank);
    this._initStats(this._movieData);
    this._show();
  }

  // получить продолжительность фильмов
  _getDurationWachedMovie(moveiData) {
    return moveiData.reduce((result, movie) => {
      result += movie.film_info.runtime;
      return result;
    }, 0);
  }

  // получить жанры
  _getGenresMovie(movieData) {
    return movieData.reduce((res, movie) => {
      movie.film_info.genre.forEach(genre => {
        // проверить этот ++ress
        res[genre] = res[genre] ? ++res[genre] : 1;
      });
      return res;
    }, {});
  }

  // настройки статистики
  _getChartOptions() {
    return {
      plugins: {
        datalabels: {
          color: StatsParam.LABEL_COLOR,
          fontSize: StatsParam.LABEL_FONT_SIZE,
          anchor: StatsParam.LABEL_ANCHOR,
          align: StatsParam.LABEL_ALIGNT,
          offset: StatsParam.LABEL_OFFSET,
        }
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: StatsParam.MIN_X_LIMIT,
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            fontColor: StatsParam.LABEL_COLOR,
            fontSize: StatsParam.LABEL_FONT_SIZE,
            padding: StatsParam.LABEL_PADDING,
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
    };
  }

  // получить данные о фильмах
  _getChartData(movieGenre) {
    return {
      labels: Object.keys(movieGenre),
      datasets: [{
        data: Object.values(movieGenre),
        backgroundColor: StatsParam.GENRE_COLOR,

      }],
    };
  }

  // очистить
  _destroyChart() {
    if (this._chart !== null) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  // отрисовать статистику
  _renderChart(container, movieGenre) {
    this._chart = new Chart(container, {
      type: StatsParam.CHART_TYPE,
      data: this._getChartData(movieGenre),
      responsive: true,
      maintainAspectRatio: false,
      showTooltips: false,
      plugins: [ChartDataLabels],
      options: this._getChartOptions(),
    });
  }

  // показать окно статистики
  _show() {
    showElement(this._statsRank.getElement());
  }

  // скрыть окно статистики
  hide() {
    this._filter.default();
    this._destroyChart();
    hideElement(this._statsRank.getElement());
  }
}
