import AbstractComponent from '../abstract-component.js';
import {render, Position, PopupBtnControl, typeDataChange} from '../../utils.js';
import MovieBtnStateLabel from './btn-controls-label';
import MovieBtnStateInput from './btn-controls-input';
import {cloneDeep} from 'lodash';

export default class BtnControls extends AbstractComponent {
  constructor(btnControls, onDataChangeMain) {
    super();
    this._btnControls = btnControls;
    this.onDataChangeMain = onDataChangeMain;
    this.onDataChange = this.onDataChange.bind(this);
    this._tmpData = null;
  }

  getTemplate() {
    return `<section class="film-details__controls">
    </section>`;
  }

  init(container) {
    render(container, this.getElement(), Position.BEFOREEND);
    this._renderBtnControls(this._btnControls);
  }

   // изменение данных при нажатии на кнопку
   onDataChange(typeData) {
    this._initTmpData();
    // поменять когда исправлю тип данных
    switch(typeData) {
      case typeDataChange.WATCHLIST :
        this._tmpData.watchlist = !this._tmpData.watchlist;
        break;
      case typeDataChange.ALREADY_WATCHED :
        this._tmpData.already_watched = !this._tmpData.already_watched;
        break;
      case typeDataChange.FAVORITE :
        this._tmpData.favorite = !this._tmpData.favorite;
        break;
    }

    this.onDataChangeMain(this._tmpData);
    this._resetTmpData();
  }

  _initTmpData() {
    this._tmpData = cloneDeep(this._btnControls);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  _renderBtnControls({watchlist, already_watched, favorite}) {
    // поправить
    const btnControl = {
      watchlist: watchlist,
      watched: already_watched,
      favorite: favorite,
    };

    // отрисовка кнопок в попапе
    Object.keys(PopupBtnControl).forEach((btn) => {
      const movieBtnStateLabel = new MovieBtnStateLabel(PopupBtnControl[btn], this.onDataChange);
      const movieBtnStateInput = new MovieBtnStateInput(btnControl[btn], PopupBtnControl[btn].name)
      render(this.getElement(), movieBtnStateInput.getElement(), Position.BEFOREEND);
      render(this.getElement(), movieBtnStateLabel.getElement(), Position.BEFOREEND);
    });
  }

  _updateBtnControls(userDetails) {
    this._btnControls = userDetails;
  }

  update(userDetails) {
    this._updateBtnControls(userDetails);
    this.getElement().innerHTML = ``;
    this._renderBtnControls(userDetails);
  }

}
