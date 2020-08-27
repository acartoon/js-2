import {StateStore, TypeDataStore} from "../utils";

export default class  Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  objectToArray(object) {
    return Object.keys(object).map((id) => object[id][`movie`]);
  };

  getMovie() {
    if (this._isOnline()) {
      return this._api.getMovie()
      .then((movieData) => {
        movieData.map((movie) => {
          this._store.setItem({key: movie.id, item: movie, state: StateStore.INTINIAL, dataType: TypeDataStore.MOVIE})
          this.getComment(movie);
      });
        return Promise.resolve(movieData);
      })
      .catch((err) => {
        console.error(`Receiving data error:`, err);
        console.log(`Received data from the store`);

        const movieData = this._getMovieData();

        return movieData;
      });
    } else {
      const rawMovieMap = this._store.getAll();
      const rawMovie = this.objectToArray(rawMovieMap);
      return Promise.resolve(rawMovie);
    }
  }


  getComment(movie) {
    return this._api.getComments(movie.id)
    .then((comments) => {
      this._store.setItem({key: movie.id, item: comments, state: StateStore.INTINIAL, dataType: TypeDataStore.COMMENTS});
    });
  }


  updateMovie(id, movie) {
    if(this._isOnline()) {
      return this._api.updateMovie(id, movie)
      .then((movieData) => {
        this._store.setItem({key: movieData.id, item: movieData, state: StateStore.CHANGE, dataType: TypeDataStore.MOVIE});
        return Promise.resolve(movieData);
      });
    } else {
      this._store.setItem({key: data.id, item: data, state: StateStore.CHANGE, dataType: TypeDataStore.MOVIE});
      return Promise.resolve(data);
    }
  }

  // api.createComment возвращает массив фильм и список комментариев
  createComment(id, newComment) {
    return this._api.createComment(id, newComment)
    .then(({movie, comments}) => {
      this._store.setItem({key: movie.id, item: {movie: movie, comments: comments}, state: StateStore.CHANGE, dataType: TypeDataStore.ALL});
      return Promise.resolve({newMovie: movie, comments});
    });
  }

  // api.removeComment возвращает только статус 200
  removeComment(id, movie) {
    return this._api.removeComment(id)
      .then(() => {
        return this.updateMovie(movie.id, movie)
          .then((newMovie) => {
            return this._api.getComments(newMovie.id)
            .then((comments) => {
              this._store.setItem({key: newMovie.id, item: {movie: newMovie, comments: comments}, state: StateStore.CHANGE, dataType: TypeDataStore.ALL});
              return Promise.resolve({newMovie, comments})
            });
          });
      });
  }

  _getStore(movie, comments) {
    this._store.setItem({key: movie.id, item: {movie: movie, comments: comments}, state: StateStore.CHANGE, dataType: TypeDataStore.ALL})
  }

  getComments(id) {
    if (this._isOnline()) {
      return this._api.getComments(id)
      .then((comments) => {
        this._store.setItem({key: id, item: comments, dataType: TypeDataStore.COMMENTS})
        return Promise.resolve(comments);
      });
    } else {
      const movieData = this._store.getItem({key: id});
      return Promise.resolve(movieData.comments);
    }
  }

  sync() {
    const movieData = this._getMovieData();

    return this._api.sync(movieData);
  }

  _getMovieData() {
    const storeMovieData = this._store.getAll();
    return Object.keys(storeMovieData).map((key) => {
      return storeMovieData[key][`movie`]
    });
  }

  _isOnline() {
    return window.navigator.onLine;
  }
};
