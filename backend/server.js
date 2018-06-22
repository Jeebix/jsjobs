// npm init dans répertoire backend pour installer package.json
// puis un npm install express body-parser --save pour installer express.js et bodyParser
// installer nodemon : npm install -g nodemon
// on ajoute "start": "nodemon server" dans "script" de package.json pour démarrer sur nodemon et non node
// installer jsonwebtoken : npm install --save jsonwebtoken (si problème, npm cache clean)
// installer jwt-decode, librairie pour décoder token: npm install jwt-decode --save
// on paramètre notre fichier de serveur
// puis npm start

const express    = require('express'); // on récupère express qui est installé
const app        = express(); // on crée 1 appli en utilisant express() comme 1 méthode
const bodyParser = require('body-parser'); // permet de parser le résultat d'un formulaire posté
let data 		 = require('./jobs'); // récupère contenu exporté de jobs.js

let initialJobs  = data.jobs; // contient ce qui est récupéré de require('./jobs')
let addedJobs    = []; // ce qui est posté par le client

// initialisation des utilisateurs
let users = [
	{ id: 1, email: 'test@test.fr', nickname: 'test', password: 'oriane', role: 'admin' },
	{ id: 2, email: 'test2@test.fr', nickname: 'test2', password: 'oriane2', role: 'user' }
];

const secret     = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';
// secret (on peut mettre n'importe quoi) pour générer token
const jwt 	     = require('jsonwebtoken');

// fonction qui récupère tous les jobs
const getAllJobs = () => {
	return [...addedJobs, ...initialJobs];
};

// app.use() permet de passer des middlewares : requête arrive et peut subir traitement supplémentaire
// (ici bodyParser)
app.use(bodyParser.json()); // on passe le middleware bodyParser.json()
// requête entre => données parsées en json grâce à middleware bodyParser.json()

// custom middleware : callback avec 3 paramètres (au lieu de 2 habituels)
app.use((req, res, next) => {
	// méthode header() fournie par l'objet response (res)
	res.header('Access-Control-Allow-Origin', '*'); // * = accepte toutes les origines
	// le serveur accepte de répondre au client Angular même si port différent du sien
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	// pour gérer le POST et les headers cités
	next(); // on continue le traitement de la requête
});

const api  = express.Router(); // on crée un router
// express.Router() mini-appli qui permet d'utiliser méthodes get, post, delete, ...
const auth = express.Router(); 

// route pour .../login
auth.post('/login', (req, res) => {
	if ( req.body ) // si formulaire rempli
	{
		const email    = req.body.email.toLocaleLowerCase();
		const password = req.body.password.toLocaleLowerCase();
		const index    = users.findIndex(user => user.email === email);
		// findIndex() vérifie la condition de la fonction passée en paramètre

		// on vérifie si résultat retourné (différent de -1) et on compare au mdp posté
		if ( index > -1 && users[index].password === password )
		{
			let user    = users[index];
			let token   = '';
			// on test si admin
			if ( user.email === 'test@test.fr' )
			{
				token = jwt.sign(
					{ iss: 'http://localhost:4201', role: 'admin', email: req.body.email, nickname: user.nickname },
					secret
				);
				// sign() méthode de jwt pour créer payload (infos du token)
				// les claims représentent le corps du token, certains sont:
				// 'iss' pour 'issuer', 'exp' pour 'expiration', 'iat' moment où token créé
			}
			else
			{
				// sinon rôle user
				token = jwt.sign(
					{ iss: 'http://localhost:4201', role: 'user', email: req.body.email, nickname: user.nickname },
					secret
				);
			}
			res.json({ success: true, token: token }); // <=> { success: true, token }
		}
		else
		{
			res.status(401).json({ success: false, message: 'identifiants incorrects' });
			// on renvoi statut 401 = non-authentifié
		}
	}
	else
	{
		res.status(500).json({ success: false, message: 'données manquantes' });
		// statut 500 = erreur serveur
	}
});

