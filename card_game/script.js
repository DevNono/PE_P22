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

let games;
const affichageCroupier = document.querySelector('.croupier .affichageCroupier');
const scoreCroupier = document.querySelector('.croupier .score');
const affichageJoueur = document.querySelector('.joueurs .affichageJoueurs');
const affichageJeu = document.querySelector('.jeu');
const affichageTransition = document.querySelector('.annonce');
const affichageFin = document.querySelector('.final');

function best_under_17(combinaison) {
	if (Math.min(...combinaison) > 21) {
		return Math.min(...combinaison);
	}

	const nouvel_combinaison = combinaison.filter(element => element <= 21);
	return Math.max(...nouvel_combinaison);
}

function arrayEquals(a, b) {
	return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

class Card {
	constructor(valeur, type, lettre) {
		this.valeur = valeur;
		this.type = type;
		this.lettre = lettre;
		this.html = (window.listeCartes.filter(c => c.lettre === lettre)[0].html).replace('card--type', 'card--' + type);

		if (valeur === 10 && lettre !== '10') {
			this.html = this.html.replace('{{ svg }}', './assets/' + type + '_' + lettre + '.svg');
		}
	}
}

class Joueur {
	constructor(pseudo) {
		this.identifiant = pseudo;
		this.inventaire = [];
		this.vie = 1;
		this.score = 0;
	}
}

class Croupier {
	constructor() {
		this.identifiant = 'Croupier';
		this.inventaire = [];
		this.score = 0;
	}
}

class Game {
	constructor() {
		this.time = 20;
		this.joueurs = [];
		this.cards = [];
		this.manche = 0;
		this.joueurs_en_cours = 0;
		this.joueurs_en_vie = 3;
		this.croupier = new Croupier();
		this.nbJoueursEnVie = 0;

		for (let i = 0; i < numeros.length; i++) {
			const {valeur} = numeros[i];
			const {lettre} = numeros[i];
			for (let j = 0; j < symboles.length; j++) {
				const {type} = symboles[j];
				this.cards.push(new Card(valeur, type, lettre));
			}
		}

		for (let index = 0; index < pseudo.length; index++) {
			const nom = pseudo[index].id;
			this.joueurs.push(new Joueur(nom));
		}
	}

	tour_croupier() {
		let as = 0;
		const position = [];
		for (let i = 0; i < 2; i++) {
			games.croupier.inventaire.push(games.cards.shift());
			if (games.croupier.inventaire[i].valeur === 1) {
				as += 1;
			} else {
				position.push(i);
			}
		}

		let combinaison = [];
		if (as !== 0) {
			combinaison = [1, 11];
			for (let i = 1; i < as; i++) {
				combinaison[0] += 1;
				combinaison[1] += 1;
			}
		}

		let somme_croupier = games.croupier.inventaire[0].valeur + games.croupier.inventaire[1].valeur;

		if (!(arrayEquals(combinaison, []))) {
			for (const element of position) {
				[combinaison[0], combinaison[1]] = [combinaison[0] + games.croupier.inventaire[element].valeur, combinaison[1] + games.croupier.inventaire[element].valeur];
				somme_croupier = Math.max(...combinaison);
			}
		}

		let a = 1;
		while (somme_croupier < 10) {
			a += 1;
			this.croupier.inventaire.push(this.cards.shift());
			if (this.croupier.inventaire[a].valeur === 1) {
				as += 1;
				if (as === 1) {
					const combinaison = [somme_croupier + 1, somme_croupier + 11];
					somme_croupier = best_under_17(combinaison);
				} else if (as !== 0) {
					for (let i = 0; i < combinaison.length; i++) {
						combinaison[i] += 1;
					}

					somme_croupier = best_under_17(combinaison);
				}
			} else {
				somme_croupier += games.croupier.inventaire[a].valeur;
			}
		}

		games.croupier.score = somme_croupier;
		games.affichage(affichageCroupier, games.croupier);
	}

	distribution() {
		games.cards.sort(() => Math.random() - 0.5); // A changer car mélange bizarre
		for (let i = 0; i < games.joueurs.length; i++) {
			for (let k = 0; k < 2; k++) {
				games.joueurs[i].inventaire.push(games.cards.shift());
			}

			games.joueurs[i].score = games.joueurs[i].inventaire[0].valeur + games.joueurs[i].inventaire[1].valeur;
		}

		games.affichage(affichageJoueur, games.joueurs[games.joueurs_en_cours]);
	}

	pioche(joueur_en_cours) {
		games.joueurs[joueur_en_cours].inventaire.push(games.cards.shift());
		const position = games.joueurs[joueur_en_cours].inventaire.length - 1;
		games.joueurs[joueur_en_cours].score += games.joueurs[joueur_en_cours].inventaire[position].valeur;
		games.affichage(affichageJoueur, games.joueurs[joueur_en_cours]);
		if (games.joueurs[joueur_en_cours].score > 21) {
			games.tour_suivant(joueur_en_cours);
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

			games.nbJoueursEnVie = nbJoueurEnVie;

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
		affichageJeu.style.display = 'flex';
		affichageFin.style.display = 'none';

		for (let i = 0; i < numeros.length; i++) {
			const {valeur} = numeros[i];
			const {lettre} = numeros[i];
			for (let j = 0; j < symboles.length; j++) {
				const {type} = symboles[j];
				games.cards.push(new Card(valeur, type, lettre));
			}
		}

		for (let index = 0; index < pseudo.length; index++) {
			games.joueurs[index].inventaire = [];
		}

		games.distribution();
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

	affichage(emplacement, contenu) {
		emplacement.children[0].innerHTML = contenu.vie;
		emplacement.children[2].innerHTML = contenu.identifiant + ' : ' + contenu.score;

		emplacement.children[1].innerHTML = '';
		for (let k = 0; k < contenu.inventaire.length; k++) {
			const new_carte_html = document.createElement('carte');
			new_carte_html.innerHTML = contenu.inventaire[k].html;
			emplacement.children[1].appendChild(new_carte_html);
		}
	}

	transition(information) {
		affichageJeu.style.display = 'none';
		affichageTransition.style.display = 'flex';
		affichageTransition.children[0].innerHTML = information + 'A toi de jouer ' + games.joueurs[games.joueurs_en_cours].identifiant;
		setTimeout(() => {
			affichageJeu.style.display = 'flex';
			affichageTransition.style.display = 'none';
			affichageTransition.children[0].innerHTML = '';
			games.time = 20;
		}, 1000);
	}

	conclusion() {
		clearInterval(window.decompte);
		let resultathtml = '';

		for (let index = 0; index < pseudo.length; index++) {
			resultathtml += '<div class="rang">';
			resultathtml += '<div class="pseudo">' + games.joueurs[index].identifiant + '</div>';
			resultathtml += '<div class="viefinal">' + games.joueurs[index].vie + '</div>';
			resultathtml += '</div>';
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
		affichageJeu.style.display = 'none';
		affichageFin.style.display = 'flex';
		let resultathtml = '';
		affichageFin.children[0].innerHTML = '';
		affichageFin.children[1].innerHTML = '';
		affichageFin.children[2].innerHTML = '';

		resultathtml += '<div class="rang">';
		resultathtml += '<div class="pseudo">Croupier</div>';
		resultathtml += '<div class="cartes">';
		for (let i = 0; i < games.croupier.inventaire.length; i++) {
			resultathtml += games.croupier.inventaire[i].html;
		}

		resultathtml += '</div>';
		resultathtml += '<div class="scorefinal">' + games.croupier.score + '</div>';
		resultathtml += '</div>';

		for (let index = 0; index < pseudo.length; index++) {
			resultathtml += '<div class="rang">';
			resultathtml += '<div class="pseudo">' + games.joueurs[index].identifiant + '</div>';
			resultathtml += '<div class="cartes">';
			for (let k = 0; k < games.joueurs[index].inventaire.length; k++) {
				resultathtml += games.joueurs[index].inventaire[k].html;
			}

			resultathtml += '</div>';
			resultathtml += '<div class="scorefinal">' + games.joueurs[index].score + '</div>';
			resultathtml += '</div>';
		}

		affichageFin.children[0].innerHTML = resultathtml;

		console.log(games.nbJoueurEnVie);
		if (games.nbJoueursEnVie < 2) {
			affichageFin.children[2].innerHTML = '<input type="button" value="Suivant" id="button" onclick="games.conclusion()"></input>';
		} else {
			affichageFin.children[2].innerHTML = '<input type="button" value="Tour suivant" id="button" onclick="games.manche_suivante()"></input>';
		}
	}
}

function game() {
	games = new Game();
	games.distribution();
	games.tour_croupier();
	games.transition('');
	affichageJeu.style.display = 'flex';
	affichageFin.style.display = 'none';

	window.decompte = setInterval(() => {
		games.time--;
		console.log(games.time);
		document.querySelector('.chrono').innerHTML = games.time;
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
