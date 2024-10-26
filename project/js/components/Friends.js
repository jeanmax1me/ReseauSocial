export class Friends {
    constructor() {
        // Sélection des éléments DOM nécessaires
        this.friendsList = document.getElementById('friends-list');
        this.filterInput = document.getElementById('friend-filter');
        this.init();
    }

    init() {
        // Initialisation des fonctionnalités
        this.addEventListeners();
        this.initDragAndDrop();
    }

    addEventListeners() {
        // Ajout de l'écouteur d'événements pour le filtrage des amis
        this.filterInput.addEventListener('input', () => this.filterFriends());
    }

    filterFriends() {
        // Filtrage des amis en fonction de la saisie de l'utilisateur
        const filterValue = this.filterInput.value.toLowerCase();
        const friends = this.friendsList.getElementsByClassName('friend-item');

        Array.from(friends).forEach(friend => {
            const name = friend.getElementsByClassName('friend-name')[0].textContent.toLowerCase();
            // Affiche ou cache l'ami en fonction du filtre
            if (name.includes(filterValue)) {
                friend.style.display = '';
            } else {
                friend.style.display = 'none';
            }
        });
    }

    initDragAndDrop() {
        // Initialisation du drag and drop pour chaque ami
        const friends = this.friendsList.getElementsByClassName('friend-item');

        Array.from(friends).forEach(friend => {
            // Gestion du début du glissement
            friend.addEventListener('dragstart', () => {
                setTimeout(() => friend.classList.add('dragging'), 0);
            });

            // Gestion de la fin du glissement
            friend.addEventListener('dragend', () => {
                friend.classList.remove('dragging');
            });
        });

        // Gestion du survol pendant le glissement
        this.friendsList.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(this.friendsList, e.clientY);
            const draggable = document.querySelector('.dragging');
            // Insertion de l'élément glissé à la bonne position
            if (afterElement == null) {
                this.friendsList.appendChild(draggable);
            } else {
                this.friendsList.insertBefore(draggable, afterElement);
            }
        });
    }

    getDragAfterElement(container, y) {
        // Détermine l'élément après lequel insérer l'élément glissé
        const draggableElements = [...container.querySelectorAll('.friend-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

// Initialisation de la classe Friends
new Friends();
