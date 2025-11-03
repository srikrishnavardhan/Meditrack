import './Modal.css'

function Modal({ isOpen, onClose, title, children, type = 'info', showCancel = false, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${type}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    {showCancel ? (
                        <>
                            <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancel</button>
                            <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>OK</button>
                        </>
                    ) : (
                        <button className="modal-btn modal-btn-confirm" onClick={onClose}>OK</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modal;
