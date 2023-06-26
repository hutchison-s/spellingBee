import PropTypes from 'prop-types';
import { useState, useEffect } from 'react'
import axios from 'axios';
import Spelling from './components/Spelling';
import Definitions from './components/Definitions';
import StatsModal from './components/StatsModal';
import UserModal from './components/UserModal';
import InfoModal from './components/InfoModal';
import Compare from './components/Compare';



export default function Games({logOut, profile, userData, setUserData, apiKey}) {
    const [currentApp, setCurrentApp] = useState('Spelling')
    const [isDropDownOpen, setIsDropdownOpen] = useState(false);
    let config = {method: 'post', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': apiKey}}

    useEffect(()=>{
        if (profile) {
            axios.post('https://beeyondwords.vercel.app/users/'+profile.sub, userData, config)
                .catch(err => console.log(err))
        }
    }, [userData])

    function returnApp(choice) {
        switch (choice) {
        case 'Spelling':
            return <Spelling userData={userData} setUserData={setUserData} apiKey={apiKey}/>;
        case 'Definitions':
            return <Definitions userData={userData} setUserData={setUserData} apiKey={apiKey}/>;
        case 'Compare':
            return <Compare userData={userData} setUserData={setUserData} apiKey={apiKey}/>
        }
    }

    function handleAppSelect(e) {
        setCurrentApp(e.target.innerHTML);
        setIsDropdownOpen(false);
    }

    return (
        <>
            <header>
                <div className="logoContainer">
                <img className='logoIcon' src="/bee-honey-icon.svg" alt="Beeyond" />
                <h1 className="title">
                    <span className="logoFont">Beeyond</span>
                </h1>
                <div id="appSelector" className='appFont' onClick={()=>{setIsDropdownOpen(!isDropDownOpen)}}>
                    {currentApp}
                    <button >
                        {isDropDownOpen ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
                    </button>
                    <div className={isDropDownOpen ? "dropdown" : "dropdown hidden"}>
                        <div className='appOption' onClick={handleAppSelect}>Spelling</div>
                        <div className='appOption' onClick={handleAppSelect}>Definitions</div>
                        <div className='appOption' onClick={handleAppSelect}>Compare</div>
                    </div>
                </div>
                </div>
            </header>
            {returnApp(currentApp)}
            <StatsModal userData={userData}/>
            <UserModal logOut={logOut} profile={profile} userData={userData}/>
            <InfoModal />
            <footer>
                <nav>
                <div><a onClick={()=>{document.getElementById('userModal').showModal()}}><i className="bi bi-person-circle"></i></a></div>
                <div><a onClick={()=>{document.getElementById('statsModal').showModal()}}><i className="bi bi-bar-chart-line-fill"></i></a></div>
                <div><a onClick={()=>{document.getElementById('infoModal').showModal()}}><i className="bi bi-info-circle"></i></a></div>
                </nav>
            </footer>
        </>
    )
}

Games.propTypes = {
    logOut: PropTypes.func,
    profile: PropTypes.object,
    userData: PropTypes.object,
    setUserData: PropTypes.func,
    apiKey: PropTypes.string
}