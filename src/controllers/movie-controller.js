import MovieCard from "../components/movie-card";
import { render, Position, DATA_CHANGE_USER_DETAILS, DATA_CHANGE_COMMENTS, RATING, REMOVE_COMMENT, CREATE_COMMENT} from "../utils";
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

  onError(data) {
    console.log(data)
    console.log(this._movieDetails)
    this._movieDetails.onError(data);
  }

  _initMovieDetails() {
    this._movie.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, this._onMovieClick);
  }


  onDataChange({typeDataChange, value}) {
    this.onDataChangeMain({typeDataChange: typeDataChange, movieId: this._movieData.id, value: value});
  }

  _onMovieClick() {
    this._api.getComments(this._movieData.id)
      .then((data) => {
        this._onChangeView();
        this._renderMovieDetails(data);
      });
  }

  _renderMovieDetails(commentsData) {
    document.body.classList.add(`hide-overflow`);
    this._movieDetails = new MovieDetailsController(this._movieData, commentsData, this._unrenderMovieDetails, this.onDataChange);
    this._movieDetails.init(this._mainContainer);
  }

  _updateData({typeDataChange, value}) {
    if(typeDataChange === REMOVE_COMMENT) {
      this._movieData.comments = value;
    } else if (typeDataChange === CREATE_COMMENT) {
      this._movieData.comments = value.comments;
    } else if (typeDataChange === DATA_CHANGE_USER_DETAILS || typeDataChange === RATING) {
      this._movieData.user_details = value;
    }
  }

  update({typeDataChange, value}) {
    this._updateData({typeDataChange, value});

    if(typeDataChange !== RATING) {
      this._movie.update({typeDataChange, value});
    }
    if(this._movieDetails) {
      this._movieDetails.update({typeDataChange, value});
    }
  }

  _unrenderMovieDetails() {
    document.body.classList.remove(`hide-overflow`);
    this._movieDetails.unrender();
    this._movieDetails = null;
  }

  setDefaultView() {
    if (this._movieDetails) {
      this._unrenderMovieDetails();
    }
  }
}
