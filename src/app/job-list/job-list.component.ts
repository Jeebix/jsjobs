import { Component, OnInit } from '@angular/core';
// import du service pour pouvoir le consommer
import { JobService } from "../services/job.service";

@Component({
    selector: 'cc-job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

    jobs  = [];
    error = '';

    // service importé (JobService), on peut l'injecter
    constructor(private jobService: JobService) {
        
    }

    // ngOnInit lance le code au lancement du component
    ngOnInit() {
        // puis on s'abonne à l'observable via le service
        this.jobService.getJobs()
                       .subscribe(
                           data  => this.jobs = data,
                           error => {
                               console.error();
                               this.error = error;
                           }
                       );
        this.jobService.jobsSubject.subscribe(data => {
            console.log(data);
            this.jobs = [data, ...this.jobs];
            // Les ... dans un array permettent de récupérer toutes les données dans le tableau
        });
    }
}

// job-add-form.component permet à l'utilisateur de saisir des données et les envoie vers le service
// Le service informe job-list.component de l'ajout de données grâce à subject (qui lui pousse les données)
// job-list est abonné, donc il rajoute les données dans son tableau

