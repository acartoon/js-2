import moment from 'moment';
import MovieBaseComponent from '../movie-base-component.js';

export default class MovieDetails extends MovieBaseComponent {
  constructor(data) {
    super(data);
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
                  <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${moment.duration(this._runtime, `minutes`).format(`h[h] mm[m]`)}</td>
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
        <div class="form-details__middle-container">
        </div>
        <div class="form-details__bottom-container">
    </div>
  </form>
  </section>`;
  }
}
