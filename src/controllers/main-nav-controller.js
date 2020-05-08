import NavigationContainer from "../components/navigation-container";
import NavigationElement from "../components/navigation-element";
import { render, Position, getCountFilms } from "../utils";
export default class MainNavController {
  constructor(container, onClick) {
    this._container = container;
    this._movieData = [];
    this._onClick = onClick;
    this._navContainer = new NavigationContainer();
    this._init();
  }

  _init() {
    render(this._container, this._navContainer.getElement(), Position.BEFOREEND);
  }

  init(movieData) {
    this._movieData = movieData;
    const navData = [
      {
        title: `All movies`,
        count: false,
        link: `#`,
      },
      {
        title: `Watchlist`,
        count: getCountFilms(this._movieData, `watchlist`),
        link: `watchlist`,
      },
      {
        title: `History`,
        count: getCountFilms(this._movieData, `already_watched`),
        link: `history`,
      },
      {
        title: `Favorites`,
        count: getCountFilms(this._movieData, `favorite`),
        link: `favorites`,
      },
      {
        title: `Stats`,
        count: false,
        link: `stats`,
      },
    ];


    this._navContainer.getElement().innerHTML = ``;
      navData.forEach((filter) => {
        const navigationElement = new NavigationElement(filter, this._onClick);
        render(this._navContainer.getElement(), navigationElement.getElement(), Position.BEFOREEND);
      });
  }
}
