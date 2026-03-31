export const KANGAROO_SHEETS = {
    red: {
        key: 'kangaroo-full-sheet',
        path: 'assets/full.png',
        columns: 4,
        rows: 8
    },
    gray: {
        key: 'kangaroo-full-gray-sheet',
        path: 'assets/full_gray.png',
        columns: 4,
        rows: 8
    }
};

export const DEFAULT_FIGHTER_TEXTURE_KEY = getFrameTextureKey('red', 0);
export const GRAY_FIGHTER_TEXTURE_KEY = getFrameTextureKey('gray', 0);

const ANIMATION_DEFINITIONS = [
    { state: 'idle', suffix: 'idle', frames: [0, 1, 2, 3], frameRate: 5, repeat: -1 },
    { state: 'walk', suffix: 'walk', frames: [4, 5, 6, 7], frameRate: 10, repeat: -1 },
    { state: 'jump', suffix: 'jump', frames: [8, 9, 10], frameRate: 10, repeat: 0 },
    { state: 'attackHeavy', suffix: 'attack-heavy', frames: [17, 18, 19], frameRate: 7, repeat: 0 },
    { state: 'kick', suffix: 'kick', frames: [21, 22, 23], frameRate: 5, repeat: 0 },
    { state: 'hurt', suffix: 'hurt', frames: [25, 26, 27, 27], frameRate: 8, repeat: 0 },
    { state: 'ko', suffix: 'ko', frames: [28, 29, 30, 31], frameRate: 7, repeat: 0 }
];

export function getAnimationSet(variant = 'red') {
    return ANIMATION_DEFINITIONS.reduce((map, definition) => {
        map[definition.state] = getAnimationKey(variant, definition.suffix);
        return map;
    }, {});
}

function getFrameTextureKey(variant, index) {
    return `kangaroo-${variant}-frame-${index}`;
}

function getAnimationKey(variant, suffix) {
    return `kangaroo-${variant}-${suffix}`;
}

function ensureFrameTextures(scene, variant, sheet) {
    const defaultFrameKey = getFrameTextureKey(variant, 0);
    if (scene.textures.exists(defaultFrameKey)) {
        return;
    }

    const sourceImage = scene.textures.get(sheet.key).getSourceImage();
    const cellHeight = Math.floor(sourceImage.height / sheet.rows);
    const textureWidth = Math.ceil(sourceImage.width / sheet.columns);
    const textureHeight = cellHeight;

    Array.from({ length: sheet.columns * sheet.rows }, (_, index) => index).forEach((index) => {
        const column = index % sheet.columns;
        const row = Math.floor(index / sheet.columns);
        const startX = Math.round((column * sourceImage.width) / sheet.columns);
        const endX = Math.round(((column + 1) * sourceImage.width) / sheet.columns);
        const sx = startX;
        const sy = row * cellHeight;
        const sourceWidth = endX - startX;
        const frameKey = getFrameTextureKey(variant, index);
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
    Object.entries(KANGAROO_SHEETS).forEach(([variant, sheet]) => {
        ensureFrameTextures(scene, variant, sheet);

        ANIMATION_DEFINITIONS.forEach((definition) => {
            const animationKey = getAnimationKey(variant, definition.suffix);

            if (scene.anims.exists(animationKey)) {
                return;
            }

            scene.anims.create({
                key: animationKey,
                frames: definition.frames.map((frame) => ({ key: getFrameTextureKey(variant, frame) })),
                frameRate: definition.frameRate,
                repeat: definition.repeat
            });
        });
    });
}
