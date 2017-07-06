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

  getAlertLog: function (location, startDay, endDay) {
    let protocol = window.location.protocol;
    let hostname = window.location.hostname;
    let ou = 'location=' + location;
    let st = 'startDay=' + startDay;
    let ed = 'endDay=' + endDay;
    return protocol + '//' + hostname + ':50000' + '/api/data_alertlog?' + ou + '&' + st + '&' + ed;
  }
};
