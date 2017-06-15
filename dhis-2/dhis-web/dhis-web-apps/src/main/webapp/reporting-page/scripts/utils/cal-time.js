export function getTimeFormat(time) {
    if(time === null){
        let date = new Date();
        let day = date.getDay() + 1;

        time = new Date(moment().subtract((day), 'days').valueOf());
    }

    time.setDate(time.getDate());
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    let day = time.getDate();

    return `${year}-${month}-${day}`;
}