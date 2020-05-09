import AbstractComponent from '../abstract-component.js';
import {emojis, render, Position} from '../../utils.js';
import EmojiInput from './emoji-input.js';
import EmojiLabel from './emoji-label.js';

export default class NewComment extends AbstractComponent {
  constructor(toAddComment) {
    super();
    this._toAddComment = toAddComment;
    this._init();
  }

  _init() {
    const container = this.getElement().querySelector(`.film-details__emoji-list`);
    emojis.forEach((i) => {
      const emojiLabel = new EmojiLabel(i, this.onChangeEmotion.bind(this));
      const emojiInput = new EmojiInput(i);
      render(container, emojiLabel.getElement(), Position.BEFOREEND);
      render(container, emojiInput.getElement(), Position.BEFOREEND);
    });
    this._onInput();
  }

  onChangeEmotion(emotion) {
    const container = this.getElement().querySelector(`.film-details__add-emoji-label`);
    container.innerHTML = `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="${emotion}">`;
  }

  _onInput() {
    const input = this.getElement().querySelector(`.film-details__comment-input`);
    input.addEventListener(`input`, this._onKeydown.bind(this));
  }

  _onKeydown() {
    document.addEventListener(`keydown`, this._toAddComment);
  }

  getTemplate() {
    return `<div class="film-details__new-comment">
    <div for="add-emoji" class="film-details__add-emoji-label"></div>
  
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>
  
    <div class="film-details__emoji-list">
      
    </div>
  </div>`;
  }
}
