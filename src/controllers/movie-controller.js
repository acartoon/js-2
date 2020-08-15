import MovieCard from "../components/movie-card";
import {render, Position, typeDataChange} from "../utils";
import MovieDetailsController from "./movie-details-controller";

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
    render(this._container, this._movie.getElement(), Position.BEFOREEND)
    this._initMovieDetails();
  }

  setDefaultView() {
    if (this._movieDetails) {
      this._unrenderMovieDetails();
    }
  }

  update({typeData, value}) {
    this._updateData({typeData, value});

    if(typeData !== typeDataChange.RATING) {
      this._movie.update({typeData, value});
    }
    if(this._movieDetails) {
      this._movieDetails.update({typeData, value});
    }
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
    if(typeData === typeDataChange.REMOVE_COMMENT) {
      this._movieData.comments = value;
    } else if (typeData === typeDataChange.CREATE_COMMENT) {
      this._movieData.comments = value.comments;
    } else if (typeData === typeDataChange.USER_DETAILS || typeData === typeDataChange.RATING) {
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
