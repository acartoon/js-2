import NavigationContainer from "../components/navigation-container";
import NavigationElement from "../components/navigation-element";
import {render, Position, getCountFilms, Filter} from "../utils";
export default class MainNavController {
  constructor(container, onClick) {
    this._container = container;
    this._movieData = [];
    this._onClick = onClick;
    this._navContainer = new NavigationContainer();
    this._activeElement = null;
    this._init();
  }

  init(movieData) {
    this._movieData = movieData;

    const filterCount = {
      ALL: null,
      WATCHLIST: getCountFilms(this._movieData, `watchlist`),
      HISTORY: getCountFilms(this._movieData, `already_watched`),
      FAVORITES: getCountFilms(this._movieData, `favorite`),
      STATS: null,
    };

    this._navContainer.getElement().innerHTML = ``;

    Object.keys(Filter).forEach((filterItem) => {
      const navElem = new NavigationElement(Filter[filterItem], filterCount[filterItem]);
      if (Filter[filterItem].anchor === Filter.ALL.anchor) {
        this._activeElement = navElem;
      }
      navElem.init(this.onBtnClick.bind(this));
      render(this._navContainer.getElement(), navElem.getElement(), Position.BEFOREEND);
    });
  }

  hide() {
    this._navContainer.hide();
  }

  show() {
    this._navContainer.show();
  }

  _init() {
    render(this._container, this._navContainer.getElement(), Position.BEFOREEND);
  }

  onBtnClick(data, activeBtn) {
    this._onClick(data);
    this._activeElement.deactive();
    this._activeElement = activeBtn;
  }
}
