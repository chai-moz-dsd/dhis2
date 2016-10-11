import moment from "moment";
moment.locale('moz');

var _ = {
    each: require('lodash/each')
};

function generateWeek(tempDate) {
    return tempDate.weekYear() + 'W' + tempDate.week()
}
module.exports = {
    getWeekRange: function (dateRange) {
        var startDate = dateRange.startDate;
        var endDate = dateRange.endDate;
        if (startDate && endDate) {
            var tempDate = moment(startDate);
            var endPoint = moment(endDate);
            var weekRange = [];
            while (tempDate <= endPoint) {
                weekRange.push(generateWeek(tempDate));
                tempDate = tempDate.add(7, 'day')
            }
            return weekRange;
        }
        else {
            return ['THIS_YEAR']
        }
    },
    generatePeriod: function (period) {
        return period.join(';')
    }
};
