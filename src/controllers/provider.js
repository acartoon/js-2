import CommentsController from "./comments-controller";

export default class  Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  objectToArray(object) {
    console.log(object)
    return Object.keys(object).map((id) => object[id]);
  };

  createComment(id, array) {
    return this._api.createComment(id, array).
    then(({movie, comments}) => {
      this._store.setItem({key: movie.id, item: {movie: movie, comments: comments}, dataType: `all`})
      return Promise.resolve({movie, comments});
    });
  }

  removeComment(id, array) {
    return this._api.removeComment(id).
    then(({movie, comments}) => {
      this._store.setItem({key: movie.id, item: {movie: movie, comments: comments}, dataType: `all`})
      return Promise.resolve({movie, comments});
    });
  }

  getMovie() {
    if (this._isOnline()) {
      return this._api.getMovie()
      .then((movieData) => {
        movieData.map((movie) => {
          this._api.getComments(movie.id)
          .then((comments) => {
            this._store.setItem({key: movie.id, item: {movie: movie, comments: comments}, dataType: `all`})
          });
      });
        return Promise.resolve(movieData);
      });
    } else {
      const rawMovieMap = this._store.getAll();
      const rawMovie = this.objectToArray(rawTasksMap);
      return Promise.resolve(rawMovie);
    }
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

  updateMovie(id, data) {
    return this._api.updateMovie(id, data)
    .then((movieData) => {
      this._store.setItem({key: movieData.id, item: movieData, dataType: `movie`});
      return movieData;
    });
  }

  _isOnline() {
    return window.navigator.onLine;
  }
};
