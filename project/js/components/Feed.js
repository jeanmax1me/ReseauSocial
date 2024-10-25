import { createElement, formatDate } from '../utils/dom.js';
import { ParticleSystem } from '../utils/particles.js';

export class Feed {
    constructor() {
        this.particleSystem = new ParticleSystem();
        this.posts = [];
        this.container = document.getElementById('posts-container');
    }

    async init() {
        try {
            const response = await fetch('./assets/data/posts.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            this.posts = data.posts;
            this.render();
        } catch (error) {
            console.error('Erreur lors du chargement des posts:', error);
        }
    }

    createPostElement(post) {
        console.log('Creating post element:', post); // Debug log
        const postEl = createElement('article', 'neu-card post');

        // Header
        console.log('Author data:', post.author); // Debug log
        const header = this.createHeader(post.author, post.timestamp);
        postEl.appendChild(header);

        // Content
        const content = createElement('p', 'post-content', post.content);
        postEl.appendChild(content);

        // Image
        if (post.image) {
            const imgContainer = this.createImageContainer(post.image);
            postEl.appendChild(imgContainer);
        }

        // Reactions
        const reactions = this.createReactions(post);
        postEl.appendChild(reactions);

        // Comments Section
        const commentsSection = this.createCommentsSection(post);
        postEl.appendChild(commentsSection);

        return postEl;
    }

    createHeader(author, timestamp) {
        const header = createElement('div', 'post-header');
        const authorImg = createElement('img', 'author-picture');
        authorImg.src = author.profilePicture;
        authorImg.alt = author.name;

        const authorInfo = createElement('div', 'author-info');
        authorInfo.appendChild(createElement('h3', '', author.name));
        const formattedDate = formatDate(timestamp);
        console.log('Timestamp:', timestamp, 'Formatted:', formattedDate); // Debug log
        authorInfo.appendChild(createElement('span', 'timestamp', formattedDate));

        header.appendChild(authorImg);
        header.appendChild(authorInfo);
        return header;
    }

    createImageContainer(imageSrc) {
        const imgContainer = createElement('div', 'post-image-container');
        const img = createElement('img', 'post-image');
        img.src = imageSrc;
        img.alt = 'Post image';
        img.onclick = () => this.showImageFullscreen(imageSrc);
        imgContainer.appendChild(img);
        return imgContainer;
    }

    createReactions(post) {
        const reactions = createElement('div', 'reactions');
        ['like', 'dislike', 'love'].forEach(type => {
            const button = createElement('button', `reaction-btn ${type}`);
            const icon = this.createReactionIcon(type);
            const count = createElement('span', 'reaction-count', post.reactions[type].toString());

            button.onclick = (e) => this.handleReaction(e, post.id, type);
            button.appendChild(icon);
            button.appendChild(count);
            reactions.appendChild(button);
        });
        return reactions;
    }

    createReactionIcon(type) {
        const icon = document.createElement('div');
        icon.classList.add('reaction-icon');
        switch (type) {
            case 'like':
                icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary-color)">
                    <path d="M14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3.482a1 1 0 0 0 .817-.423L11.752.85a.5.5 0 0 1 .632-.159l1.814.907a2.5 2.5 0 0 1 1.305 2.853L14.6 8zM7 10.588V19h11.16L21 12.104V10h-6.4a2 2 0 0 1-1.938-2.493l.903-3.548a.5.5 0 0 0-.261-.571l-.661-.33-4.71 6.672c-.25.354-.57.644-.933.858zM5 11H3v8h2v-8z"/>
                </svg>`;
                break;
            case 'dislike':
                icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent-color)">
                    <path d="M9.4 16H3a2 2 0 0 1-2-2v-2.104a2 2 0 0 1 .15-.762L4.246 3.62A1 1 0 0 1 5.17 3H22a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3.482a1 1 0 0 0-.817.423l-5.453 7.726a.5.5 0 0 1-.632.159L9.802 20.4A2.5 2.5 0 0 1 8.497 17.548L9.4 16zM17 9.412V1H5.84L3 7.896V10h6.4a2 2 0 0 1 1.938 2.493l-.903 3.548a.5.5 0 0 0 .261.571l.661.33 4.71-6.672C16.25 9.644 16.57 9.354 17 9.142zM19 13h2V5h-2v8z"/>
                </svg>`;
                break;
            case 'love':
                icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-color)">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>`;
                break;
        }
        return icon;
    }

    getReactionSVG(type) {
        switch (type) {
            case 'like':
                return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            case 'dislike':
                return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.65c.55 0 1.05.23 1.41.59l7.09 7.09c.78.78.78 2.05 0 2.83L13.41 20.59c-.36.36-.86.59-1.41.59-.55 0-1.05-.23-1.41-.59l-7.09-7.09c-.78-.78-.78-2.05 0-2.83L10.59 3.24c.36-.36.86-.59 1.41-.59zm0 2.83l-5.34 5.34L12 15.83l5.34-5.34L12 5.48z"/></svg>';
            case 'love':
                return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            default:
                return '';
        }
    }

    handleReaction(event, postId, type) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.reactions[type]++;
            const countEl = event.currentTarget.querySelector('.reaction-count');
            countEl.textContent = post.reactions[type].toString();

            // Create particle animation
            const rect = event.currentTarget.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            this.particleSystem.createParticle(x, y, type);
        }
    }

    showImageFullscreen(imageSrc) {
        const overlay = createElement('div', 'fullscreen-overlay');
        const img = createElement('img', 'fullscreen-image');
        img.src = imageSrc;

        overlay.onclick = () => overlay.remove();
        overlay.appendChild(img);
        document.body.appendChild(overlay);
    }

    createCommentsSection(post) {
        const section = createElement('div', 'comments-section');
        const comments = createElement('div', 'comments');

        post.comments.forEach(comment => {
            const commentEl = this.createCommentElement(comment);
            comments.appendChild(commentEl);
        });

        const form = createElement('form', 'comment-form');
        const input = createElement('input', 'neu-input', '');
        input.placeholder = 'Ajouter un commentaire...';
        input.type = 'text';

        const button = createElement('button', 'neu-button', 'Envoyer');
        button.type = 'submit';

        form.onsubmit = (e) => {
            e.preventDefault();
            if (input.value.trim()) {
                const newComment = {
                    id: Date.now(),
                    author: {
                        id: 1,
                        name: "John Doe",
                        profilePicture: "/project/assets/images/profile-pictures/user1.png"
                    },
                    content: input.value.trim(),
                    timestamp: new Date().toISOString()
                };
                post.comments.push(newComment);
                comments.appendChild(this.createCommentElement(newComment));
                input.value = '';
            }
        };

        form.appendChild(input);
        form.appendChild(button);
        section.appendChild(comments);
        section.appendChild(form);

        return section;
    }

    createCommentElement(comment, postId, isReply = false) {
        const commentEl = createElement('div', `comment neu-card ${isReply ? 'reply' : ''}`);

        const header = createElement('div', 'comment-header');
        const authorImg = createElement('img', 'author-picture small');
        authorImg.src = comment.author.profilePicture;
        authorImg.alt = comment.author.name;

        const authorInfo = createElement('div', 'author-info');
        authorInfo.appendChild(createElement('span', 'author-name', comment.author.name));
        authorInfo.appendChild(createElement('span', 'timestamp', formatDate(comment.timestamp)));

        header.appendChild(authorImg);
        header.appendChild(authorInfo);

        const content = createElement('p', 'comment-content', comment.content);
        commentEl.appendChild(header);
        commentEl.appendChild(content);

        if (!isReply) {
            const replyButton = createElement('button', 'reply-button', 'Répondre');
            replyButton.onclick = () => this.showReplyForm(commentEl, postId, comment.id);
            commentEl.appendChild(replyButton);

            const repliesContainer = createElement('div', 'replies-container');
            comment.replies.forEach(reply => {
                repliesContainer.appendChild(this.createCommentElement(reply, postId, true));
            });
            commentEl.appendChild(repliesContainer);
        }

        return commentEl;
    }

    showReplyForm(commentEl, postId, commentId) {
        const form = createElement('form', 'reply-form');
        const input = createElement('input', 'neu-input', '');
        input.placeholder = 'Ajouter une réponse...';
        input.type = 'text';

        const button = createElement('button', 'neu-button', 'Envoyer');
        button.type = 'submit';

        form.onsubmit = (e) => {
            e.preventDefault();
            if (input.value.trim()) {
                this.addReplyToComment(postId, commentId, input.value.trim());
                form.remove();
            }
        };

        form.appendChild(input);
        form.appendChild(button);
        commentEl.appendChild(form);
    }

    addReplyToComment(postId, commentId, content) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            const comment = post.comments.find(c => c.id === commentId);
            if (comment) {
                const newReply = {
                    id: Date.now(),
                    author: {
                        id: 1, // Remplacez par l'ID de l'utilisateur actuel
                        name: "John Doe", // Remplacez par le nom de l'utilisateur actuel
                        profilePicture: "/project/assets/images/profile-pictures/user1.png"
                    },
                    content: content,
                    timestamp: new Date().toISOString(),
                    replies: []
                };
                comment.replies.push(newReply);
                this.render(); // Re-render the entire feed to show the new reply
            }
        }
    }

    render() {
        this.container.innerHTML = '';
        this.posts.forEach(post => {
            const postEl = this.createPostElement(post);
            this.container.appendChild(postEl);
        });
    }

    renderPost(post) {
        const postElement = createElement('div', 'post');

        const header = createElement('div', 'post-header');
        const authorPicture = createElement('img', 'author-picture');
        authorPicture.src = post.author.profilePicture;
        const authorInfo = createElement('div', 'author-info');
        const authorName = createElement('span', 'author-name', post.author.name);
        const timestamp = createElement('span', 'timestamp', formatDate(post.timestamp));

        authorInfo.appendChild(authorName);
        authorInfo.appendChild(timestamp);
        header.appendChild(authorPicture);
        header.appendChild(authorInfo);

        const content = createElement('div', 'post-content', post.content);

        postElement.appendChild(header);
        postElement.appendChild(content);

        // Add other elements like images, reactions, comments, etc.

        return postElement;
    }
}
