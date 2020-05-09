import AbstractComponent from '../abstract-component.js';

export default class EmojiInput extends AbstractComponent {
  constructor(emotion) {
    super();
    this._emotion = emotion;
  }

  getTemplate() {
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" 
    type="radio" id="${this._emotion}" value="${this._emotion}">`;
  }
}
