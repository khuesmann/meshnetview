import AJAX from './_AJAX.js';

export default {
  /**
   * fetch experiment data
   * @param id
   * @param callback
   */
  fetchData(id, callback) {
    AJAX.get(API_URL_FETCH_EXPERIMENT + id, callback);
  },

  /**
   * fetch all experiments
   * @param callback
   */
  fetchAll(callback) {
    AJAX.get(API_URL_FETCH_EXPERIMENTS, callback);
  }
}