// gestion du POST sur l'url /register
auth.post('/register', (req, res) => {
	console.log('req.body', req.body);
	if ( req.body )
	{
		const email    = req.body.email.toLocaleLowerCase().trim();
		const nickname = req.body.nickname.toLocaleLowerCase().trim();
		const password = req.body.password.toLocaleLowerCase().trim();
		// on définit le nouvel utilisateur
		users = [{ id: Date.now(), email: email, password: password, nickname: nickname }, ...users];
		
		res.json({ success: true, users: users });
	}
	else
	{
		res.json({ success: false, message: 'la création a échoué' });
	}
});

// on gère le GET
api.get('/jobs', (req, res) => {
	// res.json(data.jobs);
	res.json(getAllJobs());
});

// route pour les jobs filtrés par email (sorte de niveau d'authorisation)
api.get('/jobs/:email', (req, res) => {
	const email = req.params.email; // on récupère l'email
	const jobs  = getAllJobs().filter(job => job.email === email);
	// résultat
	res.json({ success: true, jobs: jobs });
});

// Création middleware (fonction avec 3 callbacks) pour sécuriser le formulaire
// Header envoyé du côté client à vérifier: "Authorization: Bearer token"
const checkUserToken = (req, res, next) => {
	// req.header() : accès aux headers (vérifie header de la requête côté client)
	if ( !req.header('authorization') )
	{
		// Problème d'authorisation
		return res.status(401).json({ success: flase, message: "Header d'authentification manquant" });
	}
	const authorizationParts = req.header('authorization').split(' ');
	let token = authorizationParts[1]; // on récupère le token du header splité
	// méthode de jwt pour décodage token avec callback pour gestion des erreurs
	const decodedToken = jwt.verify(token, secret, (err, decodedToken) => {
		// node: logique 'd'error first': si erreur on renvoi d'abord le résultat associé
		if ( err )
		{
			console.log(err);	
			return res.status(401).json({ success: false, message: 'Token non valide' });
		}
		else
		{
			console.log('decoded token ', decodedToken);
			next(); // on continue le traitement 
		}
	});
};

// puis le POST
api.post('/jobs', checkUserToken, (req, res) => {
	// on récupère le "corps" du formulaire (grâce au middleware bodyParser ligne 14)
	const job = req.body;
	// on ajoute le nouveau contenu aux jobs postés
	addedJobs = [job, ...addedJobs];
	console.log('total nb of jobs: ', getAllJobs().length);
	res.json(job); // on retourne une réponse
});

// on crée une route pour la recherche
// :variable = paramètre
// :variable? = paramètre facultatif
api.get('/search/:term/:place?', (req, res) => {
	// on récupère nos paramètres
	const term = req.params.term.toLowerCase().trim();
	let place  = req.params.place; // facultatif donc peut-être undefined
	
	// on filtre dans la description ou dans le titre
	let jobs = getAllJobs().filter(
		j => (j.description.toLowerCase().includes(term) || j.title.toLowerCase().includes(term))
	);

	// si filtre par place (lieu)
	if ( place )
	{
		place = place.toLowerCase().trim(); // on nettoie la variable
		jobs  = jobs.filter(j => (j.city.toLowerCase().includes(place)));
	}
	// réponse
	res.json({ success: true, jobs }); // <=> { success: true, jobs: jobs }
});

// on crée 1 route pour récupérer le contenu d'un job en fonction de son id
api.get('/jobs/:id', (req, res) => {
	const id  = parseInt(req.params.id, 10); // on récupère une string id grâce à req.params
	const job = getAllJobs().filter(j => j.id === id); // on filtre le tableau des jobs par l'id
	if ( job.length === 1 )
	{
		res.json({ success: true, job: job[0] });	
	}
	else
	{
		res.json({ success: false, message: `pas de job ayant pour id ${id}` });
	}
});

app.use('/api', api); // permet de requêter sur l'url localhost:4201/api/jobs plutôt que /jobs
app.use('/auth', auth);

const port = 4201; // on choisit un port d'écoute

// on définit le port d'écoute pour l'appli et un callback pour autre développeur
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});