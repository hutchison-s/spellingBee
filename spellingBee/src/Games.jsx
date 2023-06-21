import PropTypes from 'prop-types';
import { useState, useEffect } from 'react'
import axios from 'axios';
import Spelling from './components/Spelling';
import Definitions from './components/Definitions';
import StatsModal from './components/StatsModal';
import UserModal from './components/UserModal';



export default function Games({logOut, profile, userData, setUserData}) {
    const [currentApp, setCurrentApp] = useState('Spelling')
    let config = {method: 'post', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic c3BlbGxpbmdiZWU6Y2hhbXBpb24xMDAh'}}

    useEffect(()=>{
        if (profile) {
            axios.post('https://beeyondwords.vercel.app/users/'+profile.sub, userData, config)
                .catch(err => console.log(err))
        }
    }, [userData])

    function returnApp(choice) {
        switch (choice) {
        case 'Spelling':
            return <Spelling userData={userData} setUserData={setUserData}/>;
        case 'Definitions':
            return <Definitions userData={userData} setUserData={setUserData}/>
        }
    }

    return (
        <>
            <header>
                <div className="logoContainer">
                <img className='logoIcon' src="/bee-honey-icon.svg" alt="Beeyond" />
                <h1 className="title">
                    <span className="logoFont">Beeyond</span>
                </h1>
                <select name="appChoice" id="appChoice" className='appFont' defaultValue='Spelling' onInput={(e)=>{setCurrentApp(e.target.value)}}>
                <option value="Spelling">Spelling</option>
                <option value="Definitions">Definitions</option>
                </select>
                </div>
            </header>
            {returnApp(currentApp)}
            <StatsModal />
            <UserModal logOut={logOut} profile={profile} userData={userData}/>
            <footer>
                <nav>
                <div><a onClick={()=>{document.getElementById('userModal').showModal()}}><i className="bi bi-person-circle"></i></a></div>
                <div><a onClick={()=>{document.getElementById('statsModal').showModal()}}><i className="bi bi-bar-chart-line-fill"></i></a></div>
                <div><a href="###"><i className="bi bi-info-circle"></i></a></div>
                </nav>
            </footer>
        </>
    )
}

Games.propTypes = {
    logOut: PropTypes.func,
    profile: PropTypes.object,
    userData: PropTypes.object,
    setUserData: PropTypes.func
}