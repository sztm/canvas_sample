document.addEventListener('DOMContentLoaded', () => {
    const cv = document.getElementById('cv');
    const ctx = cv.getContext('2d');

    /* ドット作成 */
    const dot_list = [];
    for(let i = 0; i < 10000; i++) {
        dot_list.push(new Dot(ctx, 300));
    }

    /* レンダリングループ */
    setInterval(() => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 300, 300);
        for(dot of dot_list) {
            dot.move();
        }
    }, 50);
});

class Dot {
    constructor(ctx, max) {
        this.max = max;
        this.x = rand(max - 2);
        this.y = rand(max - 2);
        this.color = '#' + rand0F() + rand0F() + rand0F();
        this.ctx = ctx;
    }

    move() {
        this.ctx.fillStyle = this.color;
        this.shake(3);
        this.ctx.fillRect(this.x, this.y, 1, 1);
    }

    shake(step) {
        step = (step % 2 == 1) ? step : step+1;
        this.x += (rand(step) - Math.floor(step/2) + this.max);
        this.x %= this.max;
        this.y += (rand(step) - Math.floor(step/2) + this.max);
        this.y %= this.max;
    }
}

function rand0F() {
    return ['3', 'D'][Math.floor(Math.random()*2)];
}

function rand(max) {
    return Math.floor(Math.random() * max);
}
