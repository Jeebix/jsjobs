import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router"; // Pour le routage
// Penser tags <router-outlet></router-outlet> dans composant html racine

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobService } from "./services/job.service";
import { JobAddFormComponent } from './job-add-form/job-add-form.component';
import { DaysAgoPipe } from './pipes/days-ago.pipe';
import { HomeComponent } from './home/home.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { AboutComponent } from './about/about.component';
import { ToShortDatePipe } from './pipes/to-short-date.pipe';
import { ToMoneySymbolPipe } from './pipes/to-money-symbol.pipe';
import { SearchResultComponent } from './search-result/search-result.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthService } from "./services/auth.service";
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TruncatePipe } from './pipes/truncate.pipe';

const routes = [
    { path: '', component: HomeComponent },
    // On affiche 1 job en allant sur la page localhost:4200/jobs
    { path: 'jobs/add', component: JobAddFormComponent },
    { path: 'jobs/:id', component: JobDetailsComponent },
    // pour récupérer l'id dans un snapshot.params.id
    { path: 'jobs', component: JobListComponent },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: AuthenticationComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'profile', component: UserProfileComponent }
]

@NgModule({
    declarations: [
        AppComponent,
        SearchComponent,
        JobListComponent,
        JobAddFormComponent,
        DaysAgoPipe,
        HomeComponent,
        JobDetailsComponent,
        AboutComponent,
        ToShortDatePipe,
        ToMoneySymbolPipe,
        SearchResultComponent,
        AuthenticationComponent,
        RegisterComponent,
        UserProfileComponent,
        TruncatePipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes)
    ],
    // providers: services (tout service créé doit être déclaré ici)
    providers: [JobService, AuthService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
