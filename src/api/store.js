import { typeDataStore } from "../utils";

export default class Store {
  constructor({key, storage}) {
    this._storeKey = key;
    this._storage = storage;
  }

  setItem({key, item, state, dataType}) {
    const items = this.getAll();
    if(!items[key]) {
      items[key] = {}
    }
    items[key][`state`] = state;
    switch(dataType) {
      case typeDataStore.ALL:
        items[key] = item;
        break;
      case typeDataStore.MOVIE:
        items[key]['movie'] = item;
        break;
      case typeDataStore.COMMENTS:
        items[key]['comments'] = item;
        break;
    }
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  // removeItem({key}) {
  //   const items = this.getAll();
  //   delete items[key];

  //   this._storage.setItem(this._storeKey, JSON.stringify(items));
  // }

  getItem({key}) {
    const items = this.getAll();
    return items[key];
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      console.error(`Error parse items. Error: ${e}. Items: ${items}`);
      return emptyItems;
    }
  }
};
