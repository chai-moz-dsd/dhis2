/**
 * Created by wbwang on 17/04/2017.
 */

function dayPicker(days) {
    $("#days").multiPicker({ selector : "li" ,
        prePopulate: days.split(', ')
            .map(day => day.toLowerCase().replace(/(\w)/, v => v.toUpperCase())),
        valueSource: "data-day"
    });
}

function timePicker(alertTime) {
    $("#alertTime").multiPicker({ selector : "li" ,
        valueSource: "data-time",
        prePopulate: alertTime,
        isSingle: true});
}

function showMessage(detail) {
    if (detail != "") {
        setHeaderDelayMessage(detail);
    }
}
