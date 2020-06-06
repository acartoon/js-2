import AbstractComponent from '../../abstract-component.js';
import {EMOJIS, render, Position, KEY_CODE} from '../../../utils.js';
import EmojiInput from './emoji-input.js';
import EmojiLabel from './emoji-label.js';

export default class NewComment extends AbstractComponent {
  constructor(onTextareaInput) {
    super();
    this._onTextareaInput = onTextareaInput;
    this._selectedEmotion = null;
    this._onWindowOnline = this._onWindowOnline.bind(this);
    this._onWindowOffline = this._onWindowOffline.bind(this);
    this._inputComment = this.getElement().querySelector(`.film-details__comment-input`);
  }

  init(container) {
    this._container = container;
    this._render();
    render(this._container, this.getElement());

   this._initListeners();
  }

  _initListeners() {
    window.addEventListener('online',  this._onWindowOnline);
    window.addEventListener('offline',  this._onWindowOffline);
  }

  removeListeners() {
    window.addEventListener('online',  this._onWindowOnline);
    window.addEventListener('offline',  this._onWindowOffline);
  }

  _onWindowOffline() {
    this._inputComment.disabled = true;
  }

  _onWindowOnline() {
    this._inputComment.disabled = false;
  }

  _render() {
    const container = this.getElement().querySelector(`.film-details__emoji-list`);
    Object.keys(EMOJIS).forEach((emoji) => {
      const emojiLabel = new EmojiLabel(EMOJIS[emoji], this.onChangeEmotion.bind(this));
      const emojiInput = new EmojiInput(EMOJIS[emoji]);
      render(container, emojiLabel.getElement(), Position.BEFOREEND);
      render(container, emojiInput.getElement(), Position.BEFOREEND);
    });
    this._onInput();
  }

  onChangeEmotion(emotion) {
    this._selectedEmotion = emotion;
    const container = this.getElement().querySelector(`.film-details__add-emoji-label`);
    container.innerHTML = `<img src="images/emoji/${this._selectedEmotion}.png" width="55" height="55" alt="${this._selectedEmotion}">`;
  }

  _onInput() {
    this._inputComment.addEventListener(`input`, (e) => {
      this._onTextareaInput(e, this._selectedEmotion);
    });
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
