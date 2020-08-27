import MovieCard from "../components/movie-card";
import {render, Position, TypeDataChange} from "../utils";
import MovieDetailsController from "./movie-details.js";

export default class MovieController {
  constructor(movieData, api, container, onDataChangeMain, onChangeView) {
    this._movieData = movieData;
    this._api = api;
    this._container = container;
    this._mainContainer = document.body;
    this._unrenderMovieDetails = this._unrenderMovieDetails.bind(this);
    this.onDataChangeMain = onDataChangeMain;
    this.onDataChange = this.onDataChange.bind(this);
    this._movie = new MovieCard(this._movieData, this.onDataChange);
    this._onMovieClick = this._onMovieClick.bind(this);
    this._onChangeView = onChangeView;
  }

  init() {
    render(this._container, this._movie.getElement(), Position.BEFOREEND);
    this._initMovieDetails();
  }

  setDefaultView() {
    if (this._movieDetails) {
      this._unrenderMovieDetails();
    }
  }

  update(props) {
    this._updateData(props);

    if (this._movieDetails) {
      this._movieDetails.update(props);
    }
    this._movie.update(props);
  }

  _initMovieDetails() {
    this._movie.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, this._onMovieClick);
  }

  _renderMovieDetails(commentsData) {
    document.body.classList.add(`hide-overflow`);
    this._movieDetails = new MovieDetailsController(this._movieData, commentsData, this._unrenderMovieDetails, this.onDataChange);
    this._movieDetails.init(this._mainContainer);
  }

  _updateData({typeData, value}) {
    if (typeData === TypeDataChange.REMOVE_COMMENT) {
      this._movieData.comments = value;
    } else if (typeData === TypeDataChange.CREATE_COMMENT) {
      this._movieData.comments = value.comments;
    } else if (typeData === TypeDataChange.USER_DETAILS || typeData === TypeDataChange.RATING) {
      this._movieData.user_details = value;
    }
  }

  _unrenderMovieDetails() {
    document.body.classList.remove(`hide-overflow`);
    this._movieDetails.unrender();
    this._movieDetails = null;
  }

  onDataChange({typeData, value}) {
    // в boardController
    this.onDataChangeMain({typeData, movieId: this._movieData.id, value});
  }

  onError(data) {
    this._movieDetails.onError(data);
  }

  _onMovieClick() {
    this._api.getComments(this._movieData.id)
      .then((data) => {
        this._onChangeView();
        this._renderMovieDetails(data);
      });
  }

}
