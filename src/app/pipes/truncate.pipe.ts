import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  	name: 'truncate'
})

export class TruncatePipe implements PipeTransform {

	transform(value: any, limit = 15, end = '...'): any {
		// on rajoute une limite de mots + fin de chaîne
		// "aze aze aze aze aze aze" | truncate : 5 = si on veut 5 mots, sinon par défault 15
		let shortenedValue = ''; // shortened = raccourci
		if ( value )
		{
			let words = value.split(/\s+/); // regexp quand 1 ou plusieurs espaces
			if ( words.length > limit )
			{
				shortenedValue = words.slice(0, limit).join(' ') + end;
				// join(' ') permet de retourner une chaîne avec valeurs tableau séparées par espace
			}
			else
			{
				shortenedValue = value;
			}
		}
		return shortenedValue
	}
}
