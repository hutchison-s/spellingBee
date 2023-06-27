import PropTypes from "prop-types";
import "./Modals.css";

export default function UserModal({ logOut, profile, userData, setUserData }) {
  function levelToWord(level) {
    switch (level) {
      case 3:
        return "Novice";
      case 5:
        return "Beginner";
      case 8:
        return "Skilled";
      case 12:
        return "Advanced";
      case 16:
        return "Expert";
    }
  }

  const initialUserData = {
    spelling: {
      score: 0,
      level: 3,
      correctWords: [],
      wrongWords: [],
    },
    definitions: {
      score: 0,
      level: 3,
      correctWords: [],
      wrongWords: [],
    },
    compare: {
      score: 0,
      level: 3,
      correctWords: [],
      wrongWords: [],
    },
  };

  return (
    <dialog id="userModal">
      <button
        className="modalClose"
        onClick={() => {
          document.getElementById("userModal").close();
        }}
      >
        <i className="bi bi-x-circle-fill"></i>
      </button>
      <h2 className="modalTitle">User Profile</h2>
      {profile && profile.picture && (
        <img className="userPhoto" src={profile.picture} alt="user photo" />
      )}
      <p>{profile && profile.name}</p>
      <p>{profile && profile.gamerName} <button id="editNameBtn" onClick={()=>{document.getElementById('newName').showModal()}}><i className="bi bi-pencil"></i></button></p>
      <h4 className="modalSectionHead">Progress</h4>
      <h5 className="modalSubHead">Spelling</h5>
      <p className="gameData">
        <span>Level: {levelToWord(userData.spelling.level)}</span>
        <span>Score: {userData.spelling.score}</span>
      </p>
      <h5 className="modalSubHead">Definitions</h5>
      <p className="gameData">
        <span>Level: {levelToWord(userData.definitions.level)}</span>
        <span>Score: {userData.definitions.score}</span>
      </p>
      <h5 className="modalSubHead">Compare</h5>
      <p className="gameData">
        <span>Level: {levelToWord(userData.compare.level)}</span>
        <span>Score: {userData.compare.score}</span>
      </p>
      <h4 className="modalSectionHead">Email</h4>
      <p>{profile && profile.email}</p>

      <button className="logoutBtn" onClick={logOut}>
        Log Out
      </button>
      
      <div><button className="resetBtn" onClick={()=>{setUserData(initialUserData)}}>Erase All Progress</button></div>
    </dialog>
  );
}

UserModal.propTypes = {
  logOut: PropTypes.func,
  profile: PropTypes.object,
  userData: PropTypes.object,
  setUserData: PropTypes.func
};
