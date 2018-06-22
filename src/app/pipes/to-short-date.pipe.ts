import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  	name: 'toShortDate'
})
export class ToShortDatePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		console.log(value);
		if ( value.toLowerCase() === 'asap' )
		{
			return 'dès que possible';
		} 
		else if ( value.indexOf('-') > -1 ) // comporte des tirets
		{
			// astuce ECMAscript 6 : déclare d'abord variables
			// [let1, let2] = .split('|') => let1 contient la gauche du |
			// let2 contient le reste 
			let fullDate, rest;
			[fullDate, rest] = value.toLowerCase().split('t'); // '2017-06-01T10:23:30Z'

			let year, month, date;
			[year, month, date] = fullDate.split('-'); // ['2017', '06', '01']
			// year = '2017', month = '06', date = '01'

			return `${date}/${month}/${year}`;
		}
		else
		{
			return '--';
		}
	}
}
