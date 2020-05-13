import MovieCard from "../components/movie-card";
import { render, Position, unrender, DATA_CHANGE } from "../utils";
import MovieDetailsController from "./movie-details-controller";

export default class MovieController {
  constructor(movieData, commentsData, container, onDataChangeMain, onChangeView) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._container = container;
    this._mainContainer = document.body;
    this._unrenderMovieDetails = this._unrenderMovieDetails.bind(this);
    this.onDataChangeMain = onDataChangeMain;
    this.onDataChange = this.onDataChange.bind(this);
    this._movie = new MovieCard(this._movieData, this.onDataChange);
    // this._movieDetails = new MovieDetailsController(this._movieData, this._commentsData, this._unrenderMovieDetails, this.onDataChange);
    this._renderMovieDetails = this._renderMovieDetails.bind(this);
  }

  init() {
    render(this._container, this._movie.getElement(), Position.BEFOREEND)
    this._onMovieClick()
  }

  _onMovieClick() {
    // this._movie.getElement().addEventListener(`click`, this._renderMovieDetails);
    this._movie.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, this._renderMovieDetails);
  }

  onDataChange(typeData, data) {
    this.onDataChangeMain(typeData, this._movieData.id, data, this);
  }

  _renderMovieDetails() {
    this._movieDetails = new MovieDetailsController(this._movieData, this._commentsData, this._unrenderMovieDetails, this.onDataChange);
    this._movieDetails.init(this._mainContainer);
  }

  _updateData(user_details) {
    this._movieData.user_details = user_details;
  }

  update(typeData, user_details) {
    this._updateData(user_details);
    this._movie.update(user_details);
    if(this._movieDetails) {
      this._movieDetails.update(typeData, user_details);
    }
  }

  _unrenderMovieDetails() {
    document.body.classList.remove(`hide-overflow`);
    this._movieDetails.unrender();
    this._movieDetails = null;
  }
}