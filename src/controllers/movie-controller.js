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
  }

  init() {
    render(this._container, this._movie.getElement(), Position.BEFOREEND)
    this._initMovieDetails();
  }

  _initMovieDetails() {
    this._movie.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, this._onMovieClick);
  }


  onDataChange(typeData, data) {
    this.onDataChangeMain(typeData, this._movieData.id, data, this);
  }

  _onMovieClick() {
    console.log(this._api.getComments)
    this._api.getComments(this._movieData.id)
      .then((data) => {
        this._renderMovieDetails(data);
      });
  }

  _renderMovieDetails(commentsData) {
    this._movieDetails = new MovieDetailsController(this._movieData, commentsData, this._unrenderMovieDetails, this.onDataChange);
    this._movieDetails.init(this._mainContainer);
  }

  _updateData(typeData, movieData, comments) {
    if(typeData === REMOVE_COMMENT) {
      this._movieData.comments = movieData;
    } else if (typeData === CREATE_COMMENT) {
      this._movieData.comments = movieData.comments;
    } else if (typeData === DATA_CHANGE_USER_DETAILS || typeData === RATING) {
      this._movieData.user_details = movieData;
    }
  }

  update(typeData, movieData, comments) {
    this._updateData(typeData, movieData, comments);

    if(typeData === DATA_CHANGE_USER_DETAILS) {
      this._movie.update(typeData, this._movieData.user_details);
    } else if (typeData === REMOVE_COMMENT || typeData === CREATE_COMMENT) {
      this._movie.update(typeData, this._movieData.comments);
    }
    if(this._movieDetails) {
      if(typeData === REMOVE_COMMENT) {
        this._api.getComments(this._movieData.id)
        .then((data) => {
          const movieData = [];
          movieData.movie = this._movieData;
          movieData.comments = data;
          this._movieDetails.update(typeData, movieData);
        });
        return;
      } else if(typeData === CREATE_COMMENT) {
        const movieData = [];
        movieData.movie = this._movieData;
        movieData.comments = comments;
        this._movieDetails.update(typeData, movieData);
      } else {
        this._movieDetails.update(typeData, this._movieData.user_details);
      }
    }
  }

  _unrenderMovieDetails() {
    document.body.classList.remove(`hide-overflow`);
    this._movieDetails.unrender();
    this._movieDetails = null;
  }
}
