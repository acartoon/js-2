import AbstractComponent from '../../abstract-component.js';
import {createDocumentFragment} from '../../../utils.js';

export default class EmojiComponent extends AbstractComponent {
  constructor(emotion, onChangeEmotion) {
    super();
    this._emotion = emotion;
    this._onChangeEmotion = onChangeEmotion;
    this._onClick();
  }

  getTemplate() {
    return `<label class="film-details__emoji-label" for="${this._emotion}">
      <img src="./images/emoji/${this._emotion}.png" width="30" height="30" alt="${this._emotion}">
      </label><input class="film-details__emoji-item visually-hidden" name="comment-emoji"
      type="radio" id="${this._emotion}" value="${this._emotion}">`;
  }

  getElement() {
    if (!this._element) {
      this._element = createDocumentFragment(this.getTemplate());
    }
    return this._element;
  }

  _onClick() {
    this.getElement().querySelector(`.film-details__emoji-label`).addEventListener(`click`, () => {
      this._onChangeEmotion(this._emotion);
    });
  }
}
