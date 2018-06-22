import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

// 1 Subject est un objet qui est observable et observer
// Il peut pousser des données vers les entités qui sont abonnées et écouter des données
// Il est bcp utiliser pour pouvoir pousser aux entités abonnées de nouvelles données grâce à sa méthode next()
import { Subject } from "rxjs/Rx";
import { Observable } from 'rxjs/Observable';
import { AuthService } from "./auth.service";

@Injectable()

export class JobService {

	initialJobs = []; // Récupère seulement le contenu de jobs.json
	jobs = []; // Contient ce qui est ajouté par le formulaire (et permet aux méthodes d'accéder à ses propriétés)
	jobsSubject = new Subject(); // pour communiquer au component job-list
	searchResultSubject = new Subject(); // pour communiquer avec component search-result

	BASE_URL = 'http://localhost:4201';
	
	// constructor (accesseur: instance: type)
	constructor(private http: Http, private authService: AuthService) { }
	
	getJobs() {
		return this.http.get(this.BASE_URL + '/api/jobs')
						.map(res => res.json()) // on map le résultat en tableau d'objet json
						.do(data => this.initialJobs = data); // on initialise initialJobs grâce au do()
	}

	getJobsByUserEmail(userEmail) {
		return this.http.get(this.BASE_URL + `/api/jobs/${userEmail}`)
						.map(res => res.json());
	}

	addJob(jobData, token) {
		jobData.id = Date.now(); // Permet id unique (date en ms unique depius 1970)
		
		// on récupère le header à envoyer
		const requestOptions = this.authService.addAuthorizationHeader(token);
		
		return this.http.post(this.BASE_URL + '/api/jobs', jobData, requestOptions)
						.map(res => {
							console.log(res);
							this.jobsSubject.next(jobData); // on pense à pousser le nouveau jobData vers job-list
						});
	}

	getJob(id) {
		return this.http.get(this.BASE_URL + `/api/jobs/${id}`)
						.map(res => res.json()); // on map l'objet response en objet json
	}

	searchJob(criteria) {
		console.log(criteria);
		// retourne un observable à celui qui consomme service searchJob
		return this.http.get(`${this.BASE_URL}/api/search/${criteria.term}/${criteria.place}`)
						.map(res => res.json()) // transforme la réponse en objet json
						.do(res => this.searchResultSubject.next(res));
						// on pousse le résultat à celui qui s'abonne (searchResultComponent)

	}
}
