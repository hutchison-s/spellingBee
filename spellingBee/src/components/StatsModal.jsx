import axios from 'axios';
import { useState, useEffect } from "react";
import WordPieChart from "./WordPieChart";
import './StatsModal.css'

export default function StatsModal() {

    const [apiData, setApiData] = useState({})

    useEffect(()=>{
        axios.get('https://beeyondwords.vercel.app/api/stats').then(res => {
            setApiData(res.data)
        })
    }, [])

    function mapData() {
        const response = [];
        for (const category in apiData) {
            if (category === "words") {
                response.push(
                    <>
                        <h4 className='statHead'>Total Words</h4>
                        <h5 className='statNumber'>{apiData[category]}</h5>
                    </>
                )
            } else {
                response.push(
                        <>
                        <h4 className='statHead'>{category}</h4>
                        <div className="statChart">
                            <WordPieChart dataset={apiData[category]}/>
                        </div>
                        </>
                )
            }
        }
        return response;
    }

    return (
        <dialog id="statsModal">
            <button 
                id="statModalClose"
                onClick={()=>{
                    document.getElementById('statsModal').close();
                }}><i className="bi bi-x-circle-fill"></i></button>
            <h2 className='modalTitle'>Beeyond Words API Stats</h2>
            {apiData && mapData().map((div, idx) => <div key={idx}>{div}</div>)}
        </dialog>
    )
}