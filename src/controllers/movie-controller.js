import MovieCard from "../components/movie-card";
import { render, Position, unrender } from "../utils";
import MovieDetails from "../components/movie-detail/movie-details";

export default class MovieController {
  constructor(movieData, commentsData, container, onDataChange, onChangeView) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._container = container;
    this._mainContainer = document.body;
    this._movie = new MovieCard(this._movieData);
    this._unrenderMovieDetails = this._unrenderMovieDetails.bind(this);
    this._movieDetails = new MovieDetails(this._movieData, this._commentsData, this._unrenderMovieDetails);
    this._renderMovieDetails = this._renderMovieDetails.bind(this);
  }

  init() {
    render(this._container, this._movie.getElement(), Position.BEFOREEND)
    this._onMovieClick()
  }

  _onMovieClick() {
    this._movie.getElement().addEventListener(`click`, this._renderMovieDetails)
  }

  _renderMovieDetails() {
    this._movieDetails.init(this._mainContainer)
  }

  _unrenderMovieDetails() {
    document.body.classList.remove(`hide-overflow`);
    unrender(this._movieDetails.getElement());
    this._movieDetails.removeElement();
  }
}
