// js/components/Messaging.js
import { createElement } from '../utils/dom.js';

export class Messaging {
    constructor() {
        this.conversations = [];
        this.currentConversation = null;
        this.currentUserId = 1; // Simuler l'utilisateur connecté

        this.conversationsList = document.querySelector('.conversations-list');
        this.chatWindow = document.querySelector('.chat-window');
        this.messagesContainer = document.querySelector('.messages-container');
        this.messageForm = document.querySelector('.message-form');
        this.chatHeader = document.querySelector('.chat-header');

        this.initEventListeners();
    }

    async init() {
        try {
            const response = await fetch('../assets/data/messages.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.conversations = data.conversations;
            this.renderConversationsList();
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
        }
    }

    initEventListeners() {
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
    }

    renderConversationsList() {
        this.conversationsList.innerHTML = '';
        this.conversations.forEach(conv => {
            const convEl = this.createConversationElement(conv);
            this.conversationsList.appendChild(convEl);
        });
    }

    createConversationElement(conv) {
        const convEl = createElement('div', 'conversation-item neu-card');
        const profileImg = createElement('img', 'profile-picture');
        profileImg.src = conv.with.profilePicture;
        profileImg.alt = conv.with.name;

        const info = createElement('div', 'conversation-info');
        info.appendChild(createElement('div', 'conversation-name', conv.with.name));

        const lastMessage = conv.messages[conv.messages.length - 1];
        const messagePreview = createElement('div', 'conversation-preview', lastMessage.content);
        info.appendChild(messagePreview);

        convEl.appendChild(profileImg);
        convEl.appendChild(info);

        convEl.addEventListener('click', () => this.showConversation(conv.id));

        return convEl;
    }

    selectConversation(conversation) {
        this.currentConversation = conversation;
        this.renderChatHeader();
        this.renderMessages();
        this.chatWindow.classList.add('active');
    }

    renderChatHeader() {
        this.chatHeader.innerHTML = '';
        const contact = this.currentConversation.with;

        const profilePic = createElement('img', 'profile-picture');
        profilePic.src = contact.profilePicture;
        profilePic.alt = contact.name;

        const info = createElement('div', 'contact-info');
        info.appendChild(createElement('span', 'name', contact.name));

        const statusDot = createElement('span', `status-dot ${contact.status}`);
        const status = createElement('span', 'status-text', contact.status);

        info.appendChild(createElement('div', 'status-container').appendChild(statusDot));
        info.appendChild(status);

        this.chatHeader.appendChild(profilePic);
        this.chatHeader.appendChild(info);
    }

    renderMessages() {
        this.messagesContainer.innerHTML = '';
        this.currentConversation.messages.forEach(message => {
            const messageEl = this.createMessageElement(message);
            this.messagesContainer.appendChild(messageEl);
        });
        this.scrollToBottom();
    }

    createMessageElement(message) {
        const messageEl = createElement('div', `message ${message.senderId === this.currentUserId ? 'own' : ''}`);
        messageEl.appendChild(createElement('p', 'message-content', message.content));
        messageEl.appendChild(createElement('span', 'timestamp', this.formatDate(message.timestamp)));
        return messageEl;
    }

    formatDate(timestamp) {
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
        const input = this.messageForm.querySelector('.message-input');
        const content = input.value.trim();
        if (content && this.currentConversation) {
            const newMessage = {
                id: Date.now(),
                senderId: this.currentUserId,
                content: content,
                timestamp: new Date().toISOString()
            };
            this.currentConversation.messages.push(newMessage);
            this.renderConversation();
            input.value = '';

            // Update the conversation list to show the new last message
            this.renderConversationsList();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showConversation(conversationId) {
        this.currentConversation = this.conversations.find(conv => conv.id === conversationId);
        this.renderConversation();
    }

    renderConversation() {
        if (!this.currentConversation) return;

        this.chatHeader.innerHTML = '';
        this.messagesContainer.innerHTML = '';

        // Render chat header
        const headerEl = createElement('div', 'chat-header');
        const profileImg = createElement('img', 'profile-picture');
        profileImg.src = this.currentConversation.with.profilePicture;
        profileImg.alt = this.currentConversation.with.name;
        headerEl.appendChild(profileImg);
        headerEl.appendChild(createElement('span', 'name', this.currentConversation.with.name));
        this.chatHeader.appendChild(headerEl);

        // Render messages
        this.currentConversation.messages.forEach(message => {
            const messageEl = this.createMessageElement(message);
            this.messagesContainer.appendChild(messageEl);
        });

        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}
