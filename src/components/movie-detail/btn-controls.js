import AbstractComponent from './abstract-component.js';
import {render, Position, MOVIE_DETAIL_BTN_CONTROLS} from '../utils.js';

export default class BtnControls extends AbstractComponent {
  constructor({watchlist, already_watched, favorite}, onDataChange) {
    super();
    this._watchlist = watchlist;
    this._already_watched = already_watched;
    this._favorite = favorite;
    this.onDataChange = onDataChange;
  }

  init(container) {
    render(container, this.getElement(), Position.BEFOREEND);
    this._renderBtnControls(this._watchlist, this._already_watched, this._favorite);
  }

  _renderBtnControls(watchlist, already_watched, favorite) {


    // const BtnState = [
    //   {data: watchlist, name: `watchlist`, label: `Add to watchlist`},
    //   {data: already_watched, name: `watched`, label: `Already watched`},
    //   {data: favorite, name: `favorite`, label: `Add to favorites`},
    // ];


    Object.keys(MOVIE_DETAIL_BTN_CONTROLS).forEach((btn) => {
      const movieBtnStateInput = new BtnControlsInput(btn);
      const movieBtnStateLabel = new MovieBtnStateLabel(btn, this.onDataChange);
      render(this.getElement(), movieBtnStateInput.getElement(), Position.BEFOREEND);
      render(this.getElement(), movieBtnStateLabel.getElement(), Position.BEFOREEND);
    });
  }

  update({watchlist, already_watched, favorite}) {
    this.getElement().innerHTML = ``;
    this._renderBtn(watchlist, already_watched, favorite);
  }

  getTemplate() {
    return `<section class="film-details__controls">
    </section>`;
  }
}
