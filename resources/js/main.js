import Swal from 'sweetalert2';
// Manage Quiz State
const quizHandler = [];

/* ===============================================
            Beginning of Quiz
=============================================== */

function quizInit(quizIndex, questions) {
	const quizHandlerInstance = quizHandler[quizIndex];
	quizHandlerInstance.isFinished = false;
	quizHandlerInstance.result = 0;
	quizHandlerInstance.questions = questions;
	quizHandlerInstance.nbQuestions = questions.length;
	quizHandlerInstance.answers = new Array(quizHandlerInstance.nbQuestions).fill(-1);
	quizHandlerInstance.actualQuestion = 1;
	quizHandlerInstance.nbCorrect = 0;

	document.querySelector('.progresstext .max').innerText = quizHandlerInstance.nbQuestions;
	buildQuestion(quizIndex, quizHandlerInstance.actualQuestion);
}

function calculateQuizResults(quizHandlerInstance) {
	let count = 0;
	for (let i = 0; i < quizHandlerInstance.questions.length; i++) {
		if (quizHandlerInstance.answers[i] === quizHandlerInstance.questions[i].correct) {
			count++;
		}
	}

	quizHandlerInstance.nbCorrect = count;
	quizHandlerInstance.result = Math.round(count * (1 / quizHandlerInstance.nbQuestions) * 100);
}

function buildQuestion(quizIndex, nb) {
	const quizHandlerInstance = quizHandler[quizIndex];
	document.querySelectorAll('.progresstext .min')[quizIndex].innerText = nb - 1;
	document.querySelectorAll('.progressbar .bar1')[quizIndex].style.width = `${Math.round(((nb - 1) / quizHandlerInstance.nbQuestions) * 100)}%`;

	const current = quizHandlerInstance.questions[nb - 1];
	document.querySelectorAll('.quiz .question')[quizIndex].innerText = current.question;

	let template = '';
	const letter = 65;
	for (let i = 0; i < current.answers.length && i < 26; i++) {
		template += `<input type="radio" name="answer" id="answer${i + 1}-check" value="${i + 1}">
        <a data-aos="fade-${i % 2 === 0 ? 'left' : 'right'}" data-aos-delay="${i * 150}" data-for="answer${i + 1}-check" class="answer answer${i + 1}">
            <span>${String.fromCharCode(letter + i)}</span>
            <p>${current.answers[i]}</p>
        </a>`;
	}

	document.querySelectorAll('.quiz .answers')[quizIndex].innerHTML = template;

	// Add answer click
	document.querySelectorAll('.quiz')[quizIndex].querySelectorAll('.answer').forEach(el => {
		el.addEventListener('click', () => {
			const fordata = el.dataset.for;
			document.querySelector('#' + fordata).checked = true;
		});
	});
}

// Add Events and OnStart functions
document.addEventListener('DOMContentLoaded', e => {
	document.querySelectorAll('.quiz').forEach((el, i) => {
		quizHandler.push({
			isFinished: false,
			questions: {},
			answers: [],
			nbQuestions: 0,
			result: 0, // Result percentage
			actualQuestion: 1, // Actual question
			nbCorrect: 0,
		});

		const questions = JSON.parse(el.dataset.quiz.replaceAll('\'', '"'));
		quizInit(i, questions);
	});
	// Add quiz click event handler
	document.querySelectorAll('.submit-quiz').forEach((el, i) => {
		el.addEventListener('click', () => {
			if (quizHandler[i].isFinished === true) {
				document.querySelector('.submit-quiz').innerText = 'Vérifier';
				quizInit(i, quizHandler[i].questions);
			} else {
				quizHandler[i].answers[quizHandler[i].actualQuestion - 1] = parseInt(document.querySelector('input[type=\'radio\'][name=\'answer\']:checked').value, 10);
				let modal;
				if (quizHandler[i].answers[quizHandler[i].actualQuestion - 1] === quizHandler[i].questions[quizHandler[i].actualQuestion - 1].correct) {
					modal = {
						title: 'Bonne réponse !',
						icon: 'success',
					};
				} else {
					modal = {
						title: 'Mauvaise réponse !',
						icon: 'error',
					};
				}

				Swal.fire({
					...modal,
					html: quizHandler[i].questions[quizHandler[i].actualQuestion - 1].explanation,
					confirmButtonText: 'Continuer',
				}).then(() => {
					if (quizHandler[i].actualQuestion < quizHandler[i].nbQuestions) {
						quizHandler[i].actualQuestion += 1;
						buildQuestion(i, quizHandler[i].actualQuestion);
					} else {
						document.querySelector('.progresstext .min').innerText = quizHandler[i].nbQuestions;
						document.querySelector('.progressbar .bar1').style.width = '100%';

						calculateQuizResults(i);

						document.querySelector('.quiz .question').innerText = 'Résultats';
						document.querySelector('.submit-quiz').innerText = 'Rejouer';
						quizHandler[i].isFinished = true;

						document.querySelector('.quiz .answers').innerHTML = `<div id="circle-container"></div><p>Vous avez obtenu &nbsp;<span>${quizHandler[i].nbCorrect} / ${quizHandler[i].nbQuestions}</span></p>`;
					}
				});
			}
		});
	});
});
/* ===============================================
            Ending of Quiz
=============================================== */
