import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { JobService } from "../services/job.service";

@Component({
	selector: 'cc-job-details',
	templateUrl: './job-details.component.html',
	styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {

	jobDetails   = null; // variable initialisée qui contiendra le détails du job par id
	error        = null;
	errorMessage = ""; 

	constructor( private jobService: JobService, private activatedRoute: ActivatedRoute ) { }

	ngOnInit() {
		// on récupère le paramètre id
		const id = this.activatedRoute.snapshot.params.id;
		// puis on utilise le ervice et on s'y abonne
		this.jobService.getJob(id)
					   . subscribe(
						   data => {
							   this.handleServerResponse(data);
						   },
						   error => {
							   this.handleError(error);
						   }
					   );
	}

	handleServerResponse(response) {
		if ( response.success ) // si id OK
		{
			this.jobDetails = response.job;	
		}
		else
		{
			this.errorMessage = response.message; // si problème avec l'id
		}
	}

	handleError(error) {
		console.log('handleError ', error.statusText);
		this.error = error;
	}
}
