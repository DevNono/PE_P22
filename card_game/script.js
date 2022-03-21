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

class Card {
	constructor(valeur, type, lettre) {
		this.valeur = valeur;
		this.type = type;
		this.lettre = lettre;
		this.html = (window.listeCartes.filter(c => c.valeur === valeur)[0].html).replace('card--type', 'card--' + type);
	}
}

class Joueur {
	constructor(pseudo) {
		this.identifiant = pseudo;
		this.inventaire = [];
		this.vie = 3;
	}
}

class Game {
	constructor() {
		this.time = 0;
		this.joueurs = [];
		this.cards = [];

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
}

const game = new Game();

console.log(game);

document.querySelector('.test').innerHTML = game.cards.filter(c => c.valeur === 10 && c.type === 'trefle')[0].html;
