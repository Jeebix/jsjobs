import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { JobService } from "../services/job.service";

@Component({
	selector: 'cc-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

	decodedToken = null;
	isAdmin      = false;
	userEmail    = '';
	jobs 		 = [];
	adsTitle     = '';

	constructor(private authService: AuthService, private jobService: JobService) { }

	ngOnInit() {
		if ( this.authService.userIsLoggedIn() )
		{
			// on récupère le token en le parsant d'une string en objet
			const jbbToken = JSON.parse(localStorage.getItem('jbb-data'));
			this.decodedToken = this.authService.decodeToken(jbbToken.token);
			console.log(this.decodedToken);
			// si rôle d'admin, on passe flag à true
			if ( this.decodedToken && this.decodedToken.role === 'admin' )
			{
				this.isAdmin = true;
			}
			// on récupère l'email depuis le token
			this.userEmail = this.decodedToken.email;
			if ( this.isAdmin ) // si admin, on veut tous les jobs
			{
				this.loadAdsWithoutFilter();	
			}
			else
			{
				// on récupère les annonces de l'utilisateur avec l'email associé
				this.loadAds(this.userEmail);
			}
		}
	}

	loadAds(userEmail) {
		this.jobService.getJobsByUserEmail(userEmail)
					   .subscribe(
						   data => this.displayAds(data.jobs),
						   // data.jobs car getJobsByUserEmail retourne objet json
						   // avec propriétés 'success' et 'jobs'
						   err  => console.error()
					   );
	}

	loadAdsWithoutFilter() {
		this.jobService.getJobs()
					   .subscribe(
						   data => this.displayAds(data),
						   // seulement data car getJobs retourne getAllJobs()
						   err  => console.error()
					   );
	}

	displayAds(jobs) {
		console.log(jobs);
		this.jobs = jobs; // on rempli le tableau avec les jobs pour la vue
		switch ( this.jobs.length )
		{
			case 0: // pas d'annonces
				this.adsTitle = 'Aucune annonce postée à ce jour';
				return;
			case 1:
				this.adsTitle = '1 annonce postée';
			default:
				this.adsTitle = `${this.jobs.length} annonces postées`
		}
	}
}
