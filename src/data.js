import {
  getRandomElements,
  getDescriptionFilm,
  getRandomDate,
  getRandomInteger,
  getRandomTime,
  getCountFilms,
  generateComments,
  EMOJIS,
  getRandomString,
  namesPeople
} from './utils.js';

const MOVIE_LENGTH = 15;

const filmNames = new Set([
  `Здравствуйте, я Ваша тетя`,
  `Собака баскервилей`,
  `Some Like It Hot`,
  `Jurassic Park`,
  `Psycho`,
  `Rear Window`,
  `Dial M for Murder`,
  `The Thing`,
  `Мой ласковый и нежный зверь`,
  `Сталкер`,
  `Солярис`,
  `Alien`,
  `The Silence of the Lambs`,
  `The Shining`,
  `Ghostbusters`,
]);

const countries = new Set([`USA`, `Russia`, `UK`, `New Zealand`]);
const genres = new Set([`Horror`, `Comedy`, `Romance`, `Fantasy`, `Drama`, `Cartoon`]);
const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const posters = [`./images/posters/made-for-each-other.png`, `./images/posters/popeye-meets-sinbad.png`, `./images/posters/sagebrush-trail.jpg`, `./images/posters/santa-claus-conquers-the-martians.jpg`, `./images/posters/the-dance-of-life.jpg`, `./images/posters/the-great-flamarion.jpg`, `./images/posters/the-man-with-the-golden-arm.jpg`];
const movie = [];

const generateMovie = () => ({
    id: getRandomString(3),
    comments: [],
    film_info: {
      title: null,
      alternative_title: null,
      total_rating: getRandomInteger(10),
      poster: posters[getRandomInteger(6)],
      age_rating: getRandomInteger(21),
      director: Array.from(namesPeople)[getRandomInteger(4)],
      writers: getRandomElements(Array.from(namesPeople), getRandomInteger(4), getRandomInteger),
      actors: getRandomElements(Array.from(namesPeople), getRandomInteger(4), getRandomInteger),
      release: {
        date: getRandomDate(),
        release_country: Array.from(countries)[Math.floor(Math.random() * 4)],
      },
      runtime: getRandomTime(),
      genre: new Set(getRandomElements(Array.from(genres), getRandomInteger(4), getRandomInteger)),
      description: getDescriptionFilm(description),
    },
    user_details: {
      personal_rating: getRandomInteger(9),
      watchlist: Boolean(Math.round(Math.random())),
      already_watched: Boolean(Math.round(Math.random())),
      watching_date: getRandomDate(),
      favorite: Boolean(Math.round(Math.random())),
    }
});

const creareRandomEmojis = () => {
  const em = Object.keys(EMOJIS);
  const value = em[getRandomInteger(0, em.length)];
  return EMOJIS[value];
};

const getComment = () => ({
  id: getRandomString(3),
  comment: getDescriptionFilm(description),
  author: Array.from(namesPeople)[getRandomInteger(Array.from(namesPeople).length-1)],
  date: getRandomInteger(10, 2),
  emotion: creareRandomEmojis(),
  // emotion: emojis[getRandomInteger(0, 3)],
});


for(let i = 0; i < MOVIE_LENGTH; i++ ) {
  movie.push(generateMovie());
  movie[i].film_info.title = Array.from(filmNames)[i];
  movie[i].film_info.alternative_title = Array.from(filmNames)[i];
  // movie[i] = {...movie[i], name: Array.from(filmNames)[i], originalName: Array.from(filmNames)[i]};
}
const comments = generateComments(movie, getComment);

comments.forEach((comment) => {
  for(let i = 0; i < MOVIE_LENGTH; i++ ) {
    if (comment.idFilm === movie[i].id) {
      movie[i].comments.push(comment.id);
    }
  }
  delete comment.idFilm;
});

export {movie, comments};
