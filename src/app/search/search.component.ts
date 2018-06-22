import { Component, OnInit } from '@angular/core';
// import du service
import { JobService } from "../services/job.service";

@Component({
	selector: 'cc-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	jobs = [];

	// injection du service
	constructor(private jobService: JobService) { }

	ngOnInit() {
	}

	// utilisation du service
	searchJobs(searchData) {
		// observable retourné : penser à s'abonner
		this.jobService.searchJob(searchData)
			.subscribe(
				data  => this.jobs = data,
				error => console.error(error)
			);
	}
}
