import { DEFAULT_FIGHTER_TEXTURE_KEY } from './fighterAnimations.js';

const baseAttacks = {
    heavy: {
        damage: 15,
        startup: 160,
        active: 150,
        recovery: 250,
        width: 68,
        height: 42,
        offsetX: 24,
        topOffset: 4,
        knockbackX: 270,
        knockbackY: -125
    },
    kick: {
        damage: 18,
        startup: 185,
        active: 150,
        recovery: 260,
        width: 74,
        height: 46,
        offsetX: 30,
        topOffset: 10,
        knockbackX: 320,
        knockbackY: -145
    }
};

export const FIGHTER_PRESETS = {
    red: {
        texture: DEFAULT_FIGHTER_TEXTURE_KEY,
        maxHealth: 100,
        moveSpeed: 345,
        jumpSpeed: 820,
        airControl: 0.86,
        hurtDuration: 250,
        scale: 1,
        tint: 0xffffff,
        originY: 1,
        shadowColor: 0x3d2214,
        shadowWidth: 92,
        shadowHeight: 16,
        bodyRatios: {
            width: 0.22,
            height: 0.48,
            offsetX: 0.39,
            offsetY: 0.34
        },
        attacks: {
            heavy: { ...baseAttacks.heavy, lungeX: 16 },
            kick: { ...baseAttacks.kick, lungeX: 22 }
        }
    },
    blue: {
        texture: DEFAULT_FIGHTER_TEXTURE_KEY,
        maxHealth: 100,
        moveSpeed: 330,
        jumpSpeed: 800,
        airControl: 0.84,
        hurtDuration: 260,
        scale: 1,
        tint: 0xeaf7ff,
        originY: 1,
        shadowColor: 0x183246,
        shadowWidth: 92,
        shadowHeight: 16,
        bodyRatios: {
            width: 0.22,
            height: 0.48,
            offsetX: 0.39,
            offsetY: 0.34
        },
        attacks: {
            heavy: { ...baseAttacks.heavy, damage: 16, startup: 170, knockbackX: 255, lungeX: 14 },
            kick: { ...baseAttacks.kick, damage: 19, knockbackX: 300, lungeX: 20 }
        }
    }
};
