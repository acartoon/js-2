import CommentsController from "../controllers/comments-controller";
import { CHANGE_STATES } from "../utils";

export default class  Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  objectToArray(object) {
    return Object.keys(object).map((id) => object[id]);
  };

  getMovie() {
    if (this._isOnline()) {
      return this._api.getMovie()
      .then((movieData) => {
        movieData.map((movie) => {
          this._store.setItem({key: movie.id, item: {movie: movie, state: CHANGE_STATES.INTINIAL}, dataType: `movie`})
          this.getComment(movie);
      });
        return Promise.resolve(movieData);
      });
    } else {
      const rawMovieMap = this._store.getAll();
      const rawMovie = this.objectToArray(rawTasksMap);
      return Promise.resolve(rawMovie);
    }
  }


  updateMovie(id, data) {
    return this._api.updateMovie(id, data)
    .then((movieData) => {
      this._store.setItem({key: movieData.id, item: movieData, dataType: `movie`});
      console.log(movieData)
      return movieData;
    });
  }


  createComment(id, array) {
    return this._api.createComment(id, array).
    then(({movie, comments}) => {
      this._store.setItem({key: movie.id, item: {movie: movie, comments: comments, state: CHANGE_STATES.CHANGE}, dataType: `all`})
      return Promise.resolve({movie, comments});
    });
  }

  removeComment(id, movie) {
    console.log(movie)
    return this._api.removeComment(id)
      .then(() => {
        return this.updateMovie(movie.id, movie)
          .then((data) => {
            console.log(data)
            return this._api.getComments(data.id)
            .then((comments) => {
              this._store.setItem({key: data.id, item: {movie: data, comments: comments, state: CHANGE_STATES.CHANGE}, dataType: `all`});
              return Promise.resolve({movie: data, comments})
            });
          });
      });
  }


  getComment(movie) {
    return this._api.getComments(movie.id)
    .then((comments) => {
      this._store.setItem({key: movie.id, item: {comments: comments, state: CHANGE_STATES.INTINIAL}, dataType: `comments`});
    });
  }
  // getComment(movie) {
  //   this._api.getComments(movie.id)
  //   .then((comments) => {
  //     this._getStore(movie, comments)
  //   });
  // }

  _getStore(movie, comments) {
    this._store.setItem({key: movie.id, item: {movie: movie, comments: comments, state: CHANGE_STATES.INTINIAL}, dataType: `all`})
  }

  getComments(id) {
    if (this._isOnline()) {
      return this._api.getComments(id)
      .then((comments) => {
        this._store.setItem({key: id, item: comments, dataType: `comments`})
        return Promise.resolve(comments);
      });
    } else {
      const movieData = this._store.getItem({key: id});
      return Promise.resolve(movieData.comments);
    }
  }


  _isOnline() {
    return window.navigator.onLine;
  }
};
