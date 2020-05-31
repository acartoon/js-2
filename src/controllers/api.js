import { toJSON, checkStatus, Method } from "../utils";


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
    console.log(id)
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
      // .then();
  }

  updateMovie(id, data) {
    console.log(data)
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then();
  }

  // deleteTask({id}) {
  //   return this._load({url: `tasks/${id}`, method: Method.DELETE});
  // }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }


  // _send({url, method = Method.GET, body = null, headers = new Headers()}) {
  //   headers.append(`Authorization`, this._authorization);

  //   return fetch(`${this._endPoint}/${url}`, {method, body, headers})
  //     .then(checkStatus)
  //     .catch((err) => {
  //       throw err;
  //     });
  // }
};
