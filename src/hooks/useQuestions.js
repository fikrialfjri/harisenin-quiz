import axios from "axios";
import { useEffect, useState } from "react";

export const useQuestions = (category) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    _fetchData(category);
  }, [category]);

  const _fetchData = async (category) => {
    try {
      const response = await axios.get(
        `https://the-trivia-api.com/api/questions?categories=${category}&limit=5`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return { questions };
};
