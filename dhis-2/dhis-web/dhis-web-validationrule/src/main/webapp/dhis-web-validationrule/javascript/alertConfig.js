/**
 * Created by wbwang on 17/04/2017.
 */

function dayPicker(days) {
    $("#days").multiPicker({ selector : "li" ,
        prePopulate: days.split(', ')
            .map(day => day.toLowerCase().replace(/(\w)/, v => v.toUpperCase())),
        valueSource: "text"
    });
}

function timePicker(alertTime) {
    $("#timeMul").multiPicker({ selector : "radio" ,
        valueSource: "data-value",
        prePopulate: alertTime,
        isSingle: true});
}
