import {toJSON, checkStatus, Method} from "../utils";


export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovie() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then();
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then(toJSON)
      .then();
  }

  removeComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then();
  }

  createComment(id, comment) {
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }


  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(toJSON);
  }
}
