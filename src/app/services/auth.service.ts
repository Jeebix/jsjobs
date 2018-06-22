import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import * as jwtDecode from 'jwt-decode'; // import décodage token

@Injectable()

export class AuthService {

	BASE_URL = 'http://localhost:4201/auth';
	
	constructor(private http: Http) { }

	// connexion utilisateur
	login(credentials) {
		return this.http.post(`${this.BASE_URL}/login`, credentials)
						.map(res => res.json());
	}

	// savoir si utilisateur connecté
	userIsLoggedIn() {
		return !!localStorage.getItem('jbb-data');
		// si token 'jbb-data' retourne true, sinon false (!! caste le type en booléen)
	}

	// déconnexion
	logOut() {
		localStorage.removeItem('jbb-data');
	}

	// enregistrement
	register(credentials) {
		// console.log('register ', credentials);
		// observable retourné (toujours avec post, get, ...)
		return this.http.post(`${this.BASE_URL}/register`, credentials)
				 .map(res => res.json());
	}

	// méthode qui rajoute le header d'authorisation
	// 'Authorization': 'Bearer token'
	// on rajoute le token en paramètre pour montrer qu'il y a une dépendance
	// (on aurait pu le récupérer dans la fonction directement)
	addAuthorizationHeader(token) {
		// penser à importer 'headers' pour créer un header
		const authorizationHeader = new Headers({
			'Authorization': 'Bearer ' + token
		});
		return new RequestOptions({ headers: authorizationHeader });
		// méthode pour retourner header (avec instance de RequestOptions)
		// importer RequestOptions
	}

	// décodage token
	decodeToken(token) {
		return jwtDecode(token);
		// méthode jwtDecode() prends en paramètre le token à décoder
	}
}
