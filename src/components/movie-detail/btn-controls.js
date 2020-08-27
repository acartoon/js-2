import AbstractComponent from '../abstract-component.js';
import {render, Position, PopupBtnControl, TypeDataChange} from '../../utils.js';
import {cloneDeep} from 'lodash';
import BtnControlComponents from './btn-control.js';

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
    console.log(typeData)
    this._initTmpData();
    // поменять когда исправлю тип данных
    switch (typeData) {
      case TypeDataChange.WATCHLIST :
        this._tmpData.watchlist = !this._tmpData.watchlist;
        break;
      case TypeDataChange.ALREADY_WATCHED :
        this._tmpData.already_watched = !this._tmpData.already_watched;
        break;
      case TypeDataChange.FAVORITE :
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
    console.log(watchlist, already_watched, favorite)
    // поправить
    const btnControl = {
      watchlist,
      watched: already_watched,
      favorite,
    };

    // отрисовка кнопок в попапе
    Object.keys(PopupBtnControl).forEach((btn) => {
      console.log(PopupBtnControl[btn]);
      const button = new BtnControlComponents(PopupBtnControl[btn], btnControl[btn], this.onDataChange);
      this.getElement().appendChild(button.getElement());
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
