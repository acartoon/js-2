import {render, KeyCode, unrender, TypeDataChange} from '../utils.js';
import MovieDetails from '../components/movie-detail/movie-details.js';
import BtnControls from '../components/movie-detail/btn-controls.js';
import CommentsController from './comments-controller.js';

export default class MovieDetailsController {
  constructor(movieData, commentsData, onClosePopup, onDataChangeMain) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._onClosePopup = onClosePopup;
    this.onEscKeyDown = this.onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._movie = new MovieDetails(this._movieData);
    this.onDataChangeMain = onDataChangeMain.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this._comments = new CommentsController(this._commentsData, this.onDataChangeMain, this.onEscKeyDown);
    this._closeBtn = this._movie.getElement().querySelector(`.film-details__close-btn`);
    this._containerRating = this._movie.getElement().querySelector(`.form-details__middle-container`);
    this._btnControls = null;
    this._btnControls = null;
  }

  init(container) {
    this._container = container;

    render(this._container, this._movie.getElement());
    this._renderBtnControls();
    this._renderComments();
    this._closeBtn.addEventListener(`click`, this._closePopup);
    document.addEventListener(`keydown`, this.onEscKeyDown);
  }

  getElement() {
    return this._movie.getElement();
  }

  unrender() {
    this._comments.unrender();
    this._remove(this._movie);
    this._remove(this._btnControls);
  }

  // ошибка при обновлении данных
  onError({typeData}) {
    if (typeData === TypeDataChange.CREATE_COMMENT) {
      this._comments.onError();
    }
  }

  update({typeData, value}) {
    this._updateData({typeData, value});
    switch (typeData) {
      case TypeDataChange.USER_DETAILS:
        this._btnControls.update(this._movieData.user_details);
        break;
      case TypeDataChange.REMOVE_COMMENT:
        this._comments.update({typeData, value: this._commentsData});
        break;
      case TypeDataChange.CREATE_COMMENT:
        this._comments.update({typeData, value: value.comments});
        break;
    }
  }

  // отрисовка кнопок
  _renderBtnControls() {
    this._btnControls = new BtnControls(this._movieData.user_details, this.onDataChange);
    const container = this._movie.getElement().querySelector(`.form-details__top-container`);
    this._btnControls.init(container);
  }

  _renderComments() {
    const container = this._movie.getElement().querySelector(`.form-details__bottom-container`);
    this._comments.init(container);
  }

  // обновление данных
  _updateData({typeData, value}) {
    if (typeData === (TypeDataChange.REMOVE_COMMENT || TypeDataChange.CREATE_COMMENT)) {
      this._movieData.comments = value.movie;
      this._commentsData = value.comments;
    } else if (typeData === TypeDataChange.USER_DETAILS) {
      this._movieData.user_details = value;
    }
  }

  _remove(elem) {
    unrender(elem.getElement());
    elem.removeElement();
  }

  onEscKeyDown(evt) {
    if (evt.key === KeyCode.ESC) {
      this._closePopup();
    }
  }

  _closePopup() {
    this._onClosePopup();
    document.removeEventListener(`keydown`, this.onEscKeyDown);
    this._closeBtn.removeEventListener(`click`, this.onEscKeyDown);
  }

  // обновление данных
  onDataChange(value) {
    // в movieController
    this.onDataChangeMain({typeData: TypeDataChange.USER_DETAILS, value});
  }
}
