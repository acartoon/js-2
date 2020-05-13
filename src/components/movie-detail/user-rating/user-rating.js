import AbstractComponent from '../../abstract-component.js';
import RatingInput from './rating-input.js';
import RatingLabel from './rating-label.js';
import { render, USER_RATING_COUNT } from '../../../utils.js';

export default class UserRating extends AbstractComponent{
  constructor(rating, onDataChange) {
    super();
    this._container = null;
    this._rating = rating;
    this.onDataChange = onDataChange.bind(this);
    this._containerS = this.getElement().querySelector('.film-details__user-rating-score');
  }

  init(container) {
    this._container = container;
    render(this._container, this.getElement());
    this._renderRatingBtn();
  }

  _renderRatingBtn() {
    const container = this.getElement().querySelector('.film-details__user-rating-score');

    for(let i = 1; i <= USER_RATING_COUNT; i++) {
      let checked = (this._rating === i) ? true: false;
      let ratingInput = new RatingInput(i, checked);
      let ratingLabel = new RatingLabel(i, this.onDataChange);
      render(this._containerS, ratingInput.getElement());
      render(this._containerS, ratingLabel.getElement());
    }
  }

  update(rating) {
    this._rating = rating;
    console.log(this._rating)
    this._containerS.innerHTML = ``;
    this._renderRatingBtn();
  }

  getTemplate() {
    return `<section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <button class="film-details__watched-reset" type="button">Undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="./images/posters/the-great-flamarion.jpg" alt="film-poster" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">The Great Flamarion</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">
          <!-- rating-->
          </div>
        </section>
      </div>
    </section>`;
  }
}
