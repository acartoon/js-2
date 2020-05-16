import MovieCard from "../components/movie-card";
import { render, Position, DATA_CHANGE_USER_DETAILS, DATA_CHANGE_COMMENTS, RATING} from "../utils";
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
    console.log(this._commentsData)
    this._movieDetails = new MovieDetailsController(this._movieData, this._commentsData, this._unrenderMovieDetails, this.onDataChange);
    this._movieDetails.init(this._mainContainer);
  }

  _updateData(typeData, data) {
    if(typeData === DATA_CHANGE_COMMENTS) {
      this._movieData.comments = data.DATA_CHANGE_USER_DETAILS;
      this._commentsData = data.DATA_CHANGE_COMMENTS;
    } else if (typeData === DATA_CHANGE_USER_DETAILS || typeData === RATING) {
      this._movieData.user_details = data;
    }
  }

  update(typeData, data) {
    this._updateData(typeData, data);
    console.log(typeData)

    if(typeData === DATA_CHANGE_USER_DETAILS || typeData === RATING) {
      this._movie.update(typeData, this._movieData.user_details);
    } else if (typeData === DATA_CHANGE_COMMENTS) {
      this._movie.update(typeData, this._movieData.comments);
    }
    if(this._movieDetails) {
      this._movieDetails.update(typeData, data);
    }
  }

  _unrenderMovieDetails() {
    document.body.classList.remove(`hide-overflow`);
    this._movieDetails.unrender();
    this._movieDetails = null;
  }
}
