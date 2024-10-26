export class ParticleSystem {
    constructor() {
        this.particles = []; // Tableau pour stocker les particules
        this.canvas = document.createElement('canvas'); // Création d'un élément canvas
        this.context = this.canvas.getContext('2d'); // Obtention du contexte 2D pour dessiner
        document.body.appendChild(this.canvas); // Ajout du canvas au corps du document
        this.resizeCanvas(); // Ajustement de la taille du canvas
        window.addEventListener('resize', () => this.resizeCanvas()); // Écouteur d'événements pour redimensionner le canvas
        requestAnimationFrame(() => this.update()); // Démarrage de la boucle d'animation
    }

    resizeCanvas() {
        // Ajustement de la taille du canvas en fonction de la taille de la fenêtre
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, type) {
        // Création de particules à la position (x, y) avec un type spécifique
        const colors = {
            like: '#3498db', // Couleur pour "like"
            dislike: '#e74c3c', // Couleur pour "dislike"
            love: '#e91e63' // Couleur pour "love"
        };
        const color = colors[type] || '#ffffff'; // Couleur par défaut si le type n'est pas reconnu
        for (let i = 0; i < 30; i++) {
            // Création de 30 particules
            this.particles.push({
                x: x, // Position x de la particule
                y: y, // Position y de la particule
                vx: (Math.random() - 0.5) * 2, // Vitesse x aléatoire
                vy: (Math.random() - 0.5) * 2, // Vitesse y aléatoire
                life: 100, // Durée de vie de la particule
                color: color // Couleur de la particule
            });
        }
    }

    update() {
        // Mise à jour de l'état des particules et rendu sur le canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Effacement du canvas
        this.particles = this.particles.filter(p => p.life > 0); // Filtrage des particules vivantes
        this.particles.forEach(p => {
            // Mise à jour de la position et de la vie de chaque particule
            p.x += p.vx; // Mise à jour de la position x
            p.y += p.vy; // Mise à jour de la position y
            p.life -= 1; // Décrément de la durée de vie
            this.context.fillStyle = p.color; // Définition de la couleur de la particule
            this.context.beginPath(); // Début d'un nouveau chemin
            this.context.arc(p.x, p.y, 3, 0, Math.PI * 2); // Dessin d'un cercle pour la particule
            this.context.fill(); // Remplissage du cercle
        });
        requestAnimationFrame(() => this.update()); // Appel récursif pour continuer l'animation
    }
}
