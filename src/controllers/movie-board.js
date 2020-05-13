import { render, Position, hideElement, getComments } from "../utils";
import MovieList from "../components/movie-list";
import MovieCard from "../components/movie-card";
import MovieController from "./movie-controller";


export default class MovieBoard {
  constructor({isExtra, title}, movieData, commentsData, container, onDataChangeMain) {
    this._container = container;
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._isExtra = isExtra;
    this._title = title;
    this._onDataChangeMain = onDataChangeMain;
    this._movieListContainer = new MovieList(this._isExtra, this._title);
    this.onDataChange = this.onDataChange.bind(this);
    this._subscriptions = [];
  }

  init() {
    this._renderContainer();
    this._renderMovie(this._movieData);
  }

  onDataChange(typeData, movieId, data, movie) {
    this._onDataChangeMain(typeData, movieId, data, movie);
  }

  _renderContainer() {
    render(this._container, this._movieListContainer.getElement(), Position.BEFOREEND);
  }

  _renderMovie(movieData) {
    movieData.forEach((movie) => {
      const container = this._movieListContainer.getElement().querySelector('.films-list__container');
      const comments = getComments(movie.comments, this._commentsData);
      const movieCard = new MovieController(movie, comments, container, this.onDataChange);
      this._subscriptions.push(movieCard);
      movieCard.init();
    });
  }

  _updateData(movieId, user_details) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    console.log(index);
    if(index === -1) {
      return;
    }
    this._movieData[index].user_details = user_details;
  }

  update(typeData, movie, movieId, user_details) {
    const index = this._movieData.findIndex((i) => i.id === movieId);
    if(index === -1) {
      return;
    }
    this._movieData[index].user_details = user_details;

    this._subscriptions.forEach((movieCard) => {
      if(movieCard._movieData.id === movieId)
      movieCard.update(typeData, user_details)
    });
    // this._updateMovieBoard(typeData, movieId, user_details);
  }

  _updateMovieBoard(typeData, movieId, user_details) {
    this._subscriptions.forEach((movieCard) => {
      if(movieCard._movieData.id === movieId)
      movieCard.update(typeData, user_details)
    });
  }
}
