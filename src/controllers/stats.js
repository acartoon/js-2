import StatsComponent from "../components/stats";
import { render, showElement, hideElement, getCountFilms, STATS_PARAMS } from "../utils";
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
    this._filter = new StatsFilterComponent(this._container);
    this._list = new StatsListComponent(this._container);
    this._chartWrap = new ChartWrapComponent(this._container);
    this._init();
    this._allMovieData = [];
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

  show(movieData, commentsData) {
    this._allMovieData = movieData;
    this._commentsData = commentsData;
    this._movieData = this._allMovieData.filter((movie) => movie.user_details.already_watched === true);
    this._show();

    const duration = this._getDurationWachedMovie();
    const movieGenre = this._getGenresMovie();
    const topGenre = Object.entries(movieGenre).sort((a, b) => b[1] - a[1])[0]


    // this._renderChart(movieGenre);
  }

  _renderChart(movieGenre) {
    const chartData = {
      labels: Object.keys(movieGenre),
      datasets: [{
        data: Object.values(movieGenre),
        backgroundColor: STATS_PARAMS.GENRE_COLOR,

      }]
    };

    const chartOptions = {
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
            // suggestedMax: maxXLimit
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
    };

    const ctx = this._chartWrap.getElement().querySelector(`.statistic__chart`);
    ctx.height = STATS_PARAMS.BAR_HEIGHT * Object.keys(movieGenre).length;

    var myBarChart = new Chart(ctx, {
      type: STATS_PARAMS.CHART_TYPE,
      data: chartData,
      responsive: true,
      maintainAspectRatio: false,
      showTooltips: false,
      plugins: [ChartDataLabels],
      options: chartOptions
  });
  }

  _getGenresMovie() {
     return this._movieData.reduce((res, movie) => {
      movie.film_info.genre.forEach(genre => {
        res[genre] = res[genre] ? ++res[genre]: 1;
      });
      return res;
    }, {});
  }


  _destroyChart() {
    if (this._statisticChart !== null) {
      this._statisticChart.destroy();
      this._statisticChart = null;
    }
  }


  _getDurationWachedMovie() {
    return this._movieData.reduce((result, movie) => {
      result += movie.film_info.runtime;
      return result;
    }, 0);
  }

  _show() {
    showElement(this._stats.getElement())
  }

  hide() {
    hideElement(this._stats.getElement())
  }
}
