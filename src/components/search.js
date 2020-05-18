import AbstractComponent from './abstract-component.js';

export default class Search extends AbstractComponent {
  constructor(searchInput, searchReset, btnResetClick) {
    super();
    this._searchInput = searchInput;
    this._searchReset = searchReset;
    this._onBtnResetClick = btnResetClick;
    this.reset = this.reset.bind(this);
    this._input = this.getElement().querySelector(`.search__field`);
    this._init();
  }

  _init() {
    //при трех и более инициализация поиска
    this._input.addEventListener(`input`, (e) => this._onSearchInput(e));
    //закрытие поиска при нажатии на кнопку
    this.getElement().querySelector(`.search__reset`).addEventListener(`click`, this._onBtnResetClick);
  };

  _onSearchInput(e) {
    const searchData = e.target.value;
    console.log(searchData)
    // при 2 и менее значения удаление поиска
    this._searchInput(searchData, this.reset);
  }

  // добавление обработчика удаления поиска
  reset() {
    this._input.addEventListener(`input`, (e) => {
      this._searchReset(e.target.value);
    });
  };

  _onReset(e) {
    const searchData = e.target.value;
    this._resetSearch(searchData);
  }

  getTemplate() {
    return `<form class="header__search search">
    <input type="text" name="search" class="search__field" placeholder="Search movies">
    <svg fill="#7171D8" class="search__film-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
      <path fill-rule="nonzero" d="M2 0v4.524h2.833V0h11.334v4.524H19V0h1v19h-1v-4.524h-2.833V19H4.833v-4.524H2V19H0V0h2zm0 7.238v4.524h2.833V7.238H2zm14.167 0v4.524H19V7.238h-2.833z"/>
    </svg>
    <button type="submit" class="visually-hidden">Search</button>
    <button class="search__reset" type="reset">Reset</button>
  </form>`;
  }
}
