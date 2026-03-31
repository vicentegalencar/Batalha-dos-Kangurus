import {
    DEFAULT_FIGHTER_TEXTURE_KEY,
    GRAY_FIGHTER_TEXTURE_KEY,
    getAnimationSet
} from './fighterAnimations.js';

const baseAttacks = {
    heavy: {
        damage: 8,
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
        damage: 9,
        startup: 205,
        active: 170,
        recovery: 300,
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
        animations: getAnimationSet('red'),
        maxHealth: 100,
        moveSpeed: 345,
        jumpSpeed: 820,
        airControl: 0.86,
        hurtDuration: 320,
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
        texture: GRAY_FIGHTER_TEXTURE_KEY,
        animations: getAnimationSet('gray'),
        maxHealth: 100,
        moveSpeed: 330,
        jumpSpeed: 800,
        airControl: 0.84,
        hurtDuration: 340,
        scale: 1,
        tint: 0xffffff,
        originY: 1,
        shadowColor: 0x202731,
        shadowWidth: 92,
        shadowHeight: 16,
        bodyRatios: {
            width: 0.22,
            height: 0.48,
            offsetX: 0.39,
            offsetY: 0.34
        },
        attacks: {
            heavy: { ...baseAttacks.heavy, damage: 8, startup: 170, knockbackX: 255, lungeX: 14 },
            kick: { ...baseAttacks.kick, damage: 10, knockbackX: 300, lungeX: 20 }
        }
    }
};
