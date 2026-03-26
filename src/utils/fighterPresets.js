const baseAttacks = {
    light: {
        damage: 8,
        startup: 95,
        active: 110,
        recovery: 260,
        width: 42,
        height: 34,
        offsetX: 10,
        topOffset: -10,
        knockbackX: 190,
        knockbackY: -90
    },
    heavy: {
        damage: 15,
        startup: 120,
        active: 95,
        recovery: 140,
        width: 62,
        height: 40,
        offsetX: 20,
        topOffset: 4,
        knockbackX: 270,
        knockbackY: -125
    }
};

export const FIGHTER_PRESETS = {
    red: {
        texture: 'kangaroo-red-frame-0',
        maxHealth: 100,
        moveSpeed: 345,
        jumpSpeed: 820,
        airControl: 0.86,
        hurtDuration: 250,
        scale: 0.78,
        tint: 0xffffff,
        originY: 0.93,
        shadowColor: 0x3d2214,
        shadowWidth: 76,
        shadowHeight: 14,
        body: {
            width: 52,
            height: 106,
            offsetX: 52,
            offsetY: 60
        },
        attacks: {
            light: { ...baseAttacks.light, lungeX: 12 },
            heavy: { ...baseAttacks.heavy, lungeX: 20 }
        }
    },
    blue: {
        texture: 'kangaroo-red-frame-0',
        maxHealth: 100,
        moveSpeed: 330,
        jumpSpeed: 800,
        airControl: 0.84,
        hurtDuration: 260,
        scale: 0.78,
        tint: 0xeaf7ff,
        originY: 0.93,
        shadowColor: 0x183246,
        shadowWidth: 76,
        shadowHeight: 14,
        body: {
            width: 52,
            height: 106,
            offsetX: 52,
            offsetY: 60
        },
        attacks: {
            light: { ...baseAttacks.light, knockbackX: 175, lungeX: 10 },
            heavy: { ...baseAttacks.heavy, damage: 16, startup: 130, knockbackX: 255, lungeX: 18 }
        }
    }
};
