document.addEventListener("DOMContentLoaded", () => {
  const StartBtn = document.getElementById("StartBtn");
  const NextBtn = document.getElementById("NextBtn");
  const RestartBtn = document.getElementById("RestartBtn");
  const Question_container = document.getElementById("Question_container");
  const Question_text = document.getElementById("Question_text");
  const Choices_list = document.getElementById("Choices_list");
  const Result_container = document.getElementById("Result_container");
  const ScoreDisplay = document.getElementById("Score");

  const QuestionsArray = [
    {
      question: "Which of the following is a programming language?",
      choices: ["HTML", "CSS", "JavaScript", "HTTP"],
      answer: "JavaScript",
    },
    {
      question:
        "Which data structure follows the Last In, First Out (LIFO) principle?",
      choices: ["Queue", "Array", "Stack", "Linked List"],
      answer: "Stack",
    },
    {
      question:
        "Which PC component is primarily responsible for executing program instructions?",
      choices: ["RAM", "CPU", "SSD", "GPU"],
      answer: "CPU",
    },
    {
      question: "What is the main purpose of RAM in a computer?",
      choices: [
        "Store files permanently",
        "Temporarily store data for running programs",
        "Display graphics",
        "Connect to the internet",
      ],
      answer: "Temporarily store data for running programs",
    },
    {
      question: "Which keyword is used to declare a constant in JavaScript?",
      choices: ["var", "let", "const", "static"],
      answer: "const",
    },
  ];

  let CurrentQuestionIndex = 0;
  let Score = 0;
  let isCorrectAnswer = false;

  StartBtn.addEventListener("click", () => {
    StartBtn.classList.add("hidden");
    Question_container.classList.remove("hidden");
    ShowQuestions();
  });

  NextBtn.addEventListener("click", () => {
    CurrentQuestionIndex += 1;
    if (isCorrectAnswer) {
      Score += 1;
    }
    if (CurrentQuestionIndex < QuestionsArray.length) {
      ShowQuestions();
    } else {
      NextBtn.classList.add("hidden");
      Question_container.classList.add("hidden");
      Result_container.classList.remove("hidden");
      ScoreDisplay.textContent = `${Score} out of ${QuestionsArray.length}`;
    }
  });

  RestartBtn.addEventListener("click",() => {
    CurrentQuestionIndex = 0;
    Score = 0;
    isCorrectAnswer = false;
    Result_container.classList.add("hidden");
    Question_container.classList.remove("hidden");
    ShowQuestions();
  })

  function ShowQuestions() {
    NextBtn.classList.add("hidden");
    Question_text.textContent = QuestionsArray[CurrentQuestionIndex].question;
    Choices_list.innerHTML = "";
    QuestionsArray[CurrentQuestionIndex].choices.forEach((element) => {
      let choice = document.createElement("li");
      choice.textContent = element;
      Choices_list.appendChild(choice);
      choice.addEventListener("click", () => checkAnswer(element));
    });
  }

  function checkAnswer(Answer) {
    let choicelistitems = document.querySelectorAll("#Choices_list li");
    choicelistitems.forEach(element => {
      element.classList.remove("li_lock");
      if(element.textContent === Answer){
        element.classList.add("li_lock");
      }
    });
    if (QuestionsArray[CurrentQuestionIndex].answer === Answer) {
      isCorrectAnswer = true;
    } else {
      isCorrectAnswer = false;
    }
    NextBtn.classList.remove("hidden");
  }
});
