export function isMobileLike(scene) {
    const device = scene.sys.game.device;
    const hasTouch = Boolean(device.input.touch);
    const isMobileOS = Boolean(device.os.android || device.os.iOS || device.os.iPad);
    const narrowViewport = scene.scale.parentSize.width <= 900;

    return hasTouch || isMobileOS || narrowViewport;
}

export function isPortraitViewport(scene) {
    const parentSize = scene.scale.parentSize;
    return parentSize.height > parentSize.width;
}
