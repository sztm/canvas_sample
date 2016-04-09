document.addEventListener('DOMContentLoaded', () => {
    const cv = document.getElementById('cv');
    const ctx = cv.getContext('2d');

    /* ドット作成 */
    const dot_list = [];
    for(let i = 0; i < 100; i++) {
        dot_list.push(new Dot(ctx, 800));
    }

    /* レンダリングループ */
    setInterval(() => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 800, 800);
        for(dot of dot_list) {
            dot.move();
        }
    }, 10);
});

class Dot {
    constructor(ctx, max) {
        this.max = max;
        this.x = rand(max - 2);
        this.y = rand(max - 2);
        this.color = '#' + rand0F() + rand0F() + rand0F();
        this.ctx = ctx;
        this.conpus(3);
    }

    move() {
        this.ctx.fillStyle = this.color;
        // this.shake(3);
        this.change_d(3);
        this.gonext();
        this.ctx.fillRect(this.x, this.y, 10, 10);
    }

    conpus(step) {
        this.x_d = (rand(step) - Math.floor(step/2));
        this.y_d = (rand(step) - Math.floor(step/2));
        if(!(this.x_d || this.y_d)) {
            this.conpus(step);
        }
    }

    gonext() {
        this.x += this.x_d + this.max;
        this.x %= this.max;
        this.y += this.y_d + this.max;
        this.y %= this.max;
    }

    change_d(step) {
        this.x_d += rand(step) - Math.floor(step/2);
        this.y_d += rand(step) - Math.floor(step/2);
        if(Math.abs(this.x_d) > step) {
            this.x_d /= Math.abs(this.x_d);
            this.x_d *= step;
        }
        if(Math.abs(this.y_d) > step) {
            this.y_d /= Math.abs(this.y_d);
            this.y_d *= step;
        }
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
