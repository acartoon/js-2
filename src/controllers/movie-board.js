import { render, Position, hideElement, getComments, RATING, DATA_CHANGE_COMMENTS, DATA_CHANGE_USER_DETAILS, showElement, REMOVE_COMMENT, CREATE_COMMENT } from "../utils";
import MovieController from "./movie-controller";


export default class MovieBoard {
  constructor(movieData, api, container, onDataChangeMain) {
    this._container = container;
    this._boardContainer = this._container.querySelector(`.films-list__container`)
    this._movieData = movieData;
    this._api = api;
    this._onDataChangeMain = onDataChangeMain;
    this.onDataChange = this.onDataChange.bind(this);
    this._subscriptions = [];
  }

  init() {
    this._renderMovie(this._movieData);
  }


  onDataChange(data) {
    console.log(data)
    this._onDataChangeMain(data);
  }

  hide() {
    hideElement(this._container);
  }

  show() {
    showElement(this._container);
  }

  _renderMovie(movieData) {
    movieData.forEach((movie) => {
      const movieCard = new MovieController(movie, this._api, this._boardContainer, this.onDataChange);
      this._subscriptions.push(movieCard);
      movieCard.init();
    });
  }

  _updateData({typeDataChange, movieId, value}) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    if(index === -1) {
      return;
    }
    if(typeDataChange === REMOVE_COMMENT || typeDataChange === CREATE_COMMENT) {
      this._movieData[index].comments = value.movie;
    } else if(typeDataChange === DATA_CHANGE_USER_DETAILS || typeDataChange === RATING) {
      this._movieData[index].user_details = value;
    }
  }

  updateMovie(data) {
    this._updateData(data)
    this._updateMovie(data);
  }

  updateBoard(movieData, commentsData) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._boardContainer.innerHTML = ``;
    this._renderMovie(this._movieData);
  }

  _updateMovie({typeDataChange, movieId, value}) {
    this._subscriptions.forEach((movieCard) => {
      if(movieCard._movieData.id === movieId) {
        movieCard.update({typeDataChange, value});
      }
    });
  }

  clear() {
    this._boardContainer.innerHTML = ``;
  }
}
