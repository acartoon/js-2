import AbstractComponent from '../abstract-component.js';

export default class EmojiLabel extends AbstractComponent {
  constructor(emotion, onChangeEmotion) {
    super();
    this._emotion = emotion;
    this._onChangeEmotion = onChangeEmotion;
    this._onClick();
  }

  getTemplate() {
    return `<label class="film-details__emoji-label" for="${this._emotion}">
        <img src="./images/emoji/${this._emotion}.png" width="30" height="30" alt="${this._emotion}">
      </label>`;
  }

  _onClick() {
    this.getElement().addEventListener(`click`, () => {
      this._onChangeEmotion(this._emotion);
    });
  }
}
