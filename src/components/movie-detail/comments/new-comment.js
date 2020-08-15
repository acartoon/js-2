import AbstractComponent from '../../abstract-component.js';
import {emoji, render, Position, ANIMATION_TIMEOUT} from '../../../utils.js';
import EmojiInput from './emoji-input.js';
import EmojiLabel from './emoji-label.js';

export default class NewComment extends AbstractComponent {
  constructor(onTextareaInput, getEmotion) {
    super();
    this._onTextareaInput = onTextareaInput;
    this._getEmotion = getEmotion;
    this._selectedEmotion = null;
    this._onWindowOnline = this._onWindowOnline.bind(this);
    this._onWindowOffline = this._onWindowOffline.bind(this);
    this._inputComment = this.getElement().querySelector(`.film-details__comment-input`);
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

  // очистить форму после добавления комментария
  clear() {
    this.getElement().querySelector(`img`).setAttribute(`src`, ``);
    this.getElement().querySelector(`img`).setAttribute(`alt`, ``);
    this._inputComment.value = ``;
  }

  // получить эмоцию при отправке комментария на сервер
  getEmotion() {
    return this._selectedEmotion;
  }

  showError() {
    this._shake();
    this._inputComment.style.border = `2px solid red`;
  }

  // удаление обработчиков при закрытии попапа
  removeListeners() {
    window.removeEventListener('online',  this._onWindowOnline);
    window.removeEventListener('offline',  this._onWindowOffline);
  }

  removeError() {
    this._inputComment.style.border = null;
  }

  // отрисовка компонента
  init(container) {
    this._container = container;
    this._render();
    render(this._container, this.getElement());

   if(!this._isOnline()) {
    this._onWindowOffline();
   }
  }

  _shake() {
    const img = this.getElement().querySelector(`.film-details__add-emoji-label`).firstChild;
    img.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`

    setTimeout(() => {
      img.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  _render() {
    const container = this.getElement().querySelector(`.film-details__emoji-list`);
    Object.keys(emoji).forEach((em) => {
      const emojiLabel = new EmojiLabel(emoji[em], this.onChangeEmotion.bind(this));
      const emojiInput = new EmojiInput(emoji[em]);
      render(container, emojiLabel.getElement(), Position.BEFOREEND);
      render(container, emojiInput.getElement(), Position.BEFOREEND);
    });
    this._onInput();
  }

  _getImage() {
    const img = new Image(55, 55);
    img.src = `images/emoji/${this._selectedEmotion}.png`;
    img.alt = `${this._selectedEmotion}`;
    console.log(img)
    return img;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  // обработчики событий

  _onWindowOnline() {
    this._inputComment.disabled = false;
    window.addEventListener('offline',  this._onWindowOffline);
  }

  _onWindowOffline() {
    this._inputComment.disabled = true;
    window.addEventListener('online',  this._onWindowOnline);
  }

  _onInput() {
    this._inputComment.addEventListener(`input`, (evt) => {
      this._onTextareaInput();
    });
  }

  onChangeEmotion(emotion) {
    this._selectedEmotion = emotion;
    const container = this.getElement().querySelector(`.film-details__add-emoji-label`);
    container.innerHTML = ``;
    render(container, this._getImage());
  }
}
