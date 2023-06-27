import PropTypes from 'prop-types'
import './Modals.css'

export default function NewNameModal({onClick}) {

    function onSubmit(e) {
        e.preventDefault();
        if (e.target.gamerNameInput.value !== '') {
            onClick(e.target.gamerNameInput.value);
        }
        e.target.reset();
    }

    return (
        <dialog id="newName">
            <img src="/bee-honey-icon.svg" alt="bee logo" />
            <h3 className="modalSectionHead">Choose a Display Name</h3>
            <form onSubmit={onSubmit}>
                <label htmlFor="gamerNameInput"><small>Letters and numbers only, 2-14 characters</small></label>
                <input type="text" pattern='^[A-Za-z\d]{2,14}$' name='gamerNameInput' id='gamerNameInput'/>
                <button type='submit'>Continue</button>
            </form>
        </dialog>
    )
}

NewNameModal.propTypes = {
    onClick: PropTypes.func
}