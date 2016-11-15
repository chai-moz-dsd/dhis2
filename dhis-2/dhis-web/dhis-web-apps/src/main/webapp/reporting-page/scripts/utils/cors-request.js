var createCORSRequest = function (method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
};

module.exports = {
    sendCORSRequest: function(method, url, callback) {
        var xhr = createCORSRequest(method, url);
        if (!xhr) {
            throw new Error('CORS not supported');
        }

        xhr.onload = function () {
            callback(xhr.responseText);
        };

        xhr.withCredentials = false;

        xhr.send();
    }
};
