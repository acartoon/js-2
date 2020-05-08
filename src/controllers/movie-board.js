import { render, Position } from "../utils";
import MovieList from "../components/movie-list";
import MovieCard from "../components/movie-card";


export default class MovieBoard {
  constructor(container, movieData, commentsData, isExtra, title) {
    this._container= container;
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._isExtra = isExtra;
    this._title = title;
    this._movieListContainer = new MovieList(this._isExtra, this._title);
  }

  init() {
    render(this._container, this._movieListContainer.getElement(), Position.BEFOREEND);
    this._renderMovie();
  }

  _renderMovie() {
    this._movieData.forEach((movie) => {
      const movieCard = new MovieCard(movie);
      const container = this._movieListContainer.getElement().querySelector('.films-list__container');
      render(container, movieCard.getElement(), Position.BEFOREEND)
    });
  }

  update(movieData) {
    this._movieListContainer.getElement().querySelector('.films-list__container').innerHTML = ``;
    this._movieData = movieData;
    console.log('ха ха хах')
  }
}
