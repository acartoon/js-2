import MovieContainer from "../components/movie-container";
import { render, Position, HOME_PAGE_TITLES, hideElement } from "../utils";
import MovieList from "../components/movie-list";
import MovieBoard from "./movie-board";
import BtnShowMore from "../components/btn-show-more";
import MovieBoardMore from "./movie-board-more";
import Sort from "../components/sort.js";

export default class HomePageController {
  constructor(container) {
    this._mainContainer = container;
    this._container = new MovieContainer();
    this._EXTRA_COUNT_MOVIE = 2;
    this._btnShowMore = new BtnShowMore();
    this._onSortBtnClick = this._onSortBtnClick.bind(this);
    this._sort = new Sort(this._onSortBtnClick);
  }

  init(movieData, commentsData) {
    this._movieData = movieData;
    this._commentsData = commentsData;
    const BOARDS_LIST = {
      'all': {
        movieData: this._movieData,
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
    this._renderSort(this._mainContainer);
    render(this._mainContainer, this._container.getElement(), Position.BEFOREEND);

    this._allBoard = new MovieBoardMore(BOARDS_LIST.all, this._commentsData, this._container.getElement());
    this._allBoard.init();

    this._topRated = this._renderBoard(BOARDS_LIST.topRated);
    this._topRated.init();

    this._mostCommented = this._renderBoard(BOARDS_LIST.mostCommented);
    this._mostCommented.init();
  };

  _renderSort(container) {
    console.log('seors')
    render(container, this._sort.getElement());
  }

  _renderBoard(parameters) {
    return new MovieBoard(parameters, this._commentsData, this._container.getElement());
    // board.init();
    // return board;
  };

  _getTopRatedMovie(movieData) {
    const topRatedMovie = movieData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating);
     return topRatedMovie.slice(0, this._EXTRA_COUNT_MOVIE)
  }

  _getMostCommentedMovie(movieData) {
    const mostCommentedMovie =  movieData.slice().sort((a, b) => b.comments.length - a.comments.length);
     return mostCommentedMovie.slice(0, this._EXTRA_COUNT_MOVIE);
  }

  _getSort(movieData) {
    console.log(movieData)
    this._allBoard.render(movieData);
  }

  _onSortBtnClick(sortType) {
    const movieDataToRender = {
      'date': this._movieData.slice().sort((a, b) => a.film_info.release.date - b.film_info.release.date),
      'rating': this._movieData.slice().sort((a, b) => b.film_info.total_rating - a.film_info.total_rating),
      'default': this._movieData,
      // 'comments': movieData.slice().sort((a, b) => b.comments.length - a.comments.length),
    };
    this._getSort(movieDataToRender[sortType]);
  }

  // hide() {
  //   hideElement(this._container.getElement());
  // }
  filter() {
    hideElement(this._container.getElement());
  }


}
