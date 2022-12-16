import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import useForm from "../../hooks/useForm";
import { useQuestions } from "../../hooks/useQuestions";
import { secondToMinutes } from "../../utils/common";
import styles from "./styles.module.scss";

const {
  root,
  form_group,
  question_container,
  question_title,
  answer_container,
  answer_list,
  time_left,
} = styles;

const Onboarding = ({
  state,
  handleFormChange,
  handleStart,
  categories,
  user,
}) => {
  return (
    <>
      <div className={form_group}>
        <label htmlFor="name">Your Name</label>
        <input
          id="name"
          name="name"
          placeholder="Input your name"
          type="text"
          onChange={handleFormChange}
          value={state?.name}
          readOnly={user?.name?.length}
        />
      </div>
      <div className={form_group}>
        <label htmlFor="category">Categories</label>
        <select name="category" onChange={handleFormChange}>
          <option>Pilih kategori</option>
          {categories?.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button
        disabled={!state.name?.length || !state.category?.length}
        onClick={handleStart}
      >
        Start Quiz
      </button>
    </>
  );
};

const QuestionSection = ({ navigate, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(180);

  const { questions } = useQuestions(category);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    if (time <= 0) {
      _handleLocalStorage(false, score);
      navigate(`/leaderboard?category=${category}`);
    }

    return () => clearInterval(timer);
  }, [time, score]);

  const _handleAnswerClick = async (answer) => {
    const checkAnswer = answer === questions[currentIndex].correctAnswer;
    if (checkAnswer) {
      setScore(score + 1);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      _handleLocalStorage(checkAnswer, score);
      await navigate(`/leaderboard?category=${category}`);
    }
  };

  const _handleLocalStorage = (checkAnswer, score) => {
    let existing = localStorage.getItem("user");
    existing = existing ? JSON.parse(existing) : {};
    if (existing?.leaderboards) {
      const sameCategoryIdx = existing.leaderboards.findIndex(
        (obj) => obj.category === category
      );

      if (sameCategoryIdx >= 0) {
        existing.leaderboards[sameCategoryIdx].score = checkAnswer
          ? score + 1
          : score;
      } else {
        existing.leaderboards.push({
          category: category,
          score: checkAnswer ? score + 1 : score,
        });
      }
    } else {
      existing["leaderboards"] = [
        { category: category, score: checkAnswer ? score + 1 : score },
      ];
    }
    localStorage.setItem("user", JSON.stringify(existing));
  };

  // const sortArrayRandomly = (array) => {
  //   return array.concat().sort(() => 0.5 - Math.random());
  // };

  return (
    <>
      <div className={question_container}>
        <span>
          {currentIndex + 1} dari {questions?.length} soal
        </span>
        <h1 className={question_title}>{currentQuestion?.question}</h1>
        <ul className={answer_container}>
          {currentQuestion?.incorrectAnswers
            ?.concat(currentQuestion?.correctAnswer)
            .map((answer, index) => (
              <li
                key={index}
                className={answer_list}
                onClick={() => _handleAnswerClick(answer)}
              >
                {answer}
              </li>
            ))}
        </ul>
      </div>
      <div className={time_left}>Waktu tersisa: {secondToMinutes(time)}</div>
    </>
  );
};

const Quiz = () => {
  const [displayComponent, setDisplayComponent] = useState("onboarding");
  const { state, setForm, handleFormChange } = useForm({
    name: "",
    category: "",
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({});
  const { categories } = useCategories();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (searchParams.get("category")) {
      setDisplayComponent("question");
    } else {
      setDisplayComponent("onboarding");
    }
  }, [searchParams]);

  useEffect(() => {
    setForm({ ...state, name: user?.name });
  }, []);

  const _handleStart = () => {
    if (!user?.name) {
      const user = { name: state?.name };
      localStorage.setItem("user", JSON.stringify(user));
    }
    setSearchParams({ category: state?.category });
  };

  const components = {
    onboarding: (
      <Onboarding
        state={state}
        categories={categories}
        handleStart={_handleStart}
        handleFormChange={handleFormChange}
        user={user}
      />
    ),
    question: (
      <QuestionSection
        navigate={navigate}
        category={searchParams.get("category")}
      />
    ),
  };

  return <div className={root}>{components[displayComponent]}</div>;
};

export default Quiz;
