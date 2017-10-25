module.exports = {
  getConfig: function () {
    return {};
  },

  getBaseUrl: function () {
    let protocol = window.location.protocol;
    let hostname = window.location.hostname;
    let port = window.location.port;
    return protocol + '//' + hostname + ':' + port + '/api/';
  },

  getDSDBaseUrl: function () {
    let protocol = window.location.protocol;
    let hostname = window.location.hostname;
    return protocol + '//' + hostname + ':50000/api/';
  },

  getIdUrl: function () {
    return this.getBaseUrl() + 'dataElements';
  },

  getHeadUrl: function () {
    return this.getBaseUrl() + 'dataElementOperands';
  },

  getChildrenUrl: function (ouId) {
    return this.getBaseUrl() + '24/organisationUnits/' + ouId + '?paging=false&fields=children';
  },

  getRelatedOuList: function () {
    return this.getBaseUrl() + 'me?fields=organisationUnits'
  },

  getOuLevel: function (ou) {
    return this.getBaseUrl() + 'organisationUnits/' + ou + '?fields=level'
  },

  getLocationMapping: function () {
    return this.getBaseUrl() + 'organisationUnits?paging=false'
  },

  getSubmission: function (location, startDay, endDay, index) {
    let ou = 'location=' + location;
    let st = 'startDay=' + startDay;
    let ed = 'endDay=' + endDay;
    let page_index = 'page_index=' + index;
    return this.getDSDBaseUrl() + 'data_submission?' + ou + '&' + st + '&' + ed +'&' + page_index;
  },

  getSubmissionNumber: function (location, startDay, endDay) {
    let ou = 'location=' + location;
    let st = 'startDay=' + startDay;
    let ed = 'endDay=' + endDay;
    return this.getDSDBaseUrl() + 'data_submission?' + ou + '&' + st + '&' + ed;
  },

  getSubmissionExcel: function (location, startDay, endDay) {
    let ou = 'location=' + location;
    let st = 'startDay=' + startDay;
    let ed = 'endDay=' + endDay;
    return this.getDSDBaseUrl() + 'data_excel?' + ou + '&' + st + '&' + ed;
  }
};
