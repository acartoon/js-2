import MovieContainer from "../components/movie-container";
import { render, Position, HOME_PAGE_TITLES } from "../utils";
import MovieList from "../components/movie-list";
import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";


export default class HomePageController {
  constructor(container, movieData, commentsData) {
    this._mainContainer= container;
    this._movieData = movieData;
    this._commentsData = commentsData;
    this._container = new MovieContainer();
    this._MAIN_COUNT_MOVIE = 5;
    this._EXTRA_COUNT_MOVIE = 2;
    this._btnShowMore = new BtnShowMore();
  }

  init() {

    const BOARDS_LIST = {
      'all': {
        movieData: this._movieData.slice(0, this._MAIN_COUNT_MOVIE),
        isExtra: false,
        title: HOME_PAGE_TITLES.main,
      },
      'topRated': {
        movieData: this._getTopRatedMovie(this._movieData),
        isExtra: true,
        title: HOME_PAGE_TITLES.Top_rated,
      },
      'mostCommented': {
        movieData: this._getMostCommentedMovie(this._movieData),
        isExtra: true,
        title: HOME_PAGE_TITLES.most_commented,
      },
    }
    render(this._mainContainer, this._container.getElement(), Position.BEFOREEND);

    // Object.keys(BOARDS_LIST).forEach((board) => {
    //   this._renderBoard(BOARDS_LIST[board]);
    // });

    this._allBoard = this._renderBoard(BOARDS_LIST.all);
    this._topRated = this._renderBoard(BOARDS_LIST.topRated);
    this._mostCommented = this._renderBoard(BOARDS_LIST.mostCommented);

    // render(this._allBoard, this._btnShowMore.getElement())
  };

  _renderBoard({movieData, isExtra, title}) {
    const board = new MovieBoard(this._container.getElement(), movieData, this._commentsData, isExtra, title);
    board.init();
    return board;
  };

  _getTopRatedMovie(movieData) {
    const topRatedMovie = movieData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating);
     return topRatedMovie.slice(0, this._EXTRA_COUNT_MOVIE)
  }

  _getMostCommentedMovie(movieData) {
    const mostCommentedMovie =  movieData.slice().sort((a, b) => b.comments.length - a.comments.length);
     return mostCommentedMovie.slice(0, this._EXTRA_COUNT_MOVIE);
  }
}
