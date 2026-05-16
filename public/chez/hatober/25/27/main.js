import { Application, Graphics, Text, TextStyle, Assets, Sprite } from '/meta/js/pixi.min.mjs';

(async () => {
    const game = new Application();
    // await Assets.init({ manifest: './src/manifest.json' });

    await game.init({
        resizeTo: window,
        backgroundAlpha: 0
    });

    game.canvas.style.position = 'absolute';

    // const ASSETS_EVAN = await Assets.loadBundle('evan');
    // const sprite = Sprite.from(ASSETS_EVAN.aaa);
    // app.stage.addChild(sprite);

    const TEXT_STYLE = new TextStyle({
        fontSize: '10vh'
    });

    const text = new Text({
        text: "Mic Test, Mic Test",
        TEXT_STYLE
    })

    game.stage.addChild(text);
    document.getElementsByTagName('main')[0].appendChild(game.canvas);
})();