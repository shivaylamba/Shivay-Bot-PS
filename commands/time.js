exports.commands = {
    time: function (arg, user, room, text) {
    var now = new Date();
    var correct = function (time) {
        return (time < 10 ? '0' : '') + time;
    }
    // Time variables
    var timezone = now.getTimezoneOffset() / 60;
    var year = now.getFullYear();
    var mm = now.getMonth() + 1;
    var theDay = now.getDay();
    var dd = now.getDate();
    var hour = now.getHours();
    var minutes = correct(now.getMinutes());
    var seconds = correct(now.getSeconds());
    // Translate the time variables to a readable date
    if (timezone !== 0) {
         // create a copy to fix +-timezone issues
        // FIXME: maybe make this not so sloppy???
        var _timezone = ('' + timezone);
        timezone = (timezone > 0 ? '-' : '+') + (isNaN(Number(_timezone.charAt(0))) ? _timezone.substr(1) : _timezone);
    } else {
        timezone = '+0';
    }
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var month = months[mm - 1]; // If we don't subtract here, it'll assume it's the next month. For example, if it's October, it'll say November.
    var season;
    switch (month) {
    case 'December': case 'January': case 'February':
        season = 'winter';
        break;
    case 'March': case 'April': case 'May':
        season = 'spring';
        break;
    case 'June': case 'July': case 'August':
        season = 'summer';
        break;
    case 'September': case 'October': case 'November':
        season = 'autumn';
        break;
    }
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var day = days[theDay];
    var _days = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteen', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first'];
    var ordinalDay = _days[dd - 1];
    var AMorPM = 'AM';
    switch (hour) {
    case 12:
        AMorPM = 'PM';
        break;
    case 24:
        AMorPM = 'AM';
        break;
    }
    if (hour > 12) {
        hour = hour - 12;
        AMorPM = 'PM';
    }
    hour = correct(hour);
    var today = hour + ':' + minutes + ':' + seconds + ' ' + AMorPM + ', ' + mm + '/' + dd + '/' + year + ', the ' + ordinalDay + ' of the ' + season + ' month of ' + month + ', ' + year + '.';
    return this.say(room,'The current time is ' + today + ' (' + day + ', GMT' + timezone + ')');
},
};