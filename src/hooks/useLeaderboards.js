import { useEffect, useState } from "react";
import { LEADERBOARDS } from "../libs/data";

export const useLeaderboards = (category) => {
  const [leaderboardByCategory, setLeaderboardByCategory] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const _fetchData = () => {
    const newLeaderboards = LEADERBOARDS;
    newLeaderboards.push(user);

    let filteredLeaderboards = [];
    newLeaderboards.map((data) => {
      return data?.leaderboards
        ?.filter((dt) => dt?.category === category)
        .map((dt, idx) => {
          filteredLeaderboards.push({ name: data?.name, score: dt?.score });
        });
    });

    const result = [
      ...new Map(
        filteredLeaderboards.map((item) => [item["name"], item])
      ).values(),
    ]?.sort((a, b) => b?.score - a?.score);

    setLeaderboardByCategory(result);
  };

  return { leaderboardByCategory };
};
