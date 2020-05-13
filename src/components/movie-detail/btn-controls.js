import AbstractComponent from '../abstract-component.js';
import {render, Position, MOVIE_DETAIL_BTN_CONTROLS, DATA_CHANGE} from '../../utils.js';
import MovieBtnStateLabel from './btn-controls-label';
import MovieBtnStateInput from './btn-controls-input';
import {cloneDeep} from 'lodash';

export default class BtnControls extends AbstractComponent {
  constructor({watchlist, already_watched, favorite}, onDataChangeMain) {
    super();
    this._watchlist = watchlist;
    this._already_watched = already_watched;
    this._favorite = favorite;
    this.onDataChangeMain = onDataChangeMain;
    this.onDataChange = this.onDataChange.bind(this);
  }

  init(container) {
    render(container, this.getElement(), Position.BEFOREEND);
    this._renderBtnControls(this._watchlist, this._already_watched, this._favorite);
  }

  _initTmpData() {
    this._tmpData = cloneDeep(this._movieData);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  _renderBtnControls(watchlist, already_watched, favorite) {
    const DATA = {
      WATCHLIST: watchlist,
      ALREADY_WATCHED: already_watched,
      FAVORITE: favorite,
    };

    Object.keys(MOVIE_DETAIL_BTN_CONTROLS).forEach((btn) => {
      const movieBtnStateLabel = new MovieBtnStateLabel(MOVIE_DETAIL_BTN_CONTROLS[btn], this.onDataChange);
      const movieBtnStateInput = new MovieBtnStateInput(DATA[btn], MOVIE_DETAIL_BTN_CONTROLS[btn].name)
      render(this.getElement(), movieBtnStateInput.getElement(), Position.BEFOREEND);
      render(this.getElement(), movieBtnStateLabel.getElement(), Position.BEFOREEND);
    });
  }

  //при срабатывании onDataChange из main вернется срабатываение функции update
  onDataChange(value) {
    let data = null;
    if(value === MOVIE_DETAIL_BTN_CONTROLS.WATCHLIST.name) {
      data = !this._watchlist
    } else if(value ===  MOVIE_DETAIL_BTN_CONTROLS.ALREADY_WATCHED.name) {
      data = !this._already_watched
    } else if(value === MOVIE_DETAIL_BTN_CONTROLS.FAVORITE.name) {
      data = !this._favorite
    }

    this.onDataChangeMain(value, data);
  }

  _updateData(watchlist, already_watched, favorite) {
    this._watchlist = watchlist;
    this._already_watched = already_watched;
    this._favorite = favorite;
  }

  update(watchlist, already_watched, favorite) {
    // this._watchlist = watchlist;
    // this._already_watched = already_watched;
    // this._favorite = favorite;
    this._updateData(watchlist, already_watched, favorite);
    this.getElement().innerHTML = ``;
    this._renderBtnControls(this._watchlist, this._already_watched, this._favorite);
  }

  // reset() {

  // }

  getTemplate() {
    return `<section class="film-details__controls">
    </section>`;
  }
}
