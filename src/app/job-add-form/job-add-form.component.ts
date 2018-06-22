import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { JobService } from "../services/job.service";
import { AuthService } from "../services/auth.service";

@Component({
	selector: 'cc-job-add-form',
	templateUrl: './job-add-form.component.html',
	styleUrls: ['./job-add-form.component.css']
})

export class JobAddFormComponent implements OnInit {

	// variable de type FormGroup
	form: FormGroup;
	
	userIsLoggedIn = false; // flag

	// Pour liste déroulante select (tableau d'objets)
	contractTypes = [
		{ id: 1, name: 'stage', value: 'internship' },
		{ id: 2, name: 'intérim', value: 'temp' },
		{ id: 3, name: 'contrat durée déterminée (CDD)', value: 'fixed-term' },
		{ id: 4, name: 'contrat à durée indéterminée (CDI)', value: 'permanent' },
		{ id: 5, name: 'indépendant', value: 'freelance' }
	];

	currencies = [
		{ id: 1, name: 'euros', value: 'EU', symbol: '€' },
		{ id: 2, name: 'livres sterling', value: 'POUNDS', symbol: '£' },
		{ id: 3, name: 'francs CFA', value: 'CFA', symbol: 'CFA' },
		{ id: 4, name: 'dollars canadien', value: 'CAD', symbol: '$' }
	];

	statuses = [
		{ id: 1, name: 'cadre', value: 'executive' },
		{ id: 1, name: 'employé', value: 'employee' }
	];

	experience = [
		{ id: 1, name: 'junior', value: 'junior' },
		{ id: 2, name: 'medior', value: 'medior' },
		{ id: 3, name: 'senior', value: 'senior' }
	];

	areas = [
		{ id: 1, name: 'aucun déplacements', value: 'none' },
		{ id: 2, name: 'déplacements régionaux', value: 'region' },
		{ id: 3, name: 'déplacements nationaux', value: 'nation' },
		{ id: 4, name: 'déplacements internationaux', value: 'international' }
	];

	constructor(private formBuilder: FormBuilder, private jobService: JobService, private authService: AuthService) { }

	ngOnInit() {
		// .group() méthode propre à FormBuilder
		// Le formulaire devra avoir ces propriétés
		this.form = this.formBuilder.group({
			id: -1,
	  		title: '',
			company: '',
			city: '',
			zipcode: 35,
			description: '',
			contract: '',
			salary: null,
			currency: '',
			startdate: new Date(),
			experience: '',
			status: '',
			area: '',
			field: '',
			publishdate: new Date(),
			lastupdate: new Date()
		});

		// on teste au démarrage si utilisateur connecté
		this.checkUserIsLoggedIn();
	}

	createJob(jobData) {
		// this.form.value permet d'accéder aux valeurs du formulaire
		// console.log(this.form.value);
		const token = JSON.parse(localStorage.getItem('jbb-data')).token;
		this.jobService.addJob(jobData, token).subscribe();
		// récupère propriété token du token passé en objet JS
		this.form.reset(); // on reset() le formulaire après soumission
	}

	checkUserIsLoggedIn() {
		if ( this.authService.userIsLoggedIn() )
		{
			this.userIsLoggedIn = true;
		}
	}
}

// job-add-form.component permet à l'utilisateur de saisir des données et les envoie vers le service
// Le service informe job-list.component de l'ajout de données grâce à subject (qui lui pousse les données)
// job-list est abonné, donc il rajoute les données dans son tableau
