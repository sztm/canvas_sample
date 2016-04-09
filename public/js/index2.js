document.addEventListener('DOMContentLoaded', () => {
    const cnvs_info = {};
    cnvs_info.W = 1000;
    cnvs_info.H = 1000;

    canvas1.width = cnvs_info.W;
    canvas1.height = cnvs_info.H;
    cnvs_info.ctx = canvas1.getContext('2d');

    canvas2.width = cnvs_info.W;
    canvas2.height = cnvs_info.H;
    const ctx2 = canvas2.getContext('2d');


    /* 敵追加 */
    const cnvs_objs = [];
    for (var i = 0; i < 50; i++) {
        let _x = Math.random() * cnvs_info.W;
        let _y = Math.random() * cnvs_info.H;
        let _w = 30;
        let _h = 30;

        let enemy = new RandomMoveRectObj(_x, _y, _w, _h, cnvs_info);
        cnvs_objs.push(enemy);
    }

    /* 自機追加 */
    const mine = new Mine(50, 20, cnvs_info);

    /* 弾追加 */
    const magazine = new Magazine(5);

    /* イベント追加 */
    canvas1.addEventListener('mousemove', (e) => {
        cnvs_info.mX = e.clientX;
        cnvs_info.mY = e.clientY;
    });
    canvas1.addEventListener('mousedown', (e) => {
        let _vX = 3;
        let _color = 'blue';
        let _w = 25;
        let _h = 10;
        magazine.fire(mine.x + mine.w / 2, mine.y, _w, _h, _vX, _color, cnvs_info);
    });

    /* 背景追加 */
    const background = new Background(ctx2, canvas2.width, canvas2.height);


    /* レンダリングループ */
    setInterval(() => {
        /* それぞれの位置のアップデート */
        cnvs_objs.forEach(obj => {
            obj.update();
        });
        mine.update();
        magazine.update(cnvs_objs);
        background.update();


        /* キャンバスクリア */
        cnvs_info.ctx.clearRect(0, 0, cnvs_info.W, cnvs_info.H);
        ctx2.clearRect(0, 0, cnvs_info.W, cnvs_info.H);

        /* レンダリング */
        cnvs_objs.forEach((obj) => {
            obj.render();
        });
        mine.render();
        magazine.render();
        background.render();
    }, 0);
});

class RectObj {
    constructor(x, y, w, h, cnvs_info) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.cnvs_info = cnvs_info;
        this.color = 'rgba(' + [
            ~~Math.floor(Math.random() * 256),
            ~~Math.floor(Math.random() * 256),
            ~~Math.floor(Math.random() * 256),
            Math.random()
        ].join(', ') + ')';
    }

    render() {
        this.cnvs_info.ctx.beginPath();
        this.cnvs_info.ctx.fillStyle = this.color;
        this.cnvs_info.ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        this.cnvs_info.ctx.fill();
    }
}

class Mine extends RectObj {
    constructor(w, h, cnvs_info) {
        super(cnvs_info.W * 0.1, cnvs_info.H / 2, w, h, cnvs_info);
        this.color = 'red';
    }

    update() {
        this.y = this.cnvs_info.mY;
    }
}

class RandomMoveRectObj extends RectObj {
    constructor(x, y, w, h, cnvs_info) {
        super(x, y, w, h, cnvs_info);
        this.vX = (Math.random() - 0.5) * 2.0;
        this.vY = (Math.random() - 0.5) * 2.0;
        this.active = true;
    }

    update() {
        this.x += this.vX;
        this.y += this.vY;
        if(this.x < 1 || this.x > this.cnvs_info.W) {
            this.vX *= -1;
        }
        if(this.y < 1 || this.y > this.cnvs_info.H) {
            this.vY *= -1;
        }
    }

    render() {
        if(this.active) {
            super.render();
        }
    }
}

class Bulet extends RectObj {
    constructor(x, y, w, h, vx, color, cnvs_info) {
        super(x, y, w, h, cnvs_info);
        this.color = color;
        this.vX = vx;
        this.active = true;
    }

    update(cnvs_objs) {
        this.x += this.vX;
        if(this.x > this.cnvs_info.W) {
            this.active = false;
        }
        cnvs_objs.forEach(enemy => {
            if(hit(this, enemy)) {
                enemy.active = false;
            };
        });
    }
}

class Magazine {
    constructor(max) {
        this.bulets = [];
        this.max = max;
    }

    fire(x, y, w, h, vx, color, cnvs_info) {
        if(this.bulets.length  < this.max) {
            this.bulets.push(new Bulet(x, y, w, h, vx, color, cnvs_info));
        }
    }

    update(cnvs_objs) {
        this.bulets.forEach(bulet => {
            bulet.update(cnvs_objs);
        });
        if(this.bulets.length > 0 && !this.bulets[0].active) {
            this.bulets.shift();
        }
    }

    render() {
        this.bulets.forEach(bulet => {
            bulet.render();
        });
    }
}

class Background {
    constructor(ctx, W, H) {
        this.ctx = ctx;
        this.W = W;
        this.H = H;
        this.N = 3;
        this.h = this.W / (this.N * 2 - 1);
        this.vX = 2.5;
        this.color = '#f5f5f5';

        this.lines = [];
        for(let i = 0; i < this.N; i++) {
            this.lines.push(i * (this.h * 2) + this.h / 2);
        }
    }

    update() {
        this.lines = this.lines.map(line => {
            line -= this.vX;
            if(line < 0 - this.h / 2) {
                line = this.W + this.h / 2;
            }
            return line;
        });
    };

    render() {
        this.lines.forEach(line => {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.color;
            this.ctx.rect(line - this.h / 2, 0, this.W / (this.N * 2 - 1), this.H);
            this.ctx.fill();
        });
    }
}

function hit(A, B) {
    if(
        (A.w/2 + B.w/2) > Math.abs(B.x - A.x)
        &&
        (A.h/2 + B.h/2) > Math.abs(B.y - A.y)
    ){
        return true;
    }
    return false;
}
