// js/components/Messaging.js
class Messaging {
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

    createConversationElement(conversation) {
        const convEl = createElement('div', 'conversation-item neu-card');
        convEl.onclick = () => this.selectConversation(conversation);

        const profilePic = createElement('img', 'profile-picture');
        profilePic.src = conversation.with.profilePicture;
        profilePic.alt = conversation.with.name;

        const info = createElement('div', 'conversation-info');

        const header = createElement('div', 'conversation-header');
        header.appendChild(createElement('span', 'name', conversation.with.name));

        const statusDot = createElement('span', `status-dot ${conversation.with.status}`);
        header.appendChild(statusDot);

        info.appendChild(header);

        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (lastMessage) {
            const preview = createElement('p', 'message-preview', lastMessage.content);
            const time = createElement('span', 'timestamp', formatDate(lastMessage.timestamp));
            info.appendChild(preview);
            info.appendChild(time);
        }

        convEl.appendChild(profilePic);
        convEl.appendChild(info);
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
        const isOwn = message.senderId === this.currentUserId;
        const messageEl = createElement('div', `message ${isOwn ? 'own' : 'other'}`);

        const bubble = createElement('div', 'message-bubble neu-card');
        bubble.appendChild(createElement('p', 'message-content', message.content));
        bubble.appendChild(createElement('span', 'timestamp', formatDate(message.timestamp)));

        messageEl.appendChild(bubble);
        return messageEl;
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
            const messageEl = this.createMessageElement(newMessage);
            this.messagesContainer.appendChild(messageEl);
            this.scrollToBottom();
            input.value = '';
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}