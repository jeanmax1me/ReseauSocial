// js/utils/dom.js

// Fonction pour créer un élément DOM avec une classe et un contenu textuel optionnels
export function createElement(tag, className, textContent) {
    const element = document.createElement(tag); // Création de l'élément
    if (className) element.className = className; // Ajout de la classe si fournie
    if (textContent) element.textContent = textContent; // Ajout du contenu textuel si fourni
    return element; // Retourne l'élément créé
};

// Fonction pour formater un timestamp en une chaîne de date lisible
export function formatDate(timestamp) {
    if (!timestamp) {
        console.warn('Timestamp is undefined or null'); // Avertissement si le timestamp est invalide
        return 'Date inconnue'; // Retourne une date par défaut
    }

    const date = new Date(timestamp); // Création d'un objet Date à partir du timestamp
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', timestamp); // Erreur si le timestamp est invalide
        return 'Date invalide'; // Retourne une date par défaut
    }

    // Retourne la date formatée en français
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// ... autres fonctions utilitaires ...
