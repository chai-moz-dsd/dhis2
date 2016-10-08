var _ = {
    each: require('lodash/each')
};

module.exports = {
    getOrganisations: function(ous) {
        var organisations = [];
        _.each(ous, function (ou) {
            organisations.push(ou.id);
        });

        return organisations;
    }
};
