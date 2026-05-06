function PageHint({ message, onClose }) {
    return (
        <div style={{
            backgroundColor: 'var(--color-brand)',
            color: 'white',
            padding: 'var(--space-3)',
            borderRadius: '8px',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            justifyContent: 'space-between', 
            alignItems: 'center'
        }}>
            <p>💡 {message}</p>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.2rem',
                    cursor: 'pointer'
                }}
            >
                ✕      {/* Disable button: X */}
            </button> 
        </div>
    );
}

export default PageHint;