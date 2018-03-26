import AJAX from './_AJAX.js';

export default {
    /**
     * fetch experiment results
     * @param experimentId
     * @param callback
     */
    fetch(experimentId, callback) {
        AJAX.get(API_URL_FETCH_EXPERIMENT + experimentId, callback);
    }
}