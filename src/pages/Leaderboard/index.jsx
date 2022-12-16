import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLeaderboards } from "../../hooks/useLeaderboards";
import styles from "./styles.module.scss";

const { leaderboard, leaderboard_title, leaderboard_table } = styles;

const Leaderboard = () => {
  const [searchParams] = useSearchParams({});
  const category = searchParams.get("category");
  const { leaderboardByCategory } = useLeaderboards(category);

  return (
    <div className={leaderboard}>
      <Link to="/quiz">{`< Back to quiz home`}</Link>
      <h1 className={leaderboard_title}>{category} Leaderboard Score</h1>
      <table className={leaderboard_table}>
        <thead>
          <tr>
            <th align="center">Rank</th>
            <th align="left">Nama</th>
            <th align="center">Skor</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardByCategory.map((leaderboard, idx) => {
            return (
              <tr key={idx}>
                <td align="center">{idx + 1}</td>
                <td align="left">{leaderboard?.name}</td>
                <td align="center">{leaderboard?.score * 20}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
