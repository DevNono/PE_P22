/* eslint-disable camelcase */
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
		valeur: 11,
		lettre: 'V',
	},
	{
		valeur: 12,
		lettre: 'D',
	},
	{
		valeur: 13,
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

function shuffle_FY(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

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

function valeur_carte(carte) {
	if (carte.valeur > 10) {
		return 10;
	}

	if (carte.valeur === 1) {
		return 1;
	}

	return carte.valeur;
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
		// this.html = (window.listeCartes.filter(c => c.valeur === valeur)[0].html).replace('card--type', 'card--' + type);
	}
}

class Joueur {
	constructor(pseudo) {
		this.identifiant = pseudo;
		this.inventaire = [];
		this.vie = 3;
	}
}

class Croupier {
	constructor() {
		this.inventaire = [];
	}
}

class Game {
	constructor() {
		this.time = 0;
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

	// Installation(){
	//     shuffle(games.cards);
	//     for(let i=0;i<games.joueurs.length;i=i++){
	//             games.joueurs[i].inventaire.push(games.cards[i])
	//     };
	// }
	tirer_carte_joueur(id) {
		this.joueurs[id].inventaire.push(this.cards.shift());
	}

	distribuer() {
		for (let i = 0; i < this.joueurs.length; i++) {
			this.tirer_carte(i);
		}
	}

	tour_croupier() {
		let as = 0;
		const position = [];
		for (let i = 0; i < 2; i++) {
			this.croupier.inventaire.push(this.cards.shift());
			if (this.croupier.inventaire[i].valeur === 1) {
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

		console.log(combinaison);

		let somme_croupier = valeur_carte(this.croupier.inventaire[0]) + valeur_carte(this.croupier.inventaire[1]);
		console.log(somme_croupier);

		if (!(arrayEquals(combinaison, []))) {
			for (const element of position) {
				[combinaison[0], combinaison[1]] = [combinaison[0] + valeur_carte(this.croupier.inventaire[element]), combinaison[1] + valeur_carte(this.croupier.inventaire[element])];
				somme_croupier = max(combinaison);
			}
		}

		console.log(somme_croupier);
		let a = 1;
		while (somme_croupier < 17) {
			a += 1;
			this.croupier.inventaire.push(this.cards.shift());
			if (this.croupier.inventaire[a].valeur === 1) {
				as += 1;
				if (as === 1) {
					combinaison.push([somme_croupier + 1, somme_croupier + 11]);
					somme_croupier = best_under_17(combinaison);
					console.log(somme_croupier);
				} else if (as !== 0) {
					for (let i = 0; i < combinaison.length; i++) {
						combinaison[i] += 1;
					}

					console.log(combinaison);
					somme_croupier = best_under_17(combinaison);
					console.log(somme_croupier);
				}
			} else {
				somme_croupier += valeur_carte(this.croupier.inventaire[a]);
				console.log(somme_croupier);
			}
		}

		console.log(this.croupier.inventaire);
	}
}

function game() {
	games = new Game();
	document.querySelector('.test').innerHTML = games.cards.filter(c => c.valeur === 10 && c.type === 'trefle')[0].html;
	// Games.installation();
	console.log(games);
}

const jeu = new Game();

shuffle_FY(jeu.cards);

console.log(jeu.cards);
