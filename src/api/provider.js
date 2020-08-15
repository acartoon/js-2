import CommentsController from "../controllers/comments-controller";
import { stateStore, typeDataStore } from "../utils";

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
          this._store.setItem({key: movie.id, item: movie, state: stateStore.INTINIAL, dataType: typeDataStore.MOVIE})
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
      this._store.setItem({key: movie.id, item: comments, state: stateStore.INTINIAL, dataType: typeDataStore.COMMENTS});
    });
  }


  updateMovie(id, data) {
    if(this._isOnline()) {
      return this._api.updateMovie(id, data)
      .then((movieData) => {
        this._store.setItem({key: movieData.id, item: movieData, state: stateStore.CHANGE, dataType: typeDataStore.MOVIE});
        return Promise.resolve(movieData);
      });
    } else {
      this._store.setItem({key: data.id, item: data, state: stateStore.CHANGE, dataType: typeDataStore.MOVIE});
      return Promise.resolve(data);
    }
  }

  // api.createComment возвращает массив фильм и список комментариев
  createComment(id, array) {
    return this._api.createComment(id, array)
    .then(({movie, comments}) => {
      this._store.setItem({key: movie.id, item: {movie: movie, comments: comments}, state: stateStore.CHANGE, dataType: typeDataStore.ALL});
      return Promise.resolve({movie, comments});
    });
  }

  // api.removeComment возвращает только статус 200
  removeComment(id, movie) {
    return this._api.removeComment(id)
      .then(() => {
        return this.updateMovie(movie.id, movie)
          .then((data) => {
            return this._api.getComments(data.id)
            .then((comments) => {
              this._store.setItem({key: data.id, item: {movie: data, comments: comments}, state: stateStore.CHANGE, dataType: typeDataStore.ALL});
              return Promise.resolve({movie: data, comments})
            });
          });
      });
  }

  _getStore(movie, comments) {
    this._store.setItem({key: movie.id, item: {movie: movie, comments: comments}, state: stateStore.CHANGE, dataType: typeDataStore.ALL})
  }

  getComments(id) {
    if (this._isOnline()) {
      return this._api.getComments(id)
      .then((comments) => {
        this._store.setItem({key: id, item: comments, dataType: typeDataStore.COMMENTS})
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
