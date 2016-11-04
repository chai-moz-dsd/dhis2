var _ = {
    each: require('lodash/each'),
    sort: require('lodash/sortBy')
};

var getRow = function (rows, head, ouId) {
    var row = {};
    var values = [];
    _.each(head, function (disease) {
        var id = disease.id;
        var hasValue = false;
        _.each(rows, function (row) {
            if (row[0] === id && row[1] === ouId) {
                hasValue = true;
                values.push({value: row[2].replace('.0', ''), highlight: row[3].indexOf('true') != -1});
            }
        });

        if (!hasValue) {
            values.push({value: '-', highlight: false});
        }
    });

    row['id'] = ouId;
    row['values'] = values;

    return row;
};

module.exports = {
    getRows: function (data, head, forEachBy = 'ou') {
        var names = data.metaData.names;

        var res = [];
        _.each(data.metaData[forEachBy], function (item) {
            var row = getRow(data.rows, head, item);
            row['name'] = names[item];

            res.push(row);
        });

        res = _.sort(res, [function(o) { return o.name; }]);

        return res;
    },

    appendChildren: function (rows, id, children) {
        _.each(rows, function (row) {
            if (row['id'] === id) {
                row['children'] = children;
            } else {
                if (row['children']) {
                    this.appendChildren(row['children'], id, children);
                }
            }
        }.bind(this));

        return rows;
    },

    hasChildren: function (rows, id) {
        for (let row of rows) {
            var children = row['children'];

            if (row['id'] === id) {
                return children != undefined;
            } else {
                if (children) {
                    var res = this.hasChildren(children, id);
                    if (res != undefined) {
                        return res;
                    }
                }
            }
        }
    },

  generateRows: function (item, childrenList, result) {
      var rows = childrenList.map((children) => {
          return {
              name: children.displayName,
              id: children.id,
              level: (item.level + 1),
              value: result[children.displayName]
          };
      });
      item.showChildren = true;

      item.children = _.sort(rows, [function(o) { return o.name; }]);

      _.each(item.children, function (row) {
          console.log("row: " + row.name);
      });

    //this.forceUpdate();
  }
};
