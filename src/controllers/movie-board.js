import {hideElement, TypeDataChange, showElement} from "../utils";
import MovieController from "./movie-controller";

export default class MovieBoard {
  constructor(movieData, api, container, onDataChange) {
    this._container = container;
    this._boardContainer = this._container.querySelector(`.films-list__container`);
    this._movieData = movieData;
    this._api = api;
    this.onDataChange = onDataChange;
    this.onChangeView = this.onChangeView.bind(this);
    this._subscriptions = [];
  }

  init() {
    this._renderMovie(this._movieData);
  }

  clear() {
    this._boardContainer.innerHTML = ``;
  }

  hide() {
    hideElement(this._container);
  }

  show() {
    showElement(this._container);
  }

  updateMovie(props) {
    this._updateData(props);
    this._updateMovie(props);
  }

  updateBoard(movieData, commentsData) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._boardContainer.innerHTML = ``;
    this._renderMovie(this._movieData);
  }

  _renderMovie(movieData) {
    movieData.forEach((movie) => {
      const movieCard = new MovieController(movie, this._api, this._boardContainer, this.onDataChange, this.onChangeView);
      this._subscriptions.push(movieCard);
      movieCard.init();
    });
  }

  _updateData({typeData, movieId, value}) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    if (index === -1) {
      return;
    }
    if (typeData === typeData.REMOVE_COMMENT || typeData === TypeDataChange.CREATE_COMMENT) {
      this._movieData[index].comments = value.movie;
    } else if (typeData === TypeDataChange.USER_DETAILS || typeData === TypeDataChange.RATING) {
      this._movieData[index].user_details = value;
    }
  }

  _updateMovie({typeData, movieId, value}) {
    this._subscriptions.forEach((movieCard) => {
      if (movieCard._movieData.id === movieId) {
        movieCard.update({typeData, value});
      }
    });
  }

  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription.setDefaultView());
  }

  onError({typeData, movieId}) {
    this._subscriptions.forEach((movieCard) => {
      if (movieCard._movieData.id === movieId) {
        movieCard.onError({typeData});
      }
    });
  }
}
