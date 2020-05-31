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

  //тоже вопрос, подвтор данных movieId и movie??????
  onDataChange(typeData, movieId, data, movie) {
    this._onDataChangeMain(typeData, movieId, data, movie);
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

  _updateData(typeData, movieId, data) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    if(index === -1) {
      return;
    }
    if(typeData === REMOVE_COMMENT) {
      this._movieData[index].comments = data;
    } else if(typeData === CREATE_COMMENT) {
      this._movieData[index].comments = data.comments;
    } else if(typeData === DATA_CHANGE_USER_DETAILS || typeData === RATING) {
      this._movieData[index].user_details = data;
    }
  }

  updateMovie(typeData, movieId, data, comments) {
    this._updateData(typeData, movieId, data, comments)
    this._updateMovie(typeData, movieId, data, comments);
  }

  updateBoard(movieData, commentsData) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._boardContainer.innerHTML = ``;
    this._renderMovie(this._movieData);
  }

  _updateMovie(typeData, movieId, data, comments) {
    this._subscriptions.forEach((movieCard) => {
      if(movieCard._movieData.id === movieId) {
        movieCard.update(typeData, data, comments);
      }
    });
  }

  clear() {
    this._boardContainer.innerHTML = ``;
  }
}
