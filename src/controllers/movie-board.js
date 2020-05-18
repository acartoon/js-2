import { render, Position, hideElement, getComments, RATING, DATA_CHANGE_COMMENTS, DATA_CHANGE_USER_DETAILS, showElement } from "../utils";
import MovieController from "./movie-controller";


export default class MovieBoard {
  constructor(movieData, commentsData, container, onDataChangeMain) {
    this._container = container;
    this._boardContainer = this._container.querySelector(`.films-list__container`)
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._onDataChangeMain = onDataChangeMain;
    this.onDataChange = this.onDataChange.bind(this);
    this._subscriptions = [];
  }

  init() {
    this._renderMovie(this._movieData);
  }

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
      const comments = getComments(movie.comments, this._commentsData);
      const movieCard = new MovieController(movie, comments, this._boardContainer, this.onDataChange);
      this._subscriptions.push(movieCard);
      movieCard.init();
    });
  }

  _updateData(typeData, movieId, data) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    if(index === -1) {
      return;
    }
    if(typeData === DATA_CHANGE_COMMENTS) {
      this._movieData[index].comments = data[DATA_CHANGE_USER_DETAILS];
      this._commentsData = data[DATA_CHANGE_COMMENTS];
    } else if(typeData === DATA_CHANGE_USER_DETAILS || typeData === RATING) {
      this._movieData[index].user_details = data;
    }
  }

  updateMovie(typeData, movie, movieId, data) {
    this._updateData(typeData, movieId, data)
    this._updateMovie(typeData, movieId, data);
  }

  updateBoard(movieData, commentsData) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._boardContainer.innerHTML = ``;
    this._renderMovie(this._movieData);
  }

  _updateMovie(typeData, movieId, data) {
    this._subscriptions.forEach((movieCard) => {
      if(movieCard._movieData.id === movieId) {

        if(typeData === DATA_CHANGE_COMMENTS) {
          const comments = getComments(movieCard._movieData.comments, this._commentsData);
          const newData = {
            DATA_CHANGE_USER_DETAILS: movieCard._movieData.comments,
            DATA_CHANGE_COMMENTS: comments,
          }
          movieCard.update(typeData, newData);
          return;
        }
        movieCard.update(typeData, data);
      }
    });
  }

  clear() {
    this._boardContainer.innerHTML = ``;
  }
}
