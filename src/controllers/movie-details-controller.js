import {render, keyCode, unrender, typeDataChange} from '../utils.js';
import moment from 'moment';
import MovieDetails from '../components/movie-detail/movie-details.js';
import BtnControls from '../components/movie-detail/btn-controls.js';
import CommentsController from './comments-controller.js';
// import UserRating from '../components/movie-detail/user-rating/user-rating.js';

export default class MovieDetailsController{
  constructor(movieData, commentsData, onClosePopup, onDataChangeMain) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._onClosePopup = onClosePopup;
    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._movie = new MovieDetails(this._movieData);
    this.onDataChangeMain = onDataChangeMain.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this._comments = new CommentsController(this._commentsData, this.onDataChangeMain);
    this._closeBtn = this._movie.getElement().querySelector(`.film-details__close-btn`);
    this._containerRating = this._movie.getElement().querySelector(`.form-details__middle-container`);
    this._btnControls = null;
    // this._userRating = null;
    this._btnControls = null;
  }

  init(container) {
    this._container = container;
    render(this._container, this._movie.getElement());

    this._renderBtnControls();
    // this._toggleUserRating();
    this._renderComments();
    this._initListeners();
  }

  getElement() {
    return this._movie.getElement();
  }

  unrender() {
    this._comments.unrender();
    this._remove(this._movie);
    this._remove(this._btnControls);

    // if(this._userRating) {
    //   this._unrenderUserRating();
    // }
  }

  // ошибка при обновлении данных
  onError({typeData}) {
    if(typeData === typeDataChange.CREATE_COMMENT) {
      this._comments.onError();
    }
    // else if(typeData === typeDataChange.RATING) {
    //   this._userRating.onError();
    // }
  };

  update({typeData, value}) {
    this._updateData({typeData, value});
    switch (typeData) {
      case typeDataChange.USER_DETAILS:
        this._btnControls.update(this._movieData.user_details)
        // this._toggleUserRating();
        break;
      case typeDataChange.REMOVE_COMMENT:
        this._comments.update({typeData, value: this._commentsData});
        break;
      case typeDataChange.CREATE_COMMENT:
        this._comments.update({typeData, value: value.comments});
        break;
    }
  }

  // _renderUserRating() {
  //   this._userRating = new UserRating(this._movieData.film_info.title, this._movieData.film_info.poster, this._movieData.user_details.personal_rating, this.onDataChangeMain);
  //   this._userRating.init(this._containerRating);
  // }

  // _unrenderUserRating() {
  //   this._remove(this._userRating);
  //   this._userRating = null;
  // }

  // _toggleUserRating() {
  //   const alreadyWatched = this._movieData.user_details.already_watched;

  //   if(alreadyWatched && !this._userRating) {
  //     this._renderUserRating();
  //   } else if(!alreadyWatched && this._userRating) {
  //     this._unrenderUserRating();
  //   }
  // }

  _initListeners() {
    this._closeBtn.addEventListener(`click`, this._onCloseBtnClick);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  // отрисовка кнопок
  _renderBtnControls() {
    this._btnControls = new BtnControls(this._movieData.user_details, this.onDataChange);
    const container = this._movie.getElement().querySelector(`.form-details__top-container`);
    this._btnControls.init(container);
  }

  // обновление данных
  _updateData({typeData, value}) {
    if(typeData === (typeDataChange.REMOVE_COMMENT || typeDataChange.CREATE_COMMENT)) {
      this._movieData.comments = value.movie;
      this._commentsData = value.comments;
    } else if (typeData === typeDataChange.USER_DETAILS) {
      this._movieData.user_details = value;
    }
  }

  _renderComments() {
    const container = this._movie.getElement().querySelector(`.form-details__bottom-container`);
    this._comments.init(container);
  }

  _remove(elem) {
    unrender(elem.getElement());
    elem.removeElement();
  }

  _onEscKeyDown(evt) {
    if(evt.key === keyCode.ESC) {
      this._onCloseBtnClick();
    }
  }

  _onCloseBtnClick() {
    this._onClosePopup();
    this._closeBtn.removeEventListener(`click`, this._onClose);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  // обновление данных
  onDataChange(value) {
    // рейтинга не будет
    // if(this._userRating) {
    //   this._userRating.disable();
    // }
    // в movieController
    this.onDataChangeMain({typeData: typeDataChange.USER_DETAILS, value});
  }
}
