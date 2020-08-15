import AbstractComponent from '../../abstract-component.js';
import RatingInput from './rating-input.js';
import RatingLabel from './rating-label.js';
import {render, USER_RATING_COUNT, ANIMATION_TIMEOUT} from '../../../utils.js';

export default class UserRating extends AbstractComponent{
  constructor(name, poster, rating, onDataChangeMain) {
    super();
    this._container = null;
    this._rating = rating;
    this.onDataChangeMain = onDataChangeMain;
    this._name = name;
    this._poster = poster;
    this._ratingContainer= this.getElement().querySelector('.film-details__user-rating-score');
    // this._renderRatingBtn = this._renderRatingBtn.bind(this);
    this._input = [];
    this.onDataChange = this.onDataChange.bind(this);
  }

  init(container) {
    this._container = container;
    render(this._container, this.getElement());
    this._renderRatingBtn();
    this._resetRating();
  }

  onError() {
    this._enable();
    this._ratingContainer.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._activeRating.showError();

    setTimeout(() => {
      this._ratingContainer.style.animation = ``
    }, ANIMATION_TIMEOUT);
  }

  _enable() {
    this._input.forEach((input) => input.enable());
  }

  onDataChange({rating}) {
    if(this._activeRating) {
      this._activeRating.removeError();
    }
    this._activeRating = rating;
    this.disable();
    this.onDataChangeMain({typeData: typeDataChange.RATING,  value: rating.value})
  }

  _resetRating() {
    const undo = this.getElement().querySelector(`.film-details__watched-reset`);
    undo.addEventListener(`click`, () => {
      this.onDataChange({typeData: typeDataChange.RATING, value: 0})
    })
  }

  _renderRatingBtn() {
    for(let i = 1; i <= USER_RATING_COUNT; i++) {
      let checked = (this._rating === i) ? true: false;
      let ratingInput = new RatingInput(i, checked);
      let ratingLabel = new RatingLabel(i, this.onDataChange);

      render(this._ratingContainer, ratingInput.getElement());
      this._input.push(ratingLabel);
      render(this._ratingContainer, ratingLabel.getElement());
    }
  }

  update(rating) {
    this._rating = rating;
    this._ratingContainer.innerHTML = ``;
    this._renderRatingBtn();
  }

  disable() {
    this._input.forEach((input) => input.disable());
  }

  getTemplate() {
    return `<section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <button class="film-details__watched-reset" type="button">Undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${this._name}</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">
          <!-- rating-->
          </div>
        </section>
      </div>
    </section>`;
  }
}
