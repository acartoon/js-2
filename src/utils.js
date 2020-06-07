import moment from "moment";

export const DATA_CHANGE_COMMENTS = `comments`;
export const CREATE_COMMENT = `create`;
export const REMOVE_COMMENT = `remove`;
export const DATA_CHANGE_USER_DETAILS = `user_details`;
export const RATING = `RATING`;
export const USER_RATING_COUNT = 9;


export const STATS_TYPE_FILTER = {
  all: `all`,
  today: `today`,
  week: `week`,
  month: `month`,
  year: `year`,

}

export const CHANGE_STATES = {
  INTINIAL: `intinial`,
  CHANGE: `change`
}

// export const TYPE_CHANGE_DATA = {
//   CREATE_COMMENT: `create`,
//   REMOVE_COMMENT: `remove`,
//   UPDATE_MOVIE: `remove`,
// }

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};



export const STATS_PARAMS = {
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
}


export const KEY_CODE = {
  ESC: `Escape`,
  CONTROL: `Control`,
  ENTER: `Enter`,
}

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const render = (container, element, place = `beforeend`) => {
  const places = {
    'afterbegin': container.prepend(element),
    'beforeend': container.append(element),
  };
  return places[place];
};

export const DATA_CHANGE_TYPE = {
  RATING: RATING,
  WATCHLIST: DATA_CHANGE_USER_DETAILS,
  FAVORITE: DATA_CHANGE_USER_DETAILS,
  ALREADY_WATCHED: DATA_CHANGE_USER_DETAILS,
  CREATE_COMMENT: CREATE_COMMENT,
  REMOVE_COMMENT: REMOVE_COMMENT,
}

export const DATA_CHANGE = {
  RATING: `RATING`,
  WATCHLIST: `WATCHLIST`,
  FAVORITE: `FAVORITE`,
  ALREADY_WATCHED: `ALREADY_WATCHED`,
  CREATE_COMMENT : `CREATE_COMMENT`,
  REMOVE_COMMENT : `REMOVE_COMMENT`,
}


export const MOVIE_DETAIL_BTN_CONTROLS = {
  WATCHLIST: {name: `watchlist`, label: `Add to watchlist`, dataType:  DATA_CHANGE.WATCHLIST},
  ALREADY_WATCHED: {name: `watched`, label: `Already watched`, dataType:  DATA_CHANGE.ALREADY_WATCHED},
  FAVORITE: {name: `favorite`, label: `Add to favorites`, dataType:  DATA_CHANGE.FAVORITE},
}

export const windows = {
  MAIN: `main`,
  SEARCH: `search`,
  STATS: `stats`,
}

export const filterFlag = {
  reset: `reset`,
  save: `save`,
}

export const EMOJIS = {
  SMILE: `smile`,
  SLEPPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`,
}

// меню
export const FILTER_TYPE = {
  ALL: {title: `All movies`, anchor: `all`, active: true},
  WATCHLIST: {title: `Watchlist`, anchor: `watchlist`, active: false},
  HISTORY: {title: `History`, anchor: `history`, active: false},
  FAVORITES: {title: `Favorites`, anchor: `favorites`, active: false},
  STATS: {title: `Stats`, anchor: `stats`, active: false},
}

//главная страница
export const BOARDS_LIST = {
  ALL: {isExtra: false, title: `All movies. Upcoming`},
  TOP_RATED: {isExtra: true, title: `Top rated`},
  MOST_COMMENTED: {isExtra: true,  title: `Most commented`},
}

export const BTN_CARD_CONTROLS = {
  watchlist: {classBtn: `add-to-watchlist`, title: `Add to watchlist`, dataType: DATA_CHANGE.WATCHLIST},
  already_watched: {classBtn: `mark-as-watched`, title: `Mark as watched`, dataType: DATA_CHANGE.ALREADY_WATCHED},
  favorite: {classBtn: `favorite`, title: `Mark as favorite`, dataType: DATA_CHANGE.FAVORITE},
}

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
}

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
}

export function getRandomDate() {
  let randomYear = getRandomInteger(1930, 1990);
  let randomMonth = getRandomInteger(1, 12);
  let randomDate = getRandomInteger(1, 30);
  return new Date(randomYear, randomMonth, randomDate);
}

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
}

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

export const Time = {
  'all-time': `all-time`,
  today : moment(),
  week : moment().subtract(7, 'days'),
  month : moment().subtract(1, 'month'),
  year: moment().subtract(1, 'year'),
}

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
}

export const hideElement = (element) => {
  element.classList.add(`visually-hidden`)
}

export const showElement = (element) => {
  element.classList.remove(`visually-hidden`)
}


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
