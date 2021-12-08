import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal/index";
import "./index.css";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

function Home() {
  const [number, setNumber] = useState("");
  const [btnConfirm, setBtnConfirm] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [counterRight, setCounterRight] = useState("");
  const [counterWrong, setCounterWrong] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [report, setReport] = useState([]);
  const [checked, setChecked] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState(false);
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    const tempLocal = JSON.stringify(quiz);
    localStorage.setItem("report", tempLocal);
  }, [quiz]);

  async function getAPI() {
    await axios
      .get(
        `https://opentdb.com/api.php?amount=${number}${category}${difficulty}`
      )
      .then((res) => {
        const result = res.data.results;
        result.forEach((question) => {
          question.id = Math.random();
          question.all_answers = [question.correct_answer];
          question.incorrect_answers.map((incorrectAnswer) =>
            question.all_answers.push(incorrectAnswer)
          );
          shuffleAnswers(question.all_answers);
        });
        setQuiz(result);
        setCounterRight(0);
        setCounterWrong(0);
        setShowQuiz(true);
        console.log(result);
      });
  }

  function shuffleAnswers(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    //to 'dis'shuffle true or false questions
    if (array[0] === "False") {
      array[0] = "True";
      array[1] = "False";
    }
  }

  function colorSelected(question, answer) {
    if (question.selected === true) {
      if (question.correct_answer === answer) {
        return { backgroundColor: "green" };
      } else if (question.answer_selected === answer) {
        if (
          question.correct_answer === answer &&
          question.answer_selected === question.correct_answer
        ) {
          return { backgroundColor: "green", fontWeight: "bold" };
        } else if (
          question.correct_answer !== answer &&
          question.answer_selected !== question.correct_answer
        ) {
          return { backgroundColor: "#c42a2a", fontWeight: "bold" };
        } else if (question.correct_answer !== answer) {
          return { backgroundColor: "#c42a2a" };
        }
      }
    }
  }

  function disableElement(question) {
    return question.selected === true ? true : false;
  }

  function counterRightOrWrong(question, answer) {
    if (question.correct_answer === answer) {
      setCounterRight(counterRight + 1);
    } else {
      setCounterWrong(counterWrong + 1);
    }
  }

  function addResults(question) {
    const result = {
      question: question.question,
      your_answer: question.answer_selected,
      correct_answer: question.correct_answer,
    };
    setAllResults([...allResults, result]);
    return allResults;
  }

  function handleChange(question, answer) {
    question.selected = true;
    question.answer_selected = answer;
    counterRightOrWrong(question, answer);
    addResults(question);
    setChecked(true);
    checkTheCheckbox(question, answer);
  }

  function checkTheCheckbox(question, id) {
    const selected = question.all_answers.map((answer) => answer === id);
    return selected === true ? setChecked(true) : setChecked(false);
  }

  function cancelQuiz() {
    setBtnConfirm(false);
    setShowQuiz(false);
    setNumber("");
    setCategory("");
  }

  function selectNumber(event) {
    setNumber(event.target.value);
  }

  function selectCategory(event) {
    setCategory(event.target.value);
  }

  function selectDifficulty(event) {
    setDifficulty(event.target.value);
  }

  function menuItem() {
    const arrayNumber = [];
    for (let i = 1; i <= 50; i++) {
      arrayNumber.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }
    return arrayNumber;
  }

  function confirmBtn() {
    if (number === "") {
      setError(true);
      return;
    } else {
      setError(false);
      setBtnConfirm(true);
    }
  }

  function cancelBtn() {
    setNumber("");
    setCategory("");
    setDifficulty("");
    setError(false);
  }

  function closeResults() {
    setShowQuiz(false);
    setBtnConfirm(false);
    setCounterRight("");
    setCounterWrong("");
    setAllResults([]);
    cancelBtn();
  }

  function showResults() {
    allResults.map((question) => question.question);
  }

  return (
    <>
      {btnConfirm === false && (
        <div className="initial-container">
          <div className="title-container">
            <h1>QUIZZER</h1>
          </div>
          <div className="inputs-container">
            <div className="number-difficulty-container">
              <div className="number-container">
                <FormControl sx={{ m: 1, minWidth: 120 }} error={error}>
                  <InputLabel>Questions</InputLabel>
                  <Select
                    value={number}
                    label="Questions *"
                    onChange={selectNumber}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {menuItem()}
                  </Select>
                  {error === true && <FormHelperText>Required</FormHelperText>}
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={difficulty}
                    onChange={selectDifficulty}
                    inputProps={{ "aria-label": "Without label" }}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Any Difficulty</em>
                    </MenuItem>
                    <MenuItem value={"&difficulty=easy"}>Easy</MenuItem>
                    <MenuItem value={"&difficulty=medium"}>Medium</MenuItem>
                    <MenuItem value={"&difficulty=hard"}>Hard</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="category-container">
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={category}
                  onChange={selectCategory}
                  inputProps={{ "aria-label": "Without label" }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Any Category</em>
                  </MenuItem>
                  <MenuItem value={"&category=9"}>General Knowledge</MenuItem>
                  <MenuItem value={"&category=10"}>Books</MenuItem>
                  <MenuItem value={"&category=11"}>Film</MenuItem>
                  <MenuItem value={"&category=12"}>Music</MenuItem>
                  <MenuItem value={"&category=13"}>
                    Musicals and Theatres
                  </MenuItem>
                  <MenuItem value={"&category=14"}>Television</MenuItem>
                  <MenuItem value={"&category=15"}>Video Games</MenuItem>
                  <MenuItem value={"&category=16"}>Board Games</MenuItem>
                  <MenuItem value={"&category=17"}>Science and Nature</MenuItem>
                  <MenuItem value={"&category=18"}>Computers</MenuItem>
                  <MenuItem value={"&category=19"}>Mathematics</MenuItem>
                  <MenuItem value={"&category=20"}>Mythology</MenuItem>
                  <MenuItem value={"&category=21"}>Sports</MenuItem>
                  <MenuItem value={"&category=22"}>Geography</MenuItem>
                  <MenuItem value={"&category=23"}>History</MenuItem>
                  <MenuItem value={"&category=24"}>Politics</MenuItem>
                  <MenuItem value={"&category=25"}>Art</MenuItem>
                  <MenuItem value={"&category=26"}>Celebrities</MenuItem>
                  <MenuItem value={"&category=27"}>Animals</MenuItem>
                  <MenuItem value={"&category=28"}>Vehicles</MenuItem>
                  <MenuItem value={"&category=29"}>Comics</MenuItem>
                  <MenuItem value={"&category=30"}>Gadgets</MenuItem>
                  <MenuItem value={"&category=31"}>Anime and Manga</MenuItem>
                  <MenuItem value={"&category=32"}>
                    Cartoon and Animations
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="btns-container">
            <div className="btn-confirm-container">
              <Button
                className="btn-confirm"
                variant="contained"
                onClick={() => confirmBtn()}
              >
                Confirm
              </Button>
            </div>
            <div className="btc-cancel-container">
              <Button
                className="btn-cancel"
                variant="contained"
                onClick={() => cancelBtn()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {btnConfirm === true && showQuiz === false && (
        <div className="start-quiz-container">
          <div className="title-container">
            <h1>QUIZZER</h1>
          </div>
          <div className="phrase-number-questions-container">
            <span>You've selected {number} questions.</span>
          </div>
          <div className="start-quiz-btns-container">
            <div>
              <Button
                className="btn-start"
                variant="contained"
                onClick={getAPI}
              >
                Start
              </Button>
            </div>
            <div>
              <Button variant="contained" onClick={() => cancelQuiz()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {btnConfirm === true && showQuiz === true && (
        <div className="form-container">
          <div className="counters-container">
            <div className="logo-container">
              <h1 onClick={() => cancelQuiz()}>QUIZZER</h1>
            </div>
            <div className="right-wrong-counter-container">
              <div className="right-wrong-container">
                <AiFillCheckCircle className="correct-counter-icon" />{" "}
                <label className="counter">{counterRight}</label>
                <AiFillCloseCircle className="wrong-counter-icon" />{" "}
                <label className="counter">{counterWrong}</label>
              </div>
              <div>{`${counterRight + counterWrong}/${quiz.length}`}</div>
            </div>
          </div>
          <form>
            {quiz.map((question) => (
              <li key={question.id} type="1" className="questions-container">
                {question.question
                  .replace(/&quot;/g, '"')
                  .replace(/&#039;/g, "'")
                  .replace(/&shy;/g, "<wbr>")
                  .replace(/&eacute;/g, "é")
                  .replace(/&rsquo;/g, "’")
                  .replace(/&amp;/g, "&")
                  .replace(/&rdquo;/g, '"')
                  .replace(/&ldquo;/g, '"')
                  .replace(/&prime;/g, "'")
                  .replace(/&Prime;/g, '"')
                  .replace(/&ntilde;/g, "ñ")
                  .replace(/&aacute;/g, "á")
                  .replace(/&atilde;/g, "ã")
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
                  .replace(/&ouml;/g, "ò")
                  .replace(/&uuml;/g, "ù")
                  .replace(/&iacute;/g, "í")
                  .replace(/&oacute;/g, "ó")
                  .replace(/&ocirc;/g, "õ")
                  .replace(/&lrm;/g, "")
                  .replace(/&Uuml;/g, "Ü")
                  .replace(/&uuml;/g, "ü")
                  .replace(/&auml;/g, "ä")
                  .replace(/&uacute;/g, "ú")
                  .replace(/&Aacute;/g, "Á")}

                <div className="answers-container">
                  <ul>
                    {question.all_answers.map((answer) => (
                      <div
                        key={answer}
                        className="aswer-container"
                        style={colorSelected(question, answer)}
                      >
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={checked}
                                size="small"
                                className="checkbox-element"
                                onChange={() => handleChange(question, answer)}
                                disabled={disableElement(question)}
                              />
                            }
                            label={
                              <div
                                className="only-answer"
                                style={colorSelected(question, answer)}
                              >
                                {answer
                                  .replace(/&quot;/g, '"')
                                  .replace(/&#039;/g, "'")
                                  .replace(/&shy;/g, "<wbr>")
                                  .replace(/&eacute;/g, "é")
                                  .replace(/&rsquo;/g, "’")
                                  .replace(/&amp;/g, "&")
                                  .replace(/&rdquo;/g, '"')
                                  .replace(/&ldquo;/g, '"')
                                  .replace(/&prime;/g, "'")
                                  .replace(/&Prime;/g, '"')
                                  .replace(/&ntilde;/g, "ñ")
                                  .replace(/&aacute;/g, "á")
                                  .replace(/&atilde;/g, "ã")
                                  .replace(/&lt;/g, "<")
                                  .replace(/&gt;/g, ">")
                                  .replace(/&ouml;/g, "ò")
                                  .replace(/&uuml;/g, "ù")
                                  .replace(/&iacute;/g, "í")
                                  .replace(/&oacute;/g, "ó")
                                  .replace(/&ocirc;/g, "õ")
                                  .replace(/&lrm;/g, "")
                                  .replace(/&Uuml;/g, "Ü")
                                  .replace(/&uuml;/g, "ü")
                                  .replace(/&auml;/g, "ä")
                                  .replace(/&uacute;/g, "ú")
                                  .replace(/&Aacute;/g, "Á")}
                              </div>
                            }
                          />
                        </FormGroup>
                      </div>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </form>
        </div>
      )}

      {quiz.length === counterWrong + counterRight ? (
        <Modal
          title="Final results"
          btnName="Close"
          subTitle={
            <div className="sub-title-container">
              {counterRight > 0
                ? `You got ${counterRight} of ${quiz.length} questions right!`
                : `You didn't get any questions right! :(`}
            </div>
          }
          handleClick={() => closeResults()}
          body={allResults.map((question) => (
            <li
              key={question.question}
              className="unique-result-answer-container"
              type="1"
            >
              {question.question
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'")
                .replace(/&shy;/g, "<wbr>")
                .replace(/&eacute;/g, "é")
                .replace(/&rsquo;/g, "’")
                .replace(/&amp;/g, "&")
                .replace(/&rdquo;/g, '"')
                .replace(/&ldquo;/g, '"')
                .replace(/&prime;/g, "'")
                .replace(/&Prime;/g, '"')
                .replace(/&ntilde;/g, "ñ")
                .replace(/&aacute;/g, "á")
                .replace(/&atilde;/g, "ã")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&ouml;/g, "ò")
                .replace(/&uuml;/g, "ù")
                .replace(/&iacute;/g, "í")
                .replace(/&oacute;/g, "ó")
                .replace(/&ocirc;/g, "õ")
                .replace(/&lrm;/g, "")
                .replace(/&Uuml;/g, "Ü")
                .replace(/&uuml;/g, "ü")
                .replace(/&auml;/g, "ä")
                .replace(/&uacute;/g, "ú")
                .replace(/&Aacute;/g, "Á")}
              <label className="results-answer-container">
                {question.your_answer === question.correct_answer ? (
                  ""
                ) : (
                  <span className="wrong-answer-modal">
                    {question.your_answer
                      .replace(/&quot;/g, '"')
                      .replace(/&#039;/g, "'")
                      .replace(/&shy;/g, "<wbr>")
                      .replace(/&eacute;/g, "é")
                      .replace(/&rsquo;/g, "’")
                      .replace(/&amp;/g, "&")
                      .replace(/&rdquo;/g, '"')
                      .replace(/&ldquo;/g, '"')
                      .replace(/&prime;/g, "'")
                      .replace(/&Prime;/g, '"')
                      .replace(/&ntilde;/g, "ñ")
                      .replace(/&aacute;/g, "á")
                      .replace(/&atilde;/g, "ã")
                      .replace(/&lt;/g, "<")
                      .replace(/&gt;/g, ">")
                      .replace(/&ouml;/g, "ò")
                      .replace(/&uuml;/g, "ù")
                      .replace(/&iacute;/g, "í")
                      .replace(/&oacute;/g, "ó")
                      .replace(/&ocirc;/g, "õ")
                      .replace(/&lrm;/g, "")
                      .replace(/&Uuml;/g, "Ü")
                      .replace(/&uuml;/g, "ü")
                      .replace(/&auml;/g, "ä")
                      .replace(/&uacute;/g, "ú")
                      .replace(/&Aacute;/g, "Á")}
                    <AiFillCloseCircle className="icon-close" />
                  </span>
                )}

                <span className="correct-answer-modal">
                  {question.correct_answer
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'")
                    .replace(/&shy;/g, "<wbr>")
                    .replace(/&eacute;/g, "é")
                    .replace(/&rsquo;/g, "’")
                    .replace(/&amp;/g, "&")
                    .replace(/&rdquo;/g, '"')
                    .replace(/&ldquo;/g, '"')
                    .replace(/&prime;/g, "'")
                    .replace(/&Prime;/g, '"')
                    .replace(/&ntilde;/g, "ñ")
                    .replace(/&aacute;/g, "á")
                    .replace(/&atilde;/g, "ã")
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&ouml;/g, "ò")
                    .replace(/&uuml;/g, "ù")
                    .replace(/&iacute;/g, "í")
                    .replace(/&oacute;/g, "ó")
                    .replace(/&ocirc;/g, "õ")
                    .replace(/&lrm;/g, "")
                    .replace(/&Uuml;/g, "Ü")
                    .replace(/&uuml;/g, "ü")
                    .replace(/&auml;/g, "ä")
                    .replace(/&uacute;/g, "ú")
                    .replace(/&Aacute;/g, "Á")}
                  <AiFillCheckCircle className="icon-check" />
                </span>
              </label>
            </li>
          ))}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Home;
