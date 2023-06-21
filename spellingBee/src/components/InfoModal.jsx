import './Modals.css'

export default function InfoModal() {

    return (
        <dialog id="infoModal">
            <button 
                className='modalClose'
                onClick={()=>{
                    document.getElementById('infoModal').close();
                }}><i className="bi bi-x-circle-fill"></i></button>
            <h2 className='modalTitle'>Beeyond App Info</h2>
        </dialog>
    )
}