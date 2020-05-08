import AbstractComponent from './abstract-component.js';

export default class MovieBaseComponent extends AbstractComponent {
  constructor({id, comments, film_info, user_details}, commentsData) {
    super();
    this._id = id;
    this._commentsData = commentsData;
    this._comments = comments;
    this._title = film_info.title;
    this._alternative_title = film_info.alternative_title;
    this._total_rating = film_info.total_rating;
    this._poster = film_info.poster;
    this._age_rating = film_info.age_rating;
    this._director = film_info.director;
    this._writers = film_info.writers;
    this._actors = film_info.actors;
    this._releaseDate = film_info.release.date;
    this._release_country = film_info.release.release_country;
    this._runtime = film_info.runtime;
    this._genre = film_info.genre;
    this._description = film_info.description;
    this._user_details = user_details;
    this._element = null;
  }
}
