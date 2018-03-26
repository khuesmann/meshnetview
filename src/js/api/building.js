import AJAX from './_AJAX.js';

export default {

  /**
   * fetch buildings
   * @param callback
   */
  fetch(callback) {
    AJAX.get(API_URL_FETCH_BUILDINGS, callback);
  }
}