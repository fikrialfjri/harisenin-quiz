import axios from "axios";
import { useEffect, useState } from "react";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  const _fetchData = async () => {
    try {
      const response = await axios.get(
        "https://the-trivia-api.com/api/categories"
      );

      const newArr = [];
      Object.entries(response?.data).forEach((dt) => {
        if (dt[1]?.length === 1) {
          newArr.push(dt[1][0]);
        } else if (dt[1]?.length > 1) {
          dt[1].forEach((l) => {
            if (l.includes("_")) newArr.push(l);
          });
        }
      });
      setCategories(newArr);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return { categories };
};
