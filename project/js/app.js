// js/app.js
import { Feed } from './components/Feed.js';

document.addEventListener('DOMContentLoaded', () => {
    const feed = new Feed();
    feed.init();
});

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.messaging-container')) {
        const messaging = new Messaging();
        messaging.init();
    }
});
