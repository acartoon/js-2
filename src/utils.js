import moment from "moment";

export const USER_RATING_COUNT = 9;
export const ANIMATION_TIMEOUT = 600;

export const dateFormat = {
  NOW: `now`,
  MINUTE: `a minute ago`,
  HOURE: `a hour ago`,
  FEW_HOURS: `a few hours ago`,
};

export const typeDataChange = {
  USER_DETAILS: `userDetails`,
  CREATE_COMMENT: `create`,
  REMOVE_COMMENT: `remove`,
  ALREADY_WATCHED: `watched`,
  WATCHLIST: `watchlist`,
  FAVORITE: `favorite`,
};

export const stateStore = {
  INTINIAL: `intinial`,
  CHANGE: `change`,
};

export const typeDataStore = {
  ALL: `all`,
  MOVIE: `movie`,
  COMMENTS: `comments`,
};

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

export const rank = {
  NOTICE: `novice`,
  FAN: `fan`,
  BUFF: `movie buff`,
};

export const statsParam = {
  CHART_TYPE: `horizontalBar`,
  MIN_X_LIMIT: 0,
  LABEL_FONT_SIZE: 20,
  LABEL_COLOR: `#FFF`,
  LABEL_PADDING: 100,
  LABEL_OFFSET: 50,
  LABEL_ALIGNT: `left`,
  LABEL_ANCHOR: `start`,
  GENRE_COLOR: `#FBE44D`,
  BAR_HEIGHT: 50,
};


export const keyCode = {
  ESC: `Escape`,
  CONTROL: `Control`,
  ENTER: `Enter`,
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const windows = {
  MAIN: `main`,
  SEARCH: `search`,
  STATS: `stats`,
};

export const filterFlag = {
  reset: `reset`,
  save: `save`,
};

export const render = (container, element, place = `beforeend`) => {
  const places = {
    'afterbegin': container.prepend(element),
    'beforeend': container.append(element),
  };
  return places[place];
};


export const PopupBtnControl = {
  watchlist: {name: `watchlist`, label: `Add to watchlist`, dataType:  typeDataChange.WATCHLIST},
  watched: {name: `watched`, label: `Already watched`, dataType:  typeDataChange.ALREADY_WATCHED},
  favorite: {name: `favorite`, label: `Add to favorites`, dataType:  typeDataChange.FAVORITE},
};

// тут надо править
export const cardControls = {
  watchlist: {classBtn: `add-to-watchlist`, title: `Add to watchlist`, dataType: typeDataChange.WATCHLIST},
  already_watched: {classBtn: `mark-as-watched`, title: `Mark as watched`, dataType: typeDataChange.ALREADY_WATCHED},
  favorite: {classBtn: `favorite`, title: `Mark as favorite`, dataType: typeDataChange.FAVORITE},
};

export const emoji = {
  SMILE: `smile`,
  SLEPPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`,
};

// меню
export const filter = {
// export const FILTER_TYPE = {
  ALL: {title: `All movies`, anchor: `all`, active: true},
  WATCHLIST: {title: `Watchlist`, anchor: `watchlist`, active: false},
  HISTORY: {title: `History`, anchor: `history`, active: false},
  FAVORITES: {title: `Favorites`, anchor: `favorites`, active: false},
  STATS: {title: `Stats`, anchor: `stats`, active: false},
};

//главная страница
export const boardList = {
  ALL: {isExtra: false, title: `All movies. Upcoming`},
  TOP_RATED: {isExtra: true, title: `Top rated`},
  MOST_COMMENTED: {isExtra: true,  title: `Most commented`},
  NO_MOVIE: {isExtra: false,  title: `There are no movies in our database`},
  LOADING: {isExtra: false,  title: `Loading...`},
};

export const namesPeople = new Set([
  `Alfred Hitchcock`,
  `Stanley Kubrick`,
  `Steven Spielberg`,
  `Андрей Тарковский`,
  `Quentin Tarantino`,
  `Sigourney Weaver`,
  `John Hurt`,
  `Ian Holm`,
]);

export const getRandomInteger = (max, min = 1) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

export const getRandomElements = (arr, count, func) => new Array(count).fill(``).map(() => arr[func(0, arr.length - 1)]);

export function getRandomString(length) {
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  let result = ``;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getRandomTime = () => getRandomInteger(180, 65);

export const getDescriptionFilm = (description) => {
  const descriptionArray = getRandomElements(description.split(`. `), getRandomInteger(3, 1), getRandomInteger);
  return `${descriptionArray.join(`.`)}.`;
};

//возвращает отфильтрованный массив комментариев
export const getComments = (commentsId, commentsData) => {
  return commentsId.reduce((array, commentId) => {
    const comment = commentsData.filter((comment) => comment.id === commentId);
    return [...array, ...comment]
  }, [])
};

export function getRandomDate() {
  let randomYear = getRandomInteger(1930, 1990);
  let randomMonth = getRandomInteger(1, 12);
  let randomDate = getRandomInteger(1, 30);
  return new Date(randomYear, randomMonth, randomDate);
};

// количество фильтров согласно ключу
export const getCountFilms = (movieData, key) => {
  return movieData.reduce((total, movie) => (movie['user_details'][key] ? total + 1 : total), 0);
};

//возвращает список комментариев с привязкой к id фильма
export const generateComments = (movieData, getComment) => {
  return movieData.reduce((AllComments, movie) => {
    let movieComments = new Array(getRandomInteger(4)).fill(``).map(getComment);
    movieComments.forEach((comment) => {
      comment.idFilm = movie.id;
      AllComments.push(comment);
    });
    return AllComments;
  }, []);
};

export function renderElement(container, template, type = `beforeend`) {
  container.insertAdjacentHTML(type, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.lastChild;
};


export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const getMovie = (movieData, time) => {
  return movieData.filter((movie) => moment(movie.user_details.watching_date).isAfter(time));
};

export const durationMovie = (movieData) => {
  const duration = movieData.reduce((count, movie) => {
    return count + movie.film_info.runtime;
  }, 0);

  return {
    duration,
    h: Math.floor(duration / 60),
    m: duration % 60
  }
};

export const hideElement = (element) => {
  element.classList.add(`visually-hidden`)
}

export const showElement = (element) => {
  element.classList.remove(`visually-hidden`)
};


export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export const toJSON = (response) => {
  return response.json();
};

export const getRank = (movieLength, rank) => {
  return movieLength < 10 ? rank.NOTICE :
  movieLength > 20 ? rank.BUFF : rank.FAN;
};
