// Configuration
const numeros = [
	{
		valeur: 1,
		lettre: 'A',
	},
	{
		valeur: 2,
		lettre: '2',
	},
	{
		valeur: 3,
		lettre: '3',
	},
	{
		valeur: 4,
		lettre: '4',
	},
	{
		valeur: 5,
		lettre: '5',
	},
	{
		valeur: 6,
		lettre: '6',
	},
	{
		valeur: 7,
		lettre: '7',
	},
	{
		valeur: 8,
		lettre: '8',
	},
	{
		valeur: 9,
		lettre: '9',
	},
	{
		valeur: 10,
		lettre: '10',
	},
	{
		valeur: 10,
		lettre: 'V',
	},
	{
		valeur: 10,
		lettre: 'D',
	},
	{
		valeur: 10,
		lettre: 'R',
	},
];

const symboles = [
	{
		type: 'coeur',
	},
	{
		type: 'pique',
	},
	{
		type: 'carreau',
	},
	{
		type: 'trefle',
	},
];

const pseudo = [
	{
		id: 'nono',
	},
	{
		id: 'younsss',
	},
	{
		id: 'viet',
	},
];

// Variables initiales
let games;
const menu = document.querySelector('.start-menu'); // Menu de départ
const affichageCroupier = document.querySelector('.croupier .affichageCroupier'); // Affiche la carte du croupier
const scoreCroupier = document.querySelector('.croupier .score'); // Affiche le score du croupier
const affichageJoueur = document.querySelector('.joueurs .affichageJoueurs'); // Affiche le joueur
const affichageJeu = document.querySelector('.jeu'); // Affiche le jeu
const affichageTransition = document.querySelector('.annonce'); // Affiche les annonces / les transitions
const affichageFin = document.querySelector('.final'); // Affiche la fin du jeu

// Teste la meilleur combinaison
function best_under_17(combinaison) {
	if (Math.min(...combinaison) > 21) {
		return Math.min(...combinaison);
	}

	const nouvel_combinaison = combinaison.filter(element => element <= 21);
	return Math.max(...nouvel_combinaison);
}

