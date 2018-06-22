import { Pipe, PipeTransform } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now'; // dans doc date-fns
import * as frLocale from 'date-fns/locale/fr';

@Pipe({
  	name: 'daysAgo'
})

export class DaysAgoPipe implements PipeTransform {

	transform(value: any, args?: any): any { // 06-01-2017 | daysAgo
		return distanceInWordsToNow(new Date(value), { locale: frLocale });
		// distanceInWordsToNow() méthode de date-fns 
	}
}
