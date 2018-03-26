import AJAX from './_AJAX';

export default {
  /**
   * ger persisted config
   * @param experimentId
   * @param callback
   */
  get(experimentId, callback) {
    AJAX.get(API_URL_FETCH_CONFIG + experimentId, callback);
  },
  /**
   * store persisted config
   * @param experimentId
   * @param value
   * @param callback
   */
  set(experimentId, value, callback) {
    AJAX.set(API_URL_SAVE_CONFIG + experimentId, value, callback);
  }
}