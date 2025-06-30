// --- ФАЙЛ: js/toast.js ---
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) { existingToast.remove(); }
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    let backgroundColor;
    switch (type) {
        case 'success': backgroundColor = '#10B981'; break;
        case 'error': backgroundColor = '#EF4444'; break;
        default: backgroundColor = '#374151'; break;
    }
    Object.assign(toast.style, {
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        padding: '12px 20px', borderRadius: '0.5rem', backgroundColor: backgroundColor,
        color: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: '1000',
        opacity: '0', transition: 'opacity 0.3s ease, bottom 0.3s ease'
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; toast.style.bottom = '30px'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '20px';
        setTimeout(() => { if (toast.parentElement) toast.parentElement.removeChild(toast); }, 300);
    }, 3500);
}