import PropTypes from 'prop-types'
import './Modals.css'

export default function NewNameModal({onClick}) {
    return (
        <dialog id="newName">
            <img src="/bee-honey-icon.svg" alt="bee logo" />
            <h3 className="modalSectionHead">Choose a Display Name</h3>
            <input type="text" minLength={2} maxLength={14} />
            <button
            onClick={(e) =>
                onClick(e.target.parentNode.querySelector("input").value)
            }
            >
            Continue
            </button>
        </dialog>
    )
}

NewNameModal.propTypes = {
    onClick: PropTypes.func
}