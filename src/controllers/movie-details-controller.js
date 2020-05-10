import {render, KEY_CODE, unrender, USER_RATING_COUNT} from '../utils.js';
import moment from 'moment';
import MovieDetails from '../components/movie-detail/movie-details.js';
import BtnControls from '../components/movie-detail/btn-controls.js';
import MovieCommentsContainer from '../components/movie-detail/comments/movie-comments-container.js';
import CommentsList from '../components/movie-detail/comments/comments-list.js';
import CommentComponent from '../components/movie-detail/comments/comment-component.js';
import CommentsController from './comments-controller.js';
import UserRating from '../components/movie-detail/user-rating/user-rating.js';
import RatingInput from '../components/movie-detail/user-rating/rating-input.js';
import RatingLabel from '../components/movie-detail/user-rating/rating-label.js';

export default class MovieDetailsController{
  constructor(movieData, commentsData, onClosePopup) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._onClosePopup = onClosePopup;
    this._closeBtn = null;
    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._movie = new MovieDetails(this._movieData);
    this._btnControls = null;
    this._commentsList = new CommentsList();
    this._comments = new CommentsController(this._commentsData);
    this._userRating = new UserRating(this._movieData.user_details.personal_rating);
  }

  init(container) {
    this._container = container;
    this._renderPopup();
    this._renderBtnControls();

    if(this._movieData.user_details.already_watched) {
      this._renderUserRating();
    }

    this._renderComments();
    this._initListeners();
  }

  _initListeners() {
    this._closeBtn = this._movie.getElement().querySelector(`.film-details__close-btn`);
    this._closeBtn.addEventListener(`click`, this._onCloseBtnClick);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _renderUserRating() {
    const container = this._movie.getElement().querySelector(`.form-details__middle-container`);
    render(container, this._userRating.getElement());

    const scoreContaienr = this._userRating.getElement().querySelector('.film-details__user-rating-score');
    // const test = new Array(USER_RATING_COUNT).fill(``).map((item, i, arr) => ++i);

    for(let i = 1; i <= USER_RATING_COUNT; i++) {
      let checked = (this._movieData.user_details.personal_rating === i) ? true: false;
      let ratingInput = new RatingInput(i, checked);
      let ratingLabel = new RatingLabel(i);
      render(scoreContaienr, ratingInput.getElement());
      render(scoreContaienr, ratingLabel.getElement());
    }
  }


  _renderPopup() {
    render(this._container, this._movie.getElement());
  }

  _renderBtnControls() {
    this._btnControls = new BtnControls(this._movieData.user_details, this.onDataChange);
    const container = this._movie.getElement().querySelector(`.form-details__top-container`);
    this._btnControls.init(container);
  }

  onDataChange(i) {
    console.log(i)
  }

  _renderComments() {
    const container = this._movie.getElement().querySelector(`.form-details__bottom-container`);
    this._comments.init(container);
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

  unrender() {
    unrender(this._movie.getElement());
    this._movie.removeElement();
  }
}
