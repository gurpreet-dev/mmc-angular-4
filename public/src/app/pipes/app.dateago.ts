import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'dateago'
})
export class DateagoPipe implements PipeTransform {
   transform(value) {
    let /** @type {?} */ d = new Date(value);
    let /** @type {?} */ now = new Date();
    let /** @type {?} */ seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    
    let /** @type {?} */ minutes = Math.round(Math.abs(seconds / 60));
    let /** @type {?} */ hours = Math.round(Math.abs(minutes / 60));
    let /** @type {?} */ days = Math.round(Math.abs(hours / 24));
    let /** @type {?} */ months = Math.round(Math.abs(days / 30.416));
    let /** @type {?} */ years = Math.round(Math.abs(days / 365));
    if (Number.isNaN(seconds)) {
        return '';
    }
    else if (seconds <= 45) {
        return 'a few seconds ago';
    }
    else if (seconds <= 90) {
        return 'a minute ago';
    }
    else if (minutes <= 45) {
        return minutes + ' minutes ago';
    }
    else if (minutes <= 90) {
        return 'an hour ago';
    }
    else if (hours <= 22) {
        return hours + ' hours ago';
    }
    else if (hours <= 36) {
        return 'a day ago';
    }
    else if (days <= 25) {
        return days + ' days ago';
    }
    else if (days <= 45) {
        return 'a month ago';
    }
    else if (days <= 345) {
        return months + ' months ago';
    }
    else if (days <= 545) {
        return 'a year ago';
    }
    else {
        // (days > 545)
        return years + ' years ago';
    }
   }
}