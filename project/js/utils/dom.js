// js/utils/dom.js
export function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
};

export function formatDate(timestamp) {
    if (!timestamp) {
        console.warn('Timestamp is undefined or null');
        return 'Date inconnue';
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', timestamp);
        return 'Date invalide';
    }

    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// ... autres fonctions utilitaires ...
