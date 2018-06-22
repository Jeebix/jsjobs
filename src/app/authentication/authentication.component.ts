import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";

@Component({
	selector: 'cc-authentication',
	templateUrl: './authentication.component.html',
	styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

	jbbData 	    = null; // flag (job board)
	isAuthenticated = false; // flag
	welcomeMessage  = ''; // flag

	constructor(private authService: AuthService) { }

	ngOnInit() {
		// getItem() récupère clé 'jbb-data' du localStorage
		if ( this.authService.userIsLoggedIn() )
		{
			this.refreshFlags();
		}
	}

	refreshFlags() {
		this.isAuthenticated = true;
		this.welcomeMessage  = 'Bienvenue';
	}

	login(formData) {
		// console.log(formData);
		this.authService.login(formData)
						.subscribe(
							data  => this.handleLoginSuccess(data),
							error => this.handleLoginFailure(error)
						);
	}

	handleLoginSuccess(data) {
		console.log('success', data);
		this.jbbData = data;
		this.refreshFlags();
		// localStorage permet de sauvegarder des données dans le navigateur
		// méthode setItem() de l'objet localStorage permet de sauvegarder
		localStorage.setItem('jbb-data', JSON.stringify(data));
		// setItem('nom', donnée à sauvegarder (string obligatoire))
		// JSON.stringify() convertit valeur JS en chaîne json
	}

	handleLoginFailure(error) {
		console.error('failure', error);
	}
}
