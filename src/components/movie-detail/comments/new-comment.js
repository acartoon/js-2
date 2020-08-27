import AbstractComponent from '../../abstract-component.js';
import {Emoji, render, Position, ANIMATION_TIMEOUT} from '../../../utils.js';
import EmojiComponent from  './emoji.js';


export default class NewComment extends AbstractComponent {
  constructor(onTextareaInput, getEmotion, onEscKeyDown) {
    super();
    this._onEscKeyDown = onEscKeyDown;
    this._onTextareaInput = onTextareaInput;
    this._getEmotion = getEmotion;
    this._selectedEmotion = null;
    this._onWindowOnline = this._onWindowOnline.bind(this);
    this._onWindowOffline = this._onWindowOffline.bind(this);
    this._inputComment = this.getElement().querySelector(`.film-details__comment-input`);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
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
    window.removeEventListener(`online`, this._onWindowOnline);
    window.removeEventListener(`offline`, this._onWindowOffline);
  }

  removeError() {
    this._inputComment.style.border = null;
  }

  // отрисовка компонента
  init(container) {
    this._render();
    render(container, this.getElement());

    if (!this._isOnline()) {
      this._onWindowOffline();
    }
  }

  _render() {
    const container = this.getElement().querySelector(`.film-details__emoji-list`);
    Object.keys(Emoji).forEach((emojiItem) => {
      const emoji = new EmojiComponent(Emoji[emojiItem], this.onChangeEmotion.bind(this));
      render(container, emoji.getElement(), Position.BEFOREEND);
    });

    this._inputComment.addEventListener(`focus`, this._onFocus);
    this._inputComment.addEventListener(`blur`, this._onBlur);
  }

  _shake() {
    const img = this.getElement().querySelector(`.film-details__add-emoji-label`);
    img.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      img.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  _getImage() {
    const img = new Image(55, 55);
    img.src = `images/emoji/${this._selectedEmotion}.png`;
    img.alt = `${this._selectedEmotion}`;
    return img;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  // обработчики событий
  _onWindowOnline() {
    this._inputComment.disabled = false;
    window.addEventListener(`offline`, this._onWindowOffline);
  }

  _onWindowOffline() {
    this._inputComment.disabled = true;
    window.addEventListener(`online`, this._onWindowOnline);
  }

  _onFocus() {
    this._onTextareaInput();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onBlur() {
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._inputComment.removeEventListener(`focus`, this._onFocus);
  }

  onChangeEmotion(emotion) {
    this._selectedEmotion = emotion;
    const container = this.getElement().querySelector(`.film-details__add-emoji-label`);
    container.innerHTML = ``;
    render(container, this._getImage());
  }
}
