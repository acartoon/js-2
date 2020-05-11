import {render, KEY_CODE, unrender, USER_RATING_COUNT, DATA_CHANGE} from '../utils.js';
import moment from 'moment';
import MovieDetails from '../components/movie-detail/movie-details.js';
import BtnControls from '../components/movie-detail/btn-controls.js';
import CommentsController from './comments-controller.js';
import UserRating from '../components/movie-detail/user-rating/user-rating.js';
import RatingInput from '../components/movie-detail/user-rating/rating-input.js';
import RatingLabel from '../components/movie-detail/user-rating/rating-label.js';

export default class MovieDetailsController{
  constructor(movieData, commentsData, onClosePopup, onDataChangeMain) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._onClosePopup = onClosePopup;
    this._closeBtn = null;
    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._movie = new MovieDetails(this._movieData);
    this._btnControls = null;
    this._comments = new CommentsController(this._commentsData);
    this._userRating = new UserRating(this._movieData.user_details.personal_rating);
    this.onDataChangeMain = onDataChangeMain;
    this._containerRating = this._movie.getElement().querySelector(`.form-details__middle-container`);
    this._btnControls = new BtnControls(this._movieData.user_details, this.onDataChange.bind(this));

    // this.onDataChange = onDataChange.bind(this);
  }

  init(container) {
    this._container = container;
    this._renderPopup();
    this._renderBtnControls();

    // const containerRating = this._movie.getElement().querySelector(`.form-details__middle-container`);
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
    // const container = this._movie.getElement().querySelector(`.form-details__middle-container`);
    render(this._containerRating, this._userRating.getElement());

    const scoreContaienr = this._userRating.getElement().querySelector('.film-details__user-rating-score');

    for(let i = 1; i <= USER_RATING_COUNT; i++) {
      let checked = (this._movieData.user_details.personal_rating === i) ? true: false;
      let ratingInput = new RatingInput(i, checked);
      let ratingLabel = new RatingLabel(i);
      render(scoreContaienr, ratingInput.getElement());
      render(scoreContaienr, ratingLabel.getElement());
    }
  }

  _unrenderUserRating() {
    unrender(this._userRating.getElement());
    this._userRating.removeElement();
  }

  _updateUserRating() {
    this._containerRatin.innerHTML = ``;
    this._renderUserRating();
  }

  _renderPopup() {
    render(this._container, this._movie.getElement());
  }

  _renderBtnControls() {
    // this._btnControls = new BtnControls(this._movieData.user_details, this.onDataChange.bind(this));
    const container = this._movie.getElement().querySelector(`.form-details__top-container`);
    this._btnControls.init(container);
  }

  // _updateData(watchlist, already_watched, favorite) {
  //   this._movieData.user_details.watchlist = watchlist;
  //   this._movieData.user_details.already_watched = already_watched;
  //   this._movieData.user_details.favorite = favorite;
  // }

  onDataChange(typeData, data) {
    // this._movieData.user_details.watchlist = watchlist;
    // this._movieData.user_details.already_watched = already_watched;
    // this._movieData.user_details.favorite = favorite;
    // this._updateData(watchlist, already_watched, favorite);
    this.onDataChangeMain(typeData, data);


  }

  _updateData(user_details) {
    this._movieData.user_details = user_details;
  }

  update(user_details) {
    this._updateData(user_details);
    console.log(this._btnControls);
    this._btnControls.update(this._movieData.user_details.watchlist, this._movieData.user_details.already_watched, this._movieData.user_details.favorite)
    this._toggleUserRating();
  }

  // _update(typeData, movieData) {
  //   this._movieData = movieData;
  //   if(typeData === DATA_CHANGE.CONTROLS) {
  //     this._btnControls.update(this._movieData.user_details.watchlist, this._movieData.user_details.already_watched, this._movieData.user_details.favorite);
  //   } else if(typeData === DATA_CHANGE.RATING) {
  //     this._btnControls.update(data);
  //   } else if(typeData === DATA_CHANGE.REMOVE_COMMENT) {

  //   } else if(typeData === DATA_CHANGE.CREATE_COMMENT) {

  //   }
  //   this._toggleUserRating();
  // }

  _toggleUserRating() {
    if(this._already_watched) {
      this._renderUserRating();
    } else {
      this._unrenderUserRating();
    }
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
    this._comments.unrender();
    this._userRating.removeElement();
    unrender(this._userRating.getElement());
    this._btnControls.removeElement();
    unrender(this._btnControls.getElement());
  }
}
