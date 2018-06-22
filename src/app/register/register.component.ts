import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
	selector: 'cc-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	isAuthenticated: boolean;

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit() {
	}

	register(formData) {
		// on appelle méthode register() du service
		this.authService.register(formData)
			.subscribe(
				data  => this.handleRegisterSuccess(data),
				error => this.handleRegisterFailure(error)
			);
	}

	handleRegisterSuccess(data) {
		console.log('success ', data);
		this.router.navigate(['/']); // navigate() prends tableau en paramètre		
	}

	handleRegisterFailure(error) {
		console.error('failure ', error);
	}
}
