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

function max(array) {
	let max = array[0];
	for (let i = 1; i < array.length; i++) {
		if (array[i] > max) {
			max = array[i];
		}
	}

	return max;
}

function min(array) {
	let min = array[0];
	for (let i = 1; i < array.length; i++) {
		if (array[i] < min) {
			min = array[i];
		}
	}

	return min;
}

function best_under_17(combinaison) {
	if (min(combinaison) > 21) {
		return min(combinaison);
	}

	const nouvel_combinaison = combinaison.filter(element => element <= 21);
	return max(nouvel_combinaison);
}

function arrayEquals(a, b) {
	return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

class Card {
	constructor(valeur, type, lettre) {
		this.valeur = valeur;
		this.type = type;
		this.lettre = lettre;
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

		const combinaison = [];
		if (as !== 0) {
			combinaison.push(1);
			combinaison.push(11);
			for (let i = 1; i < as; i++) {
				combinaison[0] += 1;
				combinaison[1] += 1;
			}
		}

		let somme_croupier = games.croupier.inventaire[0].valeur + games.croupier.inventaire[1].valeur;

		if (!(arrayEquals(combinaison, []))) {
			for (const element of position) {
				[combinaison[0], combinaison[1]] = [combinaison[0] + games.croupier.inventaire[element].valeur, combinaison[1] + games.croupier.inventaire[element].valeur];
				somme_croupier = max(combinaison);
			}
		}

		let a = 1;
		while (somme_croupier < 17) {
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
	}

	distribution() {
		games.cards.sort(() => Math.random() - 0.5);
		for (let i = 0; i < games.joueurs.length; i++) {
			for (let k = 0; k < 2; k++) {
				games.joueurs[i].inventaire.push(games.cards.shift());
			}

			games.joueurs[i].score = games.joueurs[i].inventaire[0].valeur + games.joueurs[i].inventaire[1].valeur;
		}
	}

	pioche(joueur_en_cours) {
		games.joueurs[joueur_en_cours].inventaire.push(games.cards.shift());
		const position = games.joueurs[joueur_en_cours].inventaire.length - 1;
		games.joueurs[joueur_en_cours].score += games.joueurs[joueur_en_cours].inventaire[position].valeur;
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

			if (nbJoueurEnVie > 1) {
				games.manche_suivante();
			} else {
				console.log('FINI');
				clearInterval(window.decompte);
			}
		} else if (games.joueurs[joueur_en_cours + 1].vie <= 0) {
			games.tour_suivant(joueur_en_cours + 1);
		} else {
			games.joueurs_en_cours = joueur_en_cours + 1;
			games.time = 20;
		}
	}

	manche_suivante() {
		games.time = 20;
		games.cards = [];
		games.manche += 1;
		games.joueurs_en_cours = 0;
		games.croupier = new Croupier();

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
	}

	decompte_points() {
		for (let index = 0; index < pseudo.length; index++) {
			if (games.joueurs[index].score < games.croupier.score && games.joueurs[index].vie > 0) {
				games.joueurs[index].vie -= 1;
			}
		}
	}
}

function game() {
	games = new Game();
	games.distribution();
	games.tour_croupier();
}

window.decompte = setInterval(() => {
	games.time--;
	console.log(games.time);
	if (games.time === 0) {
		games.tour_suivant(games.joueurs_en_cours);
	}
}, 1000);

// Const jeu = new Game();

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

// console.log(jeu.cards);

// Document.querySelector('.test').innerHTML = games.joueurs[0].inventaire[0].html;
// Installation(){
//     shuffle(games.cards);
//     for(let i=0;i<games.joueurs.length;i=i++){
//             games.joueurs[i].inventaire.push(games.cards[i])
//     };
// }
// this.html = (window.listeCartes.filter(c => c.valeur === valeur)[0].html).replace('card--type', 'card--' + type);
