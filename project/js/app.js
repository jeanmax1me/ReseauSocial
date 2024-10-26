// js/app.js
import { Feed } from './components/Feed.js';
import { Messaging } from './components/Messaging.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('posts-container')) {
        const feed = new Feed();
        feed.init();
    }

    if (document.querySelector('.messaging-container')) {
        const messaging = new Messaging();
        messaging.init();
    }
});
