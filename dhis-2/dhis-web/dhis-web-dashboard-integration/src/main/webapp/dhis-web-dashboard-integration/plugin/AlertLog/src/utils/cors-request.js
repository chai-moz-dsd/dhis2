let createCORSRequest = function (method, url) {
  let xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != 'undefined') {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
};

module.exports = {
  sendCORSRequest: function (method, url, callback) {
    let xhr = createCORSRequest(method, url);
    if (!xhr) {
      throw new Error('CORS not supported');
    }

    xhr.onload = function () {
      let response = ( xhr.status === 200 ? xhr.responseText : []);
      callback(response);
    };

    xhr.withCredentials = false;

    xhr.send();
  }
};
