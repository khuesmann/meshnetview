export default {
  /**
   * send get request and perform callback
   * @param url
   * @param callback
   */
  get: (url, callback) => {
    $.ajax({
      url: url,
      dataType: "json",
      method: 'get',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      beforeSend(request) {
        request.setRequestHeader('Authorization', 'Basic ' + btoa('comsys:miot'))
      },
      success: response => {
        if(callback) callback(response);
      }
    });
  },
  /**
   * send post request and perform callback
   * @param url
   * @param data
   * @param callback
   */
  set: (url, data, callback) => {
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/json");
    // request.setRequestHeader("Access-Control-Allow-Origin", '*');
    request.withCredentials = true;
    request.setRequestHeader("Authorization", 'Basic ' + btoa('comsys:miot'));
    request.send(JSON.stringify({persist: data}));
    request.onloadend = (response) => {
      if(callback) callback(response)
    };
  }
}