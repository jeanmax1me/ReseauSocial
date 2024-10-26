// js/components/Messaging.js
import { createElement } from '../utils/dom.js';

export class Messaging {
    constructor() {
        this.conversations = []; // Liste des conversations
        this.currentConversation = null; // Conversation actuellement sélectionnée
        this.currentUserId = 1; // Simuler l'utilisateur connecté

        // Sélection des éléments DOM pour les conversations et le chat
        this.conversationsList = document.querySelector('.conversations-list');
        this.chatWindow = document.querySelector('.chat-window');
        this.messagesContainer = document.querySelector('.messages-container');
        this.messageForm = document.querySelector('.message-form');
        this.chatHeader = document.querySelector('.chat-header');

        this.initEventListeners(); // Initialisation des écouteurs d'événements
    }

    async init() {
        try {
            // Chargement des conversations depuis le fichier JSON
            const response = await fetch('../assets/data/messages.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.conversations = data.conversations; // Stockage des conversations
            this.renderConversationsList(); // Rendu de la liste des conversations
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
        }
    }

    initEventListeners() {
        // Écouteur d'événements pour l'envoi de messages
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Empêche le rechargement de la page
            this.sendMessage(); // Appel de la fonction d'envoi de message
        });
    }

    renderConversationsList() {
        // Rendu de la liste des conversations
        this.conversationsList.innerHTML = ''; // Nettoyage de la liste
        this.conversations.forEach(conv => {
            const convEl = this.createConversationElement(conv); // Création de l'élément de conversation
            this.conversationsList.appendChild(convEl); // Ajout à la liste
        });
    }

    createConversationElement(conv) {
        // Création d'un élément pour une conversation
        const convEl = createElement('div', 'conversation-item neu-card');
        const profileImg = createElement('img', 'profile-picture');
        profileImg.src = conv.with.profilePicture; // Image de profil de l'ami
        profileImg.alt = conv.with.name;

        const info = createElement('div', 'conversation-info');
        info.appendChild(createElement('div', 'conversation-name', conv.with.name)); // Nom de l'ami

        const lastMessage = conv.messages[conv.messages.length - 1]; // Dernier message
        const messagePreview = createElement('div', 'conversation-preview', lastMessage.content); // Aperçu du dernier message
        info.appendChild(messagePreview);

        convEl.appendChild(profileImg);
        convEl.appendChild(info);

        // Écouteur d'événements pour sélectionner la conversation
        convEl.addEventListener('click', () => this.showConversation(conv.id));

        return convEl; // Retourne l'élément de conversation
    }

    selectConversation(conversation) {
        // Sélectionne une conversation et affiche ses détails
        this.currentConversation = conversation;
        this.renderChatHeader(); // Rendu de l'en-tête de la conversation
        this.renderMessages(); // Rendu des messages de la conversation
        this.chatWindow.classList.add('active'); // Affiche la fenêtre de chat
    }

    renderChatHeader() {
        // Rendu de l'en-tête de la conversation
        this.chatHeader.innerHTML = ''; // Nettoyage de l'en-tête
        const contact = this.currentConversation.with; // Contact de la conversation

        const profilePic = createElement('img', 'profile-picture');
        profilePic.src = contact.profilePicture; // Image de profil du contact
        profilePic.alt = contact.name;

        const info = createElement('div', 'contact-info');
        info.appendChild(createElement('span', 'name', contact.name)); // Nom du contact

        const statusDot = createElement('span', `status-dot ${contact.status}`); // Indicateur de statut
        const status = createElement('span', 'status-text', contact.status); // Texte du statut

        info.appendChild(createElement('div', 'status-container').appendChild(statusDot));
        info.appendChild(status);

        this.chatHeader.appendChild(profilePic);
        this.chatHeader.appendChild(info);
    }

    renderMessages() {
        // Rendu des messages de la conversation sélectionnée
        this.messagesContainer.innerHTML = ''; // Nettoyage de la zone des messages
        this.currentConversation.messages.forEach(message => {
            const messageEl = this.createMessageElement(message); // Création de l'élément de message
            this.messagesContainer.appendChild(messageEl); // Ajout du message à la zone
        });
        this.scrollToBottom(); // Défilement vers le bas
    }

    createMessageElement(message) {
        // Création d'un élément pour un message
        const messageEl = createElement('div', `message ${message.senderId === this.currentUserId ? 'own' : ''}`); // Vérifie si le message est de l'utilisateur actuel
        messageEl.appendChild(createElement('p', 'message-content', message.content)); // Contenu du message
        messageEl.appendChild(createElement('span', 'timestamp', this.formatDate(message.timestamp))); // Horodatage du message
        return messageEl; // Retourne l'élément de message
    }

    formatDate(timestamp) {
        // Formatage de la date pour l'affichage
        const date = new Date(timestamp);
        return date.toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    sendMessage() {
        // Envoi d'un nouveau message
        const input = this.messageForm.querySelector('.message-input'); // Sélection de l'input
        const content = input.value.trim(); // Contenu du message
        if (content && this.currentConversation) {
            const newMessage = {
                id: Date.now(), // ID unique basé sur le timestamp
                senderId: this.currentUserId, // ID de l'utilisateur actuel
                content: content, // Contenu du message
                timestamp: new Date().toISOString() // Horodatage
            };
            this.currentConversation.messages.push(newMessage); // Ajout du message à la conversation
            this.renderConversation(); // Rendu de la conversation
            input.value = ''; // Réinitialisation de l'input

            // Mise à jour de la liste des conversations pour afficher le dernier message
            this.renderConversationsList();
        }
    }

    scrollToBottom() {
        // Défilement automatique vers le bas de la zone des messages
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showConversation(conversationId) {
        // Affichage d'une conversation spécifique
        this.currentConversation = this.conversations.find(conv => conv.id === conversationId);
        this.renderConversation(); // Rendu de la conversation
    }

    renderConversation() {
        // Rendu complet d'une conversation (en-tête et messages)
        if (!this.currentConversation) return; // Vérifie si une conversation est sélectionnée

        this.chatHeader.innerHTML = ''; // Nettoyage de l'en-tête
        this.messagesContainer.innerHTML = ''; // Nettoyage de la zone des messages

        // Rendu de l'en-tête de la conversation
        const headerEl = createElement('div', 'chat-header');
        const profileImg = createElement('img', 'profile-picture');
        profileImg.src = this.currentConversation.with.profilePicture; // Image de profil
        profileImg.alt = this.currentConversation.with.name;
        headerEl.appendChild(profileImg);
        headerEl.appendChild(createElement('span', 'name', this.currentConversation.with.name)); // Nom du contact
        this.chatHeader.appendChild(headerEl);

        // Rendu des messages
        this.currentConversation.messages.forEach(message => {
            const messageEl = this.createMessageElement(message); // Création de l'élément de message
            this.messagesContainer.appendChild(messageEl); // Ajout du message à la zone
        });

        // Défilement vers le bas
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}
