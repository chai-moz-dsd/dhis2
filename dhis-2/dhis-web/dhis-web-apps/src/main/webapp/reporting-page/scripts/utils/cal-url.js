var _ = {
    each: require('lodash/each'),
    trimEnd: require('lodash/trimEnd')
};

var getDimensionDx = function (oriHead) {
    var dimension = "dimension=dx:";
    _.each(oriHead, function (head) {
        dimension += head.id + ';';
    });

    return _.trimEnd(dimension, ';');
};

var getDimensionOu = function (ous) {
    var dimension = "dimension=ou:";
    _.each(ous, function (ou) {
        dimension += ou + ';';
    });

    return _.trimEnd(dimension, ';');
};

var getDimensionPe = function (weeks) {
    return "dimension=pe:" + weeks;
};

var getPeriod = function (period) {
    return "filter=pe:" + period;
};

module.exports = {
    getConfig: function() {
        return {
            headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}
        };
    },

    getBaseUrl: function () {
        var protocol = window.location.protocol;
        var hostname = window.location.hostname;
        var port = window.location.port;
        return protocol + '//' + hostname + ':' + port + '/api/';
    },

    getIdUrl: function() {
        return this.getBaseUrl() + 'dataElements';
    },

    getHeadUrl: function() {
        return this.getBaseUrl() + 'dataElementOperands';
    },

    getRowUrl: function (oriHead, ous, period) {
        var dx = getDimensionDx(oriHead);
        var ou = getDimensionOu(ous);
        var pe = getPeriod(period);

        return this.getBaseUrl() + 'analytics.json?' + dx + "&" + ou + "&" + pe;
    },

    getWeekRowUrl: function (oriHead, weeks, organisationUnits) {
        var dx = getDimensionDx(oriHead);
        var pe = getDimensionPe(weeks);
        var ou = 'filter=ou:' + organisationUnits;
        return this.getBaseUrl() + 'analytics.json?' + dx + "&" + ou + "&" + pe;
    },

    getChildrenUrl: function(ouId) {
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
    getIndicatorInfo: function(organisationUnits, startDate, endDate) {
        var protocol = window.location.protocol;
        var hostname = window.location.hostname;
        const ou = 'organisationUnits=' + organisationUnits;
        const st = 'startDate=' + startDate;
        const ed = 'endDate=' + endDate;
        return protocol + '//' + hostname + ':8080' + '/api/indicator?' + ou + '&' + st + '&' + ed;
    }
};
