import "./Modals.css";

export default function InfoModal() {
  return (
    <dialog id="infoModal">
      <button
        className="modalClose"
        onClick={() => {
          document.getElementById("infoModal").close();
        }}
      >
        <i className="bi bi-x-circle-fill"></i>
      </button>
      <h2 className="modalTitle">Beeyond Info</h2>
      <h3 className="modalSectionHead">Toolbar</h3>
      <p>
        Clicking on any of the icons in the toolbar will open a modal to
        interact with the tools&apos; contents.
      </p>
      <p>
        To return to the game, close the modal with the button on the top right
        of the modal.
      </p>
      <table>
        <thead>
          <tr>
            <th className="modalSubHead">Icon</th>
            <th className="modalSubHead">Feature</th>
          </tr>
        </thead>
        <tbody>
          <tr>
          <td style={{fontSize: "xx-large"}}>
              <i className="bi bi-person-circle"></i>
            </td>
            <td>Profile Details & Logout Button</td>
          </tr>
          <tr>
            <td style={{fontSize: "xx-large"}}>
              <i className="bi bi-bar-chart-fill"></i>
            </td>
            <td>Personalized User Stats</td>
          </tr>
          <tr>
          <td style={{fontSize: "xx-large"}}>
              <i className="bi bi-trophy"></i>
            </td>
            <td>Leaderboards & Badges</td>
          </tr>
          <tr>
          <td style={{fontSize: "xx-large"}}>
              <i className="bi bi-info-circle"></i>
            </td>
            <td>App Info & Instructions</td>
          </tr>
        </tbody>
      </table>
      <h3 className="modalSectionHead">Features</h3>
      <ul className="modalList">
        <li>Three Language-Learning Apps</li>
        <li>Login with Google to save progress</li>
        <li>Five levels of increasing difficulty</li>
        <li>Points for each correct answer</li>
        <li>Leaderboard for overall score and by game</li>
      </ul>
      <h3 className="modalSectionHead">Spelling</h3>
      <p>
        Beeyond Spelling gamifies spelling practice, mimicking a spelling bee
        format. It helps users enhance vocabulary, improve spelling accuracy,
        develop word recognition skills, and boost language confidence.
        It&apos;s an engaging and effective tool for refining spelling
        proficiency.
      </p>
      <h4 className="modalSubHead">Tips</h4>
      <ul className="modalList">
        <li>Words and prompts are spoken. Volume up.</li>
        <li>
          Use prompt buttons to hear the word spoken again, or get clarification
          prompts.
        </li>
        <li>Capitalization does not matter.</li>
        <li>
          Click <em>Check</em> or press <em>Enter</em> key to submit response.
        </li>
        <li>
          If incorrect, the correct spelling will be displayed above the input
          box before continuing.
        </li>
      </ul>
      <h3 className="modalSectionHead">Definitions</h3>
      <p>
        Beeyond Definitions is an effective and engaging tool for expanding
        vocabulary skills. Users select the correct definition for a given word,
        enhancing their understanding and knowledge of words and their meanings.
        It enhances language skills, expands word knowledge, and offers an
        interactive way to practice and improve comprehension.{" "}
      </p>
      <h4 className="modalSubHead">Tips</h4>
      <ul className="modalList">
        <li>Words are displayed and spoken.</li>
        <li>Choose correct definition from options in blue.</li>
        <li>
          If incorrect, the correct definition will be highlighted before
          continuing.
        </li>
      </ul>
      <h3 className="modalSectionHead">Compare</h3>
      <p>
        Beeyond Compare sharpens users&apos; cognitive and linguistic skills by
        stimulating their critical thinking and honing their ability to discern
        the relationship between words, fostering vocabulary growth and a deeper
        comprehension of word meanings.
      </p>
      <h4 className="modalSubHead">Tips</h4>
      <ul className="modalList">
        <li>Words are displayed and spoken.</li>
        <li>
          Choose whether the displayed words are
          <ul>
            <li>synonyms &#40;similar in meaning&#41;</li>
            <li>antonyms &#40;opposite in meaning&#41;</li>
            <li>unrelated</li>
          </ul>
        </li>
        <li>
          If answered incorrectly, the correct answer will be highlighted before
          continuing.
        </li>
      </ul>
      <h3 className="modalSectionHead">Score & Levels</h3>
      <h4 className="modalSubHead">Levels</h4>
      <ul className="modalList">
        <li>
          There are five levels of achievement:
          <ul>
            <li>Novice</li>
            <li>Beginner</li>
            <li>Skilled</li>
            <li>Advanced</li>
            <li>Expert</li>
          </ul>
        </li>
        <li>
          In order to advance to the next level, you must have a streak of 10
          answers in a row correct at your current level.
        </li>
        <li>
          Skipping a word, logging out, refreshing, or giving an incorrect
          response starts your streak over.
        </li>
        <li>
          Words provided are appropriate for your current level of achievement,
          and will have higher point values as you advance.
        </li>
        <li>
          Your level for each game is saved to your profile automatically.
        </li>
      </ul>
      <h4 className="modalSubHead">Score</h4>
      <ul className="modalList">
        <li>Each word has a point value displayed.</li>
        <li>
          Correct answers increase your score by the word&apos;s point value.
        </li>
        <li>
          Incorrect answers decrease your score by the word&apos;s point value.
        </li>
        <li>
          Your score for each game is saved to your profile automatically and
          accumulates as you play.
        </li>
      </ul>
    </dialog>
  );
}
