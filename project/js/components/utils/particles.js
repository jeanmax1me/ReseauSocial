export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        requestAnimationFrame(() => this.update());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, type) {
        const colors = {
            like: '#3498db',
            dislike: '#e74c3c',
            love: '#e91e63'
        };
        const color = colors[type] || '#ffffff';
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 100,
                color: color
            });
        }
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1;
            this.context.fillStyle = p.color;
            this.context.beginPath();
            this.context.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.context.fill();
        });
        requestAnimationFrame(() => this.update());
    }
}
