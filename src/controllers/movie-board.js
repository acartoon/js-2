import { render, Position, hideElement, getComments } from "../utils";
import MovieList from "../components/movie-list";
import MovieCard from "../components/movie-card";
import MovieController from "./movie-controller";


export default class MovieBoard {
  constructor({isExtra, title}, movieData, commentsData, container) {
    this._container = container;
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._isExtra = isExtra;
    this._title = title;
    this._movieListContainer = new MovieList(this._isExtra, this._title);
  }

  init() {
    this._renderContainer();
    this._renderMovie(this._movieData);
  }

  _renderContainer() {
    render(this._container, this._movieListContainer.getElement(), Position.BEFOREEND);
  }

  _renderMovie(movieData) {
    movieData.forEach((movie) => {
      const container = this._movieListContainer.getElement().querySelector('.films-list__container');
     const comments = getComments(movie.comments, this._commentsData);
     console.log(movie.comments)
     console.log(comments)
      const movieCard = new MovieController(movie, comments, container);
      movieCard.init();
    });
  }

  update(movieData) {
    this._movieListContainer.getElement().querySelector('.films-list__container').innerHTML = ``;
    this._movieData = movieData;
    this._renderMovie();
  }

  // hide() {
  //   hideElement(this._movieListContainer.getElement());
  // }
}
