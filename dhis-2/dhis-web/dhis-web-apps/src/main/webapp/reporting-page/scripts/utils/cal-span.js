var _ = {
    each: require('lodash/each'),
    maxBy: require('lodash/maxBy'),
    merge: require('lodash/merge')
};

var getNameLength = function (o) {
    return o.name.split('_').length;
};

var groupByName = function (arr) {
    var hist = {};
    arr.map(function (o) {
        if (o in hist) {
            hist[o]['col'] = hist[o]['col'] + 2;
        } else {
            hist[o] = {col: 2};
        }
    });

    return hist;
};

module.exports = {
    calculateSpan: function (data) {
        if (data.length == 0) {
            return {};
        }

        var maxRow = getNameLength(_.maxBy(data, function (o) {
            return getNameLength(o)
        }));

        var rows = {};
        var arr = [];
        _.each(data, function (o) {
            var name = o['name'];
            var subNames = name.split('_');

            for (var i = 0, len = subNames.length; i < len; i++) {
                var key = subNames.slice(0, i + 1).join('_');
                arr.push(key);

                if (!rows[key]) {
                    if (i == (len - 1)) {
                        rows[key] = {row: maxRow - i, hasChildren: false}
                    } else {
                        rows[key] = {row: 1, hasChildren: true}
                    }
                }
            }
        });

        var cols = groupByName(arr);
        
        return _.merge(rows, cols);
    }
};