// Teste si deux listes sont égales
function array_equals(a, b) {
	return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

// Classe de la carte
class Card {
	constructor(valeur, type, lettre) {
		this.valeur = valeur; // Valeur de la carte
		this.type = type; // Type de la carte
		this.lettre = lettre; // Lettre de la carte
		this.recto(); // On stocke le recto de la carte
	}

	// Stocke le verso de la carte dans la variable html
	verso() {
		this.html = (window.listeCartes.filter(c => c.lettre === 'C')[0].html); // A optimiser je pense, voir docs.js - Viêt
	}

	// Stocke le recto de la carte dans la variable html
	recto() {
		this.html = (window.listeCartes.filter(c => c.lettre === this.lettre)[0].html).replace('card--type', 'card--' + this.type); // Réaffiche le html des cartes

		if (this.valeur === 10 && this.lettre !== '10') { // Si on est sur une carte "habillée"
			this.html = this.html.replace('{{ svg }}', './assets/' + this.type + '_' + this.lettre + '.svg'); // On ajoute le bon svg
		}
	}
}

// Classe du joueur
class Joueur {
	constructor(pseudo) {
		this.identifiant = pseudo; // Identifiant du joueur
		this.inventaire = []; // Inventaire du joueur
		this.vie = 1; // Vie du joueur
		this.score = 0; // Score du joueur
	}
}

class Croupier {
	constructor() {
		this.identifiant = 'Croupier'; // Identifiant du croupier
		this.inventaire = []; // Inventaire du croupier
		this.score = 0; // Score du croupier
	}
}

class Game {
	constructor() {
		this.time = 20; // Temps de jeu
		this.joueurs = []; // Liste des joueurs
		this.cards = []; // Liste des cartes
		this.manche = 0; // Numéro de la manche
		this.joueurs_en_cours = 0; // Numéro du joueur en cours
		this.joueurs_en_vie = 3; // Nombre de joueurs en vie
		this.croupier = new Croupier(); // Croupier
		this.nb_joueurs_en_vie = 0; // Nombre de joueurs en vie

		// On crée le jeu de cartes
		for (let i = 0; i < numeros.length; i++) {
			const {valeur} = numeros[i]; // Valeur de la carte
			const {lettre} = numeros[i]; // Lettre de la carte
			// On crée la carte pour chaque symbole
			for (let j = 0; j < symboles.length; j++) {
				const {type} = symboles[j]; // Type de la carte
				this.cards.push(new Card(valeur, type, lettre)); // On ajoute la carte
			}
		}

		// On crée les joueurs
		for (let index = 0; index < pseudo.length; index++) {
			const nom = pseudo[index].id; // Identifiant du joueur
			this.joueurs.push(new Joueur(nom)); // On ajoute le joueur
		}
	}

	// Tour du croupier
	tour_croupier() {
		let as = 0; // Nombre d'as
		const position = []; // Position des cartes du croupier
		for (let i = 0; i < 2; i++) { // On prend 2 cartes au hasard
			games.croupier.inventaire.push(games.cards.shift()); // On ajoute les cartes au croupier
			if (games.croupier.inventaire[i].valeur === 1) { // Si on a un as
				as += 1; // On incrémente le nombre d'as
			} else {
				position.push(i); // Sinon on ajoute la position de la carte
			}
		}

		let combinaison = []; // On crée la combinaison
		if (as !== 0) { // Si on a un as
			combinaison = [1, 11]; // On crée la combinaison
			for (let i = 1; i < as; i++) {
				combinaison[0] += 1;
				combinaison[1] += 1;
			}
		}

		let somme_croupier = games.croupier.inventaire[0].valeur + games.croupier.inventaire[1].valeur; // On calcule le score du croupier

		if (!(array_equals(combinaison, []))) { // Si on a une combinaison qui n'est pas vide
			for (const element of position) { // Pour chaque position
				[combinaison[0], combinaison[1]] = [combinaison[0] + games.croupier.inventaire[element].valeur, combinaison[1] + games.croupier.inventaire[element].valeur];
				somme_croupier = Math.max(...combinaison); // On calcule le score du croupier avec la valeur maximale de la combinaison
			}
		}

		let a = 1; // Nombre de tour de boucle
		while (somme_croupier < 17) { // Tant que le score du croupier est inférieur à 17
			a += 1; // On incrémente le nombre de tour de boucle
			this.croupier.inventaire.push(this.cards.shift()); // On ajoute une carte au croupier
			if (this.croupier.inventaire[a].valeur === 1) { // Si on a un as
				as += 1; // On incrémente le nombre d'as
				if (as === 1) { // Si on a un seul as
					const combinaison = [somme_croupier + 1, somme_croupier + 11]; // On crée la combinaison
					somme_croupier = best_under_17(combinaison); // On calcule le score du croupier avec la valeur maximale de la combinaison
				} else if (as !== 0) { // Si on a zéro as
					for (let i = 0; i < combinaison.length; i++) { // Pour chaque combinaison
						combinaison[i] += 1; // On incrémente la combinaison
					}

					somme_croupier = best_under_17(combinaison); // On calcule le score du croupier avec la valeur maximale de la combinaison
				}
			} else {
				somme_croupier += games.croupier.inventaire[a].valeur; // On calcule le score du croupier
			}
		}

		for (let i = 1; i < this.croupier.inventaire.length; i++) { // Pour chaque carte du croupier
			this.croupier.inventaire[i].verso(); // On cache la carte
		}

		const somme_croupier_cache = this.croupier.inventaire[0].valeur; // On calcule le score du croupier
		games.croupier.score = somme_croupier_cache; // On met à jour le score du croupier
		games.affichage(affichageCroupier, games.croupier); // On affiche le croupier
	}

	distribution(liste_joueurs) { // Fonction changée pour ne pas distribuer aux morts, seuls changements : games.joueur => liste_joueurs
		games.cards.sort(() => Math.random() - 0.5); // A changer car mélange bizarre
		for (let i = 0; i < liste_joueurs.length; i++) {
			for (let k = 0; k < 2; k++) {
				liste_joueurs[i].inventaire.push(games.cards.shift());
			}

			liste_joueurs[i].score = liste_joueurs[i].inventaire[0].valeur + liste_joueurs[i].inventaire[1].valeur;
		}

		games.affichage(affichageJoueur, liste_joueurs[games.joueurs_en_cours]);
	}

	pioche(joueur_en_cours) {
		if (games.joueurs[joueur_en_cours].score > 21) {
			return;
		}

		games.joueurs[joueur_en_cours].inventaire.push(games.cards.shift());
		const position = games.joueurs[joueur_en_cours].inventaire.length - 1;
		games.joueurs[joueur_en_cours].score += games.joueurs[joueur_en_cours].inventaire[position].valeur;
		games.ajout_carte(affichageJoueur, games.joueurs[joueur_en_cours]);
		if (games.joueurs[joueur_en_cours].score > 21) {
			games.time += 4;
			setTimeout(() => {
				games.tour_suivant(joueur_en_cours);
			}, 2700);
		} else {
			games.time = 20;
		}
	}

	tour_suivant(joueur_en_cours) {
		if (joueur_en_cours === games.joueurs.length - 1) {
			games.decompte_points();

			let nbJoueurEnVie = 0;
			for (let index = 0; index < pseudo.length; index++) {
				if (games.joueurs[index].vie > 0) {
					nbJoueurEnVie++;
				}
			}

			games.nb_joueurs_en_vie = nbJoueurEnVie;

			if (nbJoueurEnVie > 1) {
				games.resultatTour();
			} else {
				games.resultatTour();
			}
		} else if (games.joueurs[joueur_en_cours + 1].vie <= 0) {
			games.tour_suivant(joueur_en_cours + 1);
		} else {
			games.joueurs_en_cours = joueur_en_cours + 1;
			games.affichage(affichageJoueur, games.joueurs[joueur_en_cours + 1]);
			games.transition('');
			games.time = 20;
		}
	}

	manche_suivante() {
		games.time = 20;
		games.cards = [];
		games.manche += 1;
		games.joueurs_en_cours = 0;
		games.croupier = new Croupier();
		games.affichage(affichageJoueur, games.joueurs[games.joueurs_en_cours]);
		affichageFin.classList.add('show-anim');

		for (let i = 0; i < numeros.length; i++) {
			const {valeur} = numeros[i];
			const {lettre} = numeros[i];
			for (let j = 0; j < symboles.length; j++) {
				const {type} = symboles[j];
				games.cards.push(new Card(valeur, type, lettre));
			}
		}

		const liste_joueurs = games.joueurs.slice(); // A modifier/exploiter pour ne pas afficher les morts
		for (let index = 0; index < pseudo.length; index++) {
			games.joueurs[index].inventaire = [];
			if (games.joueurs[index].vie === 0) {
				liste_joueurs.splice(index, 1);
			}
		}

		console.log(liste_joueurs);
		games.distribution(liste_joueurs);
		games.tour_croupier();
		if (games.joueurs[games.joueurs_en_cours].vie <= 0) {
			games.tour_suivant(games.joueurs_en_cours);
		}

		games.transition('Manche : ' + games.manche + '<br>');
	}

	decompte_points() {
		for (let index = 0; index < pseudo.length; index++) {
			if (((games.joueurs[index].score < games.croupier.score) || (games.joueurs[index].score > 21)) && (games.joueurs[index].vie > 0)) {
				games.joueurs[index].vie -= 1;
			}
		}
	}

	ajout_carte(emplacement, contenu) {
		const new_carte_html = document.createElement('carte');
		new_carte_html.classList.add('carte-anim');
		contenu.inventaire[contenu.inventaire.length - 1].verso();
		new_carte_html.innerHTML = contenu.inventaire[contenu.inventaire.length - 1].html;
		const carte_html = emplacement.children[1].appendChild(new_carte_html);
		setTimeout(() => {
			// Passsage au recto de la carte
			contenu.inventaire[contenu.inventaire.length - 1].recto();
			carte_html.innerHTML = contenu.inventaire[contenu.inventaire.length - 1].html;

			// Mise à jour du score
			emplacement.children[2].innerHTML = contenu.identifiant + ' : ' + contenu.score;
		}, 1000);
	}

	affichage(emplacement, contenu) {
		emplacement.children[0].innerHTML = contenu.vie;
		emplacement.children[2].innerHTML = contenu.identifiant + ' : ' + contenu.score;

		emplacement.children[1].innerHTML = '';
		if (contenu.identifiant === 'Croupier') {
			for (let k = 0; k < 2; k++) {
				const new_carte_html = document.createElement('carte');
				new_carte_html.innerHTML = contenu.inventaire[k].html;
				emplacement.children[1].appendChild(new_carte_html);
			}
		} else {
			for (let k = 0; k < contenu.inventaire.length; k++) {
				const new_carte_html = document.createElement('carte');
				new_carte_html.innerHTML = contenu.inventaire[k].html;
				emplacement.children[1].appendChild(new_carte_html);
			}
		}
	}

	transition(information) {
		affichageTransition.classList.add('show-anim');
		affichageTransition.children[0].innerHTML = information + 'A toi de jouer ' + games.joueurs[games.joueurs_en_cours].identifiant;
		setTimeout(() => {
			affichageTransition.classList.remove('show-anim');
			affichageTransition.children[0].innerHTML = '';
			games.time = 20;
		}, 1000);
	}

	conclusion() {
		clearInterval(window.decompte);
		let resultathtml = '';

		for (let index = 0; index < pseudo.length; index++) {
			resultathtml += `<div class="rang">
				<div class="pseudo">${games.joueurs[index].identifiant}</div>;
				<div class="viefinal">${games.joueurs[index].vie}</div>;
			</div>`;
		}

		affichageFin.children[0].innerHTML = resultathtml;

		let test = 0;
		let gagnant;
		for (let index = 0; index < pseudo.length; index++) {
			if (games.joueurs[index].vie !== 0) {
				test = 1;
				gagnant = games.joueurs[index].identifiant;
			}
		}

		if (test === 0) {
			affichageFin.children[1].innerHTML = 'Il n\'y a pas de gagnant';
		} else {
			affichageFin.children[1].innerHTML = 'Le gagnant est : ' + gagnant;
		}

		affichageFin.children[2].innerHTML = '<input type="button" value="Lancement" id="button" onclick="game()"></input>';
	}

	resultatTour() {
		games.time = -1;
		affichageJeu.classList.add('hide');
		affichageFin.classList.add('show-anim');
		let resultathtml = '';
		affichageFin.children[0].innerHTML = '';
		affichageFin.children[1].innerHTML = '';
		affichageFin.children[2].innerHTML = '';

		resultathtml += `<div class="rang">
			<div class="pseudo">Croupier</div>
			<div class="cartes">`;
		for (let i = 0; i < games.croupier.inventaire.length; i++) {
			games.croupier.inventaire[i].recto();
			resultathtml += games.croupier.inventaire[i].html;
		}

		resultathtml += `</div>
			<div class="scorefinal">${games.croupier.score}</div>
		</div>`;

		for (let index = 0; index < pseudo.length; index++) {
			resultathtml += `<div class="rang">
				<div class="pseudo">${games.joueurs[index].identifiant}</div>
				<div class="cartes">`;
			for (let k = 0; k < games.joueurs[index].inventaire.length; k++) {
				resultathtml += games.joueurs[index].inventaire[k].html;
			}

			resultathtml += `</div>
				<div class="scorefinal">${games.joueurs[index].score}</div>
			</div>`;
		}

		affichageFin.children[0].innerHTML = resultathtml;

		console.log(games.nbJoueurEnVie);
		if (games.nb_joueurs_en_vie < 2) {
			affichageFin.children[2].innerHTML = '<input type="button" value="Suivant" id="button" onclick="games.conclusion()"></input>';
		} else {
			affichageFin.children[2].innerHTML = '<input type="button" value="Tour suivant" id="button" onclick="games.manche_suivante()"></input>';
		}
	}
}

function game() {
	menu.classList.remove('start-menu-overlay');
	games = new Game();
	games.distribution(games.joueurs);
	games.tour_croupier();
	games.transition('');
	affichageJeu.classList.remove('hide');
	affichageTransition.classList.remove('show-anim');
	affichageFin.classList.remove('show-anim');

	window.decompte = setInterval(() => {
		games.time--;
		console.log(games.time);
		document.querySelector('.chrono-text').innerHTML = games.time;
		if (games.time === 0) {
			games.tour_suivant(games.joueurs_en_cours);
		}
	}, 1000);
}

function watch() {
	console.log(games);
}

// Shuffle_FY(jeu.cards);

// function shuffle_FY(array) {
// 	for (let i = array.length - 1; i > 0; i--) {
// 		const j = Math.floor(Math.random() * (i + 1));
// 		[array[i], array[j]] = [array[j], array[i]];
// 	}
// }
