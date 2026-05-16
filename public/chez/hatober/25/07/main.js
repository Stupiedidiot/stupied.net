import { Application, Graphics, Assets, Sprite } from '/meta/js/pixi.min.mjs';

const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;
const STROKE_STYLE = { width: 5, color: 0xffffff, alpha: 1 };
const BOTTOM = WINDOW_HEIGHT * 1.5;

// var rain_density = 1;
var rain_density = Math.floor(WINDOW_WIDTH * 0.08);

function randomX() { 
    return Math.floor(Math.random() * WINDOW_WIDTH);
}

function randomY() { 
    return Math.floor(Math.random() * WINDOW_HEIGHT);
}

(async () => {
    const app = new Application();

    await app.init({
        width: 480,
        height: 640,
        backgroundAlpha: 0
    });

    var droplets = [];
    for (let i = 0; i < rain_density; i++) {
        droplets.push(new Graphics());
        droplets[i].prev_pos = [randomX(), randomY()];
        app.stage.addChild(droplets[i]);
    }

    app.ticker.maxFPS = 60;
    app.ticker.add(() => {
        for (let i = 0; i < droplets.length; i++) {
            droplets[i].clear();
            let x = droplets[i].prev_pos[0];
            let y = droplets[i].prev_pos[1];

            let y_next = y + Math.ceil((0.005 * (BOTTOM - y)))**2;
            
            if (y_next >= WINDOW_HEIGHT) {
                droplets[i].prev_pos = [randomX(), 0];
            } else { 
                droplets[i]
                    .moveTo(x, y)
                    .lineTo(x, y_next)
                    .stroke(STROKE_STYLE); 
                droplets[i].prev_pos[1] = y_next;
            }
        }
    });

    document.getElementsByTagName('main')[0].appendChild(app.canvas);
})();

document.getElementById("message").remove()

// await Assets.init({ manifest: './manifest.json' });
// window.addEventListener("resize", set_rain_density);