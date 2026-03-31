export function ensureBackgroundMusic(scene) {
    let music = scene.sound.get('bgm');

    if (!music) {
        music = scene.sound.add('bgm', {
            loop: true,
            volume: 0.38
        });
    }

    if (music.isPlaying) {
        return;
    }

    const tryPlay = () => {
        if (music.isPlaying) {
            return;
        }

        try {
            music.play();
        } catch {
            // Some browsers still require a later user gesture.
        }
    };

    tryPlay();

    if (!music.isPlaying) {
        scene.input.once('pointerdown', tryPlay);

        if (scene.input.keyboard) {
            scene.input.keyboard.once('keydown', tryPlay);
        }
    }
}
