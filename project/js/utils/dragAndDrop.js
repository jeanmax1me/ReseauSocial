const friends = document.querySelectorAll('.friend');
const friendsList = document.querySelector('.friends-list');

let draggedFriend = null;

friends.forEach(friend => {
    friend.addEventListener('dragstart', function () {
        draggedFriend = friend;
        setTimeout(() => {
            friend.style.display = 'none';
        }, 0);
    });

    friend.addEventListener('dragend', function () {
        setTimeout(() => {
            draggedFriend.style.display = 'flex';
            draggedFriend = null;
        }, 0);
    });

    friend.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    friend.addEventListener('dragenter', function (e) {
        e.preventDefault();
        this.style.backgroundColor = '#d0d0d0';
    });

    friend.addEventListener('dragleave', function () {
        this.style.backgroundColor = '#e0e0e0';
    });

    friend.addEventListener('drop', function () {
        friendsList.insertBefore(draggedFriend, this);
        this.style.backgroundColor = '#e0e0e0';
    });
});
