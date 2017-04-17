/**
 * Created by wbwang on 17/04/2017.
 */

function dayPicker() {
    $("#days").multiPicker({ selector : "li" ,
        prePopulate: [1, 3]});



    function showSelection() {
        console.log("i have touched");
        $("#days").multiPicker({selector: "li"})
            .multiPicker('get', function (value) {
                console.log(value);
            });
    }
}

function timePicker() {
    $("#times").multiPicker({ selector : "li" ,
        isSingle: true});
}
