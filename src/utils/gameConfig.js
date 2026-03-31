export const GAME_CONFIG = {
    width: 1280,
    height: 720,
    backgroundColor: '#201320',
    gravityY: 1900
};

export const MOBILE_UI = {
    leftPadX: 150,
    leftPadY: 596,
    jumpX: 964,
    jumpY: 480,
    attackLightX: 980,
    attackLightY: 575,
    attackHeavyX: 1090,
    attackHeavyY: 490,
    attackKickX: 1195,
    attackKickY: 575,
    menuX: 1184,
    menuY: 118,
    restartX: 1060,
    restartY: 118
};

export const ARENA_BOUNDS = {
    left: 150,
    right: 1130,
    floorY: 588,
    spawnY: 578,
    leftSpawnX: 380,
    rightSpawnX: 900
};

export const MODES = {
    PVP: 'pvp',
    CPU: 'cpu'
};

export const MODE_LABELS = {
    [MODES.PVP]: 'Jogador vs Jogador',
    [MODES.CPU]: 'Jogador vs CPU'
};
