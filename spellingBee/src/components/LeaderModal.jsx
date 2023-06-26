import PropTypes from 'prop-types';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './Modals.css'

export default function LeaderModal({userData}) {
    const [board, setBoard] = useState(null)

    async function getBoard() {
        const all = await axios.get('https://beeyondwords.vercel.app/users/leaderboard/all');
        const spelling = await axios.get('https://beeyondwords.vercel.app/users/leaderboard/spelling');
        const definitions = await axios.get('https://beeyondwords.vercel.app/users/leaderboard/definitions');
        const compare = await axios.get('https://beeyondwords.vercel.app/users/leaderboard/compare');
        setBoard({
            overall: all.data,
            spelling: spelling.data,
            definitions: definitions.data,
            compare: compare.data
        })
    }

    useEffect(()=>{
        getBoard()
    }, [userData])

    return (
        <dialog id="leaderModal">
            <button 
                className='modalClose'
                onClick={()=>{
                    document.getElementById('leaderModal').close();
                }}><i className="bi bi-x-circle-fill"></i></button>
            <h2 className='modalTitle'>Beeyond Leaders</h2>
            <h4 className='modalSectionHead'>Overall Score</h4>
            {board && board.overall.map((entry, idx) => (
                <p className='gameData' key={entry.name+idx}>
                    <span>{entry.name}</span>
                    <span>{entry.score}</span>
                </p>
            ))}
            <h4 className='modalSectionHead'>Spelling</h4>
            {board && board.spelling.map((entry, idx) => (
                <p className='gameData' key={entry.name+idx}>
                    <span>{entry.name}</span>
                    <span>{entry.score}</span>
                </p>
            ))}
            <h4 className='modalSectionHead'>Definitions</h4>
            {board && board.definitions.map((entry, idx) => (
                <p className='gameData' key={entry.name+idx}>
                    <span>{entry.name}</span>
                    <span>{entry.score}</span>
                </p>
            ))}
            <h4 className='modalSectionHead'>Compare</h4>
            {board && board.compare.map((entry, idx) => (
                <p className='gameData' key={entry.name+idx}>
                    <span>{entry.name}</span>
                    <span>{entry.score}</span>
                </p>
            ))}
        </dialog>
    )
}

LeaderModal.propTypes = {
    userData: PropTypes.object
}