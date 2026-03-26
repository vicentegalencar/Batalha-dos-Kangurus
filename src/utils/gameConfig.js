export const GAME_CONFIG = {
    width: 1280,
    height: 720,
    backgroundColor: '#201320',
    gravityY: 1900
};

export const MOBILE_UI = {
    leftPadX: 150,
    leftPadY: 596,
    jumpX: 292,
    jumpY: 510,
    attackLightX: 1020,
    attackLightY: 560,
    attackHeavyX: 1145,
    attackHeavyY: 475,
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
