import StatsComponent from "../components/stats";
import { render, showElement, hideElement, getCountFilms, STATS_PARAMS, STATS_TYPE_FILTER } from "../utils";
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import StatsFilterComponent from "../components/stats-flter";
import StatsListComponent from "../components/stats-list";
import ChartWrapComponent from "../components/chart-wrap";


export default class StatsController {
  constructor(container) {
    this._container = container;
    this._stats = new StatsComponent(this._container);
    this._onFilterBtnClick = this._onFilterBtnClick.bind(this);
    this._filter = new StatsFilterComponent(this._container, this._onFilterBtnClick);
    this._list = new StatsListComponent(this._container);
    this._chartWrap = new ChartWrapComponent(this._container);
    this._chart = null;
    this._init();
    this._commentsData = [];
    this._movieData = [];
  }

  _init() {
    render(this._container, this._stats.getElement());
    render(this._stats.getElement(), this._filter.getElement());
    render(this._stats.getElement(), this._list.getElement());
    render(this._stats.getElement(), this._chartWrap.getElement());

    this.hide()
  }


  _onFilterBtnClick(filter) {
    const filterType = {
      all: this._movieData,
      today: this._movieData.filter((movie) => moment(movie.user_details.watching_date).isSame(moment(), 'day')),
      week: this._movieData.filter((movie) => moment(movie.user_details.watching_date).isSame(moment(), 'week')),
      month: this._movieData.filter((movie) => moment(movie.user_details.watching_date).isSame(moment(), 'month')),
      year: this._movieData.filter((movie) => moment(movie.user_details.watching_date).isSame(moment(), 'year')),

    };
    this._destroyChart();
    this._initStats(filterType[filter]);
  }

  _initStats(movieData) {

    if(movieData.length === 0) {
      this._list.getValue(0, 0, `&ndash;`)
      return;
    }
    const duration = this._getDurationWachedMovie(movieData);
    const movieGenre = this._getGenresMovie(movieData);

    const countMovie = movieData.length;
    const topGenre = Object.entries(movieGenre).sort((a, b) => b[1] - a[1])[0][0];

    this._list.getValue(countMovie, duration, topGenre)

    const container = this._chartWrap.getElement().querySelector(`.statistic__chart`);
    container.height = STATS_PARAMS.BAR_HEIGHT * Object.keys(movieGenre).length;
    this._renderChart(container, movieGenre);
  }

  show(movieData, commentsData) {
    this._movieData = movieData.filter((movie) => movie.user_details.already_watched === true);
    this._commentsData = commentsData;

    this._show();
    this._initStats(this._movieData);
  }

  _getDurationWachedMovie(moveiData) {
    return moveiData.reduce((result, movie) => {
      result += movie.film_info.runtime;
      return result;
    }, 0);
  }

  _getGenresMovie(movieData) {
     return movieData.reduce((res, movie) => {
      movie.film_info.genre.forEach(genre => {
        res[genre] = res[genre] ? ++res[genre]: 1;
      });
      return res;
    }, {});
  }

  _getChartOptions() {
    return {
      plugins: {
        datalabels: {
          color: STATS_PARAMS.LABEL_COLOR,
          fontSize: STATS_PARAMS.LABEL_FONT_SIZE,
          anchor: STATS_PARAMS.LABEL_ANCHOR,
          align: STATS_PARAMS.LABEL_ALIGNT,
          offset: STATS_PARAMS.LABEL_OFFSET,
        }
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: STATS_PARAMS.MIN_X_LIMIT,
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            fontColor: STATS_PARAMS.LABEL_COLOR,
            fontSize: STATS_PARAMS.LABEL_FONT_SIZE,
            padding: STATS_PARAMS.LABEL_PADDING,
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
    }
  };

  _getChartData(movieGenre) {
    return {
      labels: Object.keys(movieGenre),
      datasets: [{
        data: Object.values(movieGenre),
        backgroundColor: STATS_PARAMS.GENRE_COLOR,

      }]
    };
  }

  _destroyChart() {
    if (this._chart !== null) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _renderChart(container, movieGenre) {
    this._chart = new Chart(container, {
      type: STATS_PARAMS.CHART_TYPE,
      data: this._getChartData(movieGenre),
      responsive: true,
      maintainAspectRatio: false,
      showTooltips: false,
      plugins: [ChartDataLabels],
      options: this._getChartOptions(),
    });
  }


  _show() {
    showElement(this._stats.getElement())
  }

  hide() {

    this._destroyChart();
    hideElement(this._stats.getElement())
  }
}
