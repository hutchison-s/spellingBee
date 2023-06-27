import PropTypes from 'prop-types'
import './Modals.css'

export default function DeleteAccountModal({onConfirm, onCancel}) {

    return (
        <dialog id="deleteAccount">
            <h3>Are you sure you want to delete your account?</h3>
            <p>All account progress and stats will be permanently deleted and your information will be removed from our system.</p>
                <button onClick={onConfirm}>DELETE</button>
                <button onClick={onCancel}>CANCEL</button>
        </dialog>
    )
}

DeleteAccountModal.propTypes = {
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func
}