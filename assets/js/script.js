// Array to store quiz questions
var questions = [
    {
        question:
            "Q1) [JavaScript] How do you write 'Hello World' in an alert box?",
        options: [
            "msgBox('Hello World');",
            "msg('Hello World');",
            "alert('Hello World');",
            "alertBox('Hello World');",
        ],
        correctAnswer: "alert('Hello World');",
    },
    {
        question: "Q2) Is JavaScript case-sensitive?",
        options: ["True", "False"],
        correctAnswer: "True",
    },
    {
        question: "Q3) Which HTML attribute is used to define inline styles?",
        options: ["font", "Class", "style", "None of the above"],
        correctAnswer: "style",
    },
    {
        question: "Q4) Inside which HTML element do we put the JavaScript?",
        options: [
            "&lt;scripting&gt;",
            "&lt;javascript&gt;",
            "&lt;js&gt;",
            "None of the above",
        ],
        correctAnswer: "None of the above",
    },
    {
        question:
            'Q5) What is the correct syntax for referring to an external script called "xxx.js"?',
        options: [
            '&lt;script href="xxx.js"&gt;',
            '&lt;script src="xxx.js"&gt;',
            '&lt;script name="xxx.js"&gt;',
        ],
        correctAnswer: '&lt;script src="xxx.js"&gt;',
    },
    {
        question: "Q6) How to write an IF statement in JavaScript?",
        options: ["if (i==5)", "if i = 5", "if i = 5 then", "if i == 5 then"],
        correctAnswer: "if (i==5)",
    },
    {
        question:
            'Q7) How to write an IF statement for executing some code if "i" is NOT equal to 5?',
        options: [
            "if (i &lt;&gt; 5)",
            "if (i != 5)",
            "if i &lt;&gt; 5",
            "if i =! 5 then",
        ],
        correctAnswer: "if (i != 5)",
    },
    {
        question: "Q8) How does a FOR loop start?",
        options: [
            "for i = 1 to 5",
            "for (i = 0; i &lt;= 5; i++)",
            "for (i &lt; 5; i++)",
            "for (i = 0; i &lt;= 5)",
        ],
        correctAnswer: "for (i = 0; i &lt;= 5; i++)",
    },
];

// Function to shuffle array (Fisher-Yates algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let userAnswers = {};
// Function to generate HTML for a question
function generateQuestionHTML(questionObj, index) {
    // Shuffle the answer options
    shuffle(questionObj.options);

    let optionsHTML = "";
    const optionLabels = ["A", "B", "C", "D"];

    userAnswers[index] = { question: questionObj.question, answer: null };

    for (let i = 0; i < questionObj.options.length; i++) {
        const optionValue = String.fromCharCode(65 + i);
        const optionContent = questionObj.options[i]; // Get option answer
        optionsHTML += `<label>
                            <input type="radio" name="q${index}" value="${optionValue}">
                            ${optionLabels[i]}) ${optionContent}
                        </label><br>`;

        // When radio is trigger
        $(document).on(
            "change",
            `input[name="q${index}"][value="${optionValue}"]`,
            function () {
                // Update userAnswers
                userAnswers[index].answer = optionContent;
            }
        );
    }

    return `<div class="question">
                <p>${questionObj.question}</p>
                ${optionsHTML}
            </div>`;
}

const questionMap = {};
questions.forEach((question, index) => {
    questionMap[`q${index}`] = question.correctAnswer;
});

function calculateAccuracy(userAnswers, correctAnswers) {
    const totalQuestions = Object.keys(userAnswers).length;
    let correctCount = 0;

    for (const questionId in userAnswers) {
        const userAnswer = userAnswers[questionId].answer;
        const correctAnswer = correctAnswers[`q${questionId}`];

        if (userAnswer !== null && userAnswer === correctAnswer) {
            correctCount++;
        }
    }

    const accuracy = (correctCount / totalQuestions) * 100;

    const resultContainer = document.getElementById("result-container");

    resultContainer.innerHTML = "";

    resultContainer.innerHTML = `Correct Answers: ${correctCount}/${totalQuestions} (${accuracy}%)`;

    return accuracy;
}

// Function to generate the entire quiz HTML
function generateQuiz() {
    // Shuffle answer options for each question
    questions.forEach((q) => shuffle(q.options));

    let quizHTML = "";
    questions.forEach((q, index) => {
        quizHTML += generateQuestionHTML(q, index);
    });

    $("#quiz-container").html(quizHTML);
}

let startTime;

window.onload = function () {
    startTime = new Date();
};

// Document ready function
$(document).ready(function () {
    // Generate quiz on page load
    generateQuiz();

    // Submit button click event
    $('#submit-btn').on('click', function () {
        const submissionTime = new Date();
        const elapsedTime = submissionTime - startTime;

        startTime = new Date();
        calculateAccuracy(userAnswers, questionMap);
        sendDataToServer(submissionTime, elapsedTime, calculateAccuracy(userAnswers, questionMap));
    });
});

function sendDataToServer(submissionTime, elapsedTime, accuracy) {
    $.ajax({
        url: 'http://127.0.0.1/Quiz Website/database/submit.php',
        method: 'POST',
        data: {
            submissionTime: submissionTime,
            elapsedTime: elapsedTime,
            accuracy: accuracy
        },
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.error(error);
        }
    });
}
