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
        console.log('dateRange', dateRange);
        var startDate = dateRange.startDate;
        var endDate = dateRange.endDate;
        console.log('startDate: ', startDate);
        console.log('endDate: ', endDate);
        if (startDate && endDate) {
            var tempDate = moment(startDate).startOf("week");
            var endPoint = moment(endDate).endOf("week");
            var weekRange = [];
            while (tempDate <= endPoint) {
                weekRange.push(generateWeek(tempDate));
                tempDate = tempDate.add(7, 'day')
            }
            console.log('weekRange', weekRange);
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
