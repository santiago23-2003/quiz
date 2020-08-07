const pregunta = document.getElementById("pregunta");
const Elecciones = Array.from(document.getElementsByClassName("EleccionTexto"));
const textoEnProgreso = document.getElementById("textoEnProgreso");
const puntajeTexto = document.getElementById("score");
const progresoBarraL = document.getElementById("progresoBarraL");
const Cargador = document.getElementById("Cargador");
const Juego = document.getElementById("Juego");
let preguntaActual = {};
let acceptingAnswers = false;
let score = 0;
let contadorPreguntas = 0;
let availablePreguntas = [];

let preguntas = [
    {
    pregunta:"¿Cuanto es 2 * 6?",
    Eleccion1:"8",
    Eleccion2:"12",
    Eleccion3:"34",
    Eleccion4:"14",
    answer:2
    },
    {
    pregunta:"¿Cuanto es 4 / 2?",
    Eleccion1:"2",
    Eleccion2:"8",
    Eleccion3:"16",
    Eleccion4:"4",
    answer:1
    }
];

fetch(
    'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        preguntas = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                pregunta: loadedQuestion.pregunta,
            };

            const answerElecciones = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerElecciones.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerElecciones.forEach((Eleccion, index) => {
                formattedQuestion['Eleccion' + (index + 1)] = Eleccion;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    contadorPreguntas = 0;
    score = 0;
    availablePreguntas = [...preguntas];
    getNewpregunta();
    Juego.classList.remove('hidden');
    Cargador.classList.add('hidden');
    console.log(availablePreguntas);

};

getNewpregunta = () => {
    if (availablePreguntas.length === 0 || contadorPreguntas >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('/end.html');
    }
    contadorPreguntas++;
    textoEnProgreso.innerText = `Question ${contadorPreguntas}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progresoBarraL.style.width = `${(contadorPreguntas / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availablePreguntas.length);
    currentQuestion = availablePreguntas[preguntaIndex];
    pregunta.innerHTML = currentQuestion.pregunta;

    Elecciones.forEach((Eleccion) => {
        const number = Eleccion.dataset['number'];
        Eleccion.innerHTML = currentQuestion['Eleccion' + number];
    });

    availablePreguntas.splice(questionIndex, 1);
    acceptingAnswers = true;
};

Elecciones.forEach((Eleccion) => {
    Eleccion.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedEleccion = e.target;
        const selectedAnswer = selectedEleccion.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedEleccion.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedEleccion.parentElement.classList.remove(classToApply);
            getNewpregunta();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    textoEnProgreso.innerText = score;
};