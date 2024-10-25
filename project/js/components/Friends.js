class Friends {
    constructor() {
        this.friends = [];
        this.container = document.querySelector('.friends-list');
    }

    async init() {
        try {
            const response = await fetch('../assets/data/friends.json');
            const data = await response.json();
            this.friends = data.friends;
            this.render();
        } catch (error) {
            console.error('Erreur lors du chargement des amis:', error);
        }
    }

    createFriendElement(friend) {
        const friendEl = createElement('div', 'friend-item neu-card');

        const profileImg = createElement('img', 'profile-picture');
        profileImg.src = friend.profilePicture;
        profileImg.alt = friend.name;

        const info = createElement('div', 'friend-info');
        info.appendChild(createElement('span', 'name', friend.name));
        info.appendChild(createElement('span', `status ${friend.status}`, friend.status));

        friendEl.appendChild(profileImg);
        friendEl.appendChild(info);
        friendEl.setAttribute('draggable', 'true'); // Permettre le drag-and-drop si nécessaire

        return friendEl;
    }

    render() {
        this.container.innerHTML = ''; // Effacer les amis existants
        this.friends.forEach(friend => {
            this.container.appendChild(this.createFriendElement(friend));
        });
    }
}

// Initialiser les amis
const friends = new Friends();
friends.init();
