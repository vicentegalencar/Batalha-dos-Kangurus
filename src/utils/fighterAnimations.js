export const KANGAROO_SHEET = {
    key: 'kangaroo-full-sheet',
    path: 'assets/full.png',
    columns: 4,
    rows: 8
};

export const DEFAULT_FIGHTER_TEXTURE_KEY = 'kangaroo-full-frame-0';

const FRAME_KEYS = Array.from({ length: 32 }, (_, index) => `kangaroo-full-frame-${index}`);

const ANIMATION_DEFINITIONS = [
    { key: 'kangaroo-idle', frames: [0, 1, 2, 3], frameRate: 5, repeat: -1 },
    { key: 'kangaroo-walk', frames: [4, 5, 6, 7], frameRate: 10, repeat: -1 },
    { key: 'kangaroo-jump', frames: [8, 9, 10], frameRate: 10, repeat: 0 },
    { key: 'kangaroo-attack-heavy', frames: [17, 18, 19], frameRate: 7, repeat: 0 },
    { key: 'kangaroo-kick', frames: [21, 22, 23], frameRate: 7, repeat: 0 },
    { key: 'kangaroo-hurt', frames: [24, 25, 26, 27], frameRate: 10, repeat: 0 },
    { key: 'kangaroo-ko', frames: [28, 29, 30, 31], frameRate: 7, repeat: 0 }
];

export const STATE_ANIMATIONS = {
    idle: 'kangaroo-idle',
    walk: 'kangaroo-walk',
    jump: 'kangaroo-jump',
    attackHeavy: 'kangaroo-attack-heavy',
    kick: 'kangaroo-kick',
    hurt: 'kangaroo-hurt',
    ko: 'kangaroo-ko'
};

function ensureFrameTextures(scene) {
    if (scene.textures.exists(DEFAULT_FIGHTER_TEXTURE_KEY)) {
        return;
    }

    const sourceImage = scene.textures.get(KANGAROO_SHEET.key).getSourceImage();
    const cellHeight = Math.floor(sourceImage.height / KANGAROO_SHEET.rows);
    const textureWidth = Math.ceil(sourceImage.width / KANGAROO_SHEET.columns);
    const textureHeight = cellHeight;

    FRAME_KEYS.forEach((frameKey, index) => {
        const column = index % KANGAROO_SHEET.columns;
        const row = Math.floor(index / KANGAROO_SHEET.columns);
        const startX = Math.round((column * sourceImage.width) / KANGAROO_SHEET.columns);
        const endX = Math.round(((column + 1) * sourceImage.width) / KANGAROO_SHEET.columns);
        const sx = startX;
        const sy = row * cellHeight;
        const sourceWidth = endX - startX;
        const canvasTexture = scene.textures.createCanvas(frameKey, textureWidth, textureHeight);
        const context = canvasTexture.getContext();

        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, textureWidth, textureHeight);
        context.drawImage(
            sourceImage,
            sx,
            sy,
            sourceWidth,
            cellHeight,
            0,
            0,
            sourceWidth,
            textureHeight
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
            frames: definition.frames.map((frame) => ({ key: FRAME_KEYS[frame] })),
            frameRate: definition.frameRate,
            repeat: definition.repeat
        });
    });
}
