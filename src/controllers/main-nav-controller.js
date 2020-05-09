import NavigationContainer from "../components/navigation-container";
import NavigationElement from "../components/navigation-element";
import { render, Position, getCountFilms,  FILTER_TYPE} from "../utils";
export default class MainNavController {
  constructor(container, onClick) {
    this._container = container;
    this._movieData = [];
    this._onClick = onClick;
    this._navContainer = new NavigationContainer();
    this._activeElement = null;
    this._init();
  }

  _init() {
    render(this._container, this._navContainer.getElement(), Position.BEFOREEND);
  }

  onBtnlick(data, activeBtn) {
    this._onClick(data);
    this._activeElement.deactive()
    this._activeElement = activeBtn;
  }

  _getData() {

  }

  init(movieData) {
    this._movieData = movieData;

    const filterCount = {
      ALL: null,
      WATCHLIST: getCountFilms(this._movieData, `watchlist`),
      HISTORY: getCountFilms(this._movieData, `already_watched`),
      FAVORITES: getCountFilms(this._movieData, `favorite`),
      STATS: null,
    }

    this._navContainer.getElement().innerHTML = ``;

    Object.keys(FILTER_TYPE).forEach((filter) => {
      const navElem = new NavigationElement(FILTER_TYPE[filter], filterCount[filter]);
      if(filter === `ALL`) {
        this._activeElement = navElem;
      }
      navElem.init(this.onBtnlick.bind(this))
      render(this._navContainer.getElement(), navElem.getElement(), Position.BEFOREEND);
    });
  }
}
