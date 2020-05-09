import {render, KEY_CODE} from '../../utils.js';
import moment from 'moment';
import AbstractComponent from '../abstract-component.js';
import MovieBaseComponent from '../movie-base-component.js';

export default class MovieDetails extends MovieBaseComponent{
  constructor(data, commentsData, onClosePopup) {
    super(data);
    this._commentsData = commentsData;
    this._onClosePopup = onClosePopup;
    this._closeBtn = null;
    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(container) {
    this._container = container;
    render(this._container, this.getElement())
    this._closeBtn = this.getElement().querySelector(`.film-details__close-btn`);
    this._closeBtn.addEventListener(`click`, this._onCloseBtnClick);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onCloseBtnClick() {
    this._onClosePopup();
    this._closeBtn.removeEventListener(`click`, this._onClose);
    document.removeEventListener(`keydown`, this._onEscKeyDown);

  }

  _onEscKeyDown(evt) {
    if(evt.key === KEY_CODE.ESC) {
      this._onCloseBtnClick();
    }
  }

  getTemplate() {
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${this._poster}" alt="${this._poster}">

              <p class="film-details__age">${this._age_rating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._title}</h3>
                  <p class="film-details__title-original">Original: ${this._alternative_title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._total_rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${this._director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${this._writers.map((writer) => writer).join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${this._actors.map((actor) => actor).join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${this._runtime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${this._release_country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${this._genre.length > 1 ? `Genres` : `Genre`}</td>
                  <td class="film-details__cell">
                  ${Array.from(this._genre).map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``)}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${this._description}
              </p>
            </div>
          </div>
        </div>

        <div class="form-details__bottom-container">

    </div>
  </form>
  </section>`;
  }
}
