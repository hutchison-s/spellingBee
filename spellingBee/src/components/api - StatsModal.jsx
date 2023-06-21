import axios from "axios";
import { useState, useEffect } from "react";
import WordPieChart from "./WordPieChart";
import "./Modals.css";
import BarGraph from "./charts/BarGraph";

export default function StatsModal() {
  const [apiData, setApiData] = useState({});

  const sample = {
    nouns: 95,
    verbs: 92,
    adjectives: 68,
    adverbs: 12,
    interjections: 100,
  };

  useEffect(() => {
    axios.get("https://beeyondwords.vercel.app/api/stats").then((res) => {
      setApiData(res.data);
    });
  }, []);

  function mapData() {
    const response = [];
    for (const category in apiData) {
      if (category === "words") {
        response.push(
          <>
            <h4 className="modalSectionHead">Total Words</h4>
            <h5 className="statNumber">{apiData[category]}</h5>
          </>
        );
      } else {
        response.push(
          <>
            <h4 className="modalSectionHead">{category}</h4>
            <div className="statChart">
              <WordPieChart dataset={apiData[category]} />
            </div>
          </>
        );
      }
    }
    return response;
  }

  return (
    <dialog id="statsModal">
      <button
        className="modalClose"
        onClick={() => {
          document.getElementById("statsModal").close();
        }}
      >
        <i className="bi bi-x-circle-fill"></i>
      </button>
      <h2 className="modalTitle">Beeyond Stats</h2>
      <p>
        Below you will find statistics for the words you have attempted in
        Beeyond Words.
      </p>
      <p>
        These statistics represent the percentage of answers that were correct
        in each category.
      </p>
      <p>
        The statistics are compiled from both games and presented together as
        one result.
      </p>
      <BarGraph data={sample} title="Parts of Speech" />
      {apiData && mapData().map((div, idx) => <div key={idx}>{div}</div>)}
    </dialog>
  );
}
