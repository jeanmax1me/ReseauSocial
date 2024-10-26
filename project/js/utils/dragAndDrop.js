// Sélection des éléments amis et de la liste d'amis
const friends = document.querySelectorAll('.friend');
const friendsList = document.querySelector('.friends-list');

let draggedFriend = null; // Variable pour stocker l'ami actuellement glissé

// Ajout des événements de drag and drop à chaque ami
friends.forEach(friend => {
    friend.addEventListener('dragstart', function () {
        draggedFriend = friend; // Stocke l'ami qui est en cours de glissement
        setTimeout(() => {
            friend.style.display = 'none'; // Cache l'ami pendant le glissement
        }, 0);
    });

    friend.addEventListener('dragend', function () {
        setTimeout(() => {
            draggedFriend.style.display = 'flex'; // Restaure l'affichage de l'ami
            draggedFriend = null; // Réinitialise la variable
        }, 0);
    });

    friend.addEventListener('dragover', function (e) {
        e.preventDefault(); // Permet le drop en empêchant le comportement par défaut
    });

    friend.addEventListener('dragenter', function (e) {
        e.preventDefault(); // Permet le drop en empêchant le comportement par défaut
        this.style.backgroundColor = '#d0d0d0'; // Change la couleur de fond pour indiquer la zone de drop
    });

    friend.addEventListener('dragleave', function () {
        this.style.backgroundColor = '#e0e0e0'; // Restaure la couleur de fond lorsque l'ami quitte la zone
    });

    friend.addEventListener('drop', function () {
        // Insère l'ami glissé avant l'ami sur lequel il est déposé
        friendsList.insertBefore(draggedFriend, this);
        this.style.backgroundColor = '#e0e0e0'; // Restaure la couleur de fond après le drop
    });
});
