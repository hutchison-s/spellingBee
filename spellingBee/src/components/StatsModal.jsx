import PropTypes from 'prop-types';
import "./Modals.css";
import { useEffect, useState } from 'react';
import BarGraph from "./charts/BarGraph";

export default function StatsModal({userData}) {
  const [stats, setStats] = useState(null)
  
  function getStats() {
    const userStats = {
        games: {},
        part: {},
        etym: {},
        words: 0
    }

    for (const game in userData) {
        for (const w of userData[game].correctWords) {
            userStats.words++
            if (!userStats.part[w.part_of_speech]) {
                userStats.part[w.part_of_speech] = {
                    correct: 1,
                    wrong: 0
                }   
            } else {
                userStats.part[w.part_of_speech].correct += 1;
            }
            if (!userStats.etym[w.etymology]) {
                userStats.etym[w.etymology] = {
                    correct: 1,
                    wrong: 0
                }   
            } else {
                userStats.etym[w.etymology].correct += 1;
            }
            if (!userStats.games[game]) {
              userStats.games[game] = {
                  correct: 1,
                  wrong: 0
              }   
          } else {
              userStats.games[game].correct += 1;
          }
        }
        for (const w of userData[game].wrongWords) {
            userStats.words++
            if (!userStats.part[w.part_of_speech]) {
                userStats.part[w.part_of_speech] = {
                    correct: 0,
                    wrong: 1
                }   
            } else {
                userStats.part[w.part_of_speech].wrong += 1;
            }
            if (!userStats.etym[w.etymology]) {
                userStats.etym[w.etymology] = {
                    correct: 0,
                    wrong: 1
                }   
            } else {
                userStats.etym[w.etymology].wrong += 1;
            }
            if (!userStats.games[game]) {
              userStats.games[game] = {
                  correct: 0,
                  wrong: 1
              }   
          } else {
              userStats.games[game].wrong += 1;
          }
        }
    }

    const partsData = {}
    for (const part in userStats.part) {
        partsData[part] = (userStats.part[part].correct / (userStats.part[part].correct + userStats.part[part].wrong)).toFixed(2) * 100
    }
    const etymologyData = {};
    for (const lang in userStats.etym) {
        etymologyData[lang] = (userStats.etym[lang].correct / (userStats.etym[lang].correct + userStats.etym[lang].wrong)).toFixed(2) * 100
    }
    const gamesData = {};
    for (const game in userStats.games) {
        gamesData[game] = (userStats.games[game].correct / (userStats.games[game].correct + userStats.games[game].wrong)).toFixed(2) * 100
    }
    return {totalWords: userStats.words, parts_of_speech: partsData, etymologies: etymologyData, games: gamesData}

  }

  useEffect(()=>{
    setStats(getStats())
    console.log(userData)
  }, [userData])


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
      {stats
        ?   <>
                <h2 className="modalSectionHead">Total Words:</h2>
                <h3>{stats.totalWords}</h3>
                <BarGraph data={stats.games} title='Games' />
                <BarGraph data={stats.parts_of_speech} title='Parts of Speech' />
                <BarGraph data={stats.etymologies} title='Etymologies' />
            </>
        :   <p>No Stats to Display</p>}
    </dialog>
  );
}

StatsModal.propTypes = {
    userData: PropTypes.object
}