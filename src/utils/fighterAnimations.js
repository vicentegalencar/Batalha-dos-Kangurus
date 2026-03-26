export const KANGAROO_SHEET = {
    key: 'kangaroo-red-sheet',
    path: 'assets/kangaroo_red_sheet.png',
    frameWidth: 256,
    frameHeight: 282
};

export const KANGAROO_FRAME_KEYS = Array.from({ length: 32 }, (_, index) => `kangaroo-red-frame-${index}`);

const ANIMATION_DEFINITIONS = [
    { key: 'kangaroo-idle', frames: [0, 3], frameRate: 4, repeat: -1 },
    { key: 'kangaroo-walk', frames: [8, 9, 10, 11], frameRate: 10, repeat: -1 },
    { key: 'kangaroo-jump', frames: [12, 13, 14], frameRate: 10, repeat: -1 },
    { key: 'kangaroo-attack-light', frames: [18, 19, 20, 21], frameRate: 12, repeat: 0 },
    { key: 'kangaroo-attack-heavy', frames: [22, 23], frameRate: 10, repeat: 0 },
    { key: 'kangaroo-hurt', frames: [26], frameRate: 1, repeat: 0 },
    { key: 'kangaroo-ko', frames: [27, 28, 29, 30, 31], frameRate: 8, repeat: 0 }
];

export const STATE_ANIMATIONS = {
    idle: 'kangaroo-idle',
    walk: 'kangaroo-walk',
    jump: 'kangaroo-jump',
    attackLight: 'kangaroo-attack-light',
    attackHeavy: 'kangaroo-attack-heavy',
    hurt: 'kangaroo-hurt',
    ko: 'kangaroo-ko'
};

function ensureFrameTextures(scene) {
    const baseTexture = scene.textures.get(KANGAROO_SHEET.key);
    const sourceImage = baseTexture.getSourceImage();

    KANGAROO_FRAME_KEYS.forEach((frameKey, index) => {
        if (scene.textures.exists(frameKey)) {
            return;
        }

        const frame = baseTexture.get(index);
        const canvasTexture = scene.textures.createCanvas(frameKey, frame.cutWidth, frame.cutHeight);
        const context = canvasTexture.getContext();

        context.clearRect(0, 0, frame.cutWidth, frame.cutHeight);
        context.drawImage(
            sourceImage,
            frame.cutX,
            frame.cutY,
            frame.cutWidth,
            frame.cutHeight,
            0,
            0,
            frame.cutWidth,
            frame.cutHeight
        );

        canvasTexture.refresh();
    });
}

export function createFighterAnimations(scene) {
    ensureFrameTextures(scene);

    ANIMATION_DEFINITIONS.forEach((definition) => {
        if (scene.anims.exists(definition.key)) {
            return;
        }

        scene.anims.create({
            key: definition.key,
            frames: definition.frames.map((frame) => ({ key: KANGAROO_FRAME_KEYS[frame] })),
            frameRate: definition.frameRate,
            repeat: definition.repeat
        });
    });
}
