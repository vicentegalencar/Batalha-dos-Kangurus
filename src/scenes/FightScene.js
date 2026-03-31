import { SimpleCPU } from '../ai/SimpleCPU.js';
import { Fighter } from '../entities/Fighter.js';
import { FightHUD } from '../ui/FightHUD.js';
import { TouchControls } from '../ui/TouchControls.js';
import { isMobileLike, isPortraitViewport } from '../utils/device.js';
import { FIGHTER_PRESETS } from '../utils/fighterPresets.js';
import { ARENA_BOUNDS, GAME_CONFIG, MODE_LABELS, MODES } from '../utils/gameConfig.js';

export class FightScene extends Phaser.Scene {

    constructor() {
        super('FightScene');
    }

    init(data) {
        this.isMobile = isMobileLike(this);
        this.mode = data.mode || MODES.PVP;
        this.fighterNames = data.fighterNames || {};

        if (this.isMobile && this.mode === MODES.PVP) {
            this.mode = MODES.CPU;
        }
    }

    create() {
        this.matchOver = false;
        this.debugHitboxes = false;

        this.createArena();
        this.createControls();
        this.createFighters();

        this.hud = new FightHUD(this, {
            leftFighter: this.fighter1,
            rightFighter: this.fighter2,
            modeLabel: MODE_LABELS[this.mode],
            isMobile: this.isMobile
        });

        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        if (this.isMobile) {
            this.touchControls = new TouchControls(this);
            this.refreshOrientationState();
            this.scale.on('resize', this.refreshOrientationState, this);
            this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onSceneShutdown, this);
        }
    }

    createArena() {
        const { width, height } = GAME_CONFIG;
        this.floorShadowY = ARENA_BOUNDS.floorY + 10;
        this.arenaClamp = ARENA_BOUNDS;

        this.physics.world.setBounds(
            ARENA_BOUNDS.left,
            0,
            ARENA_BOUNDS.right - ARENA_BOUNDS.left,
            height
        );

        if (this.textures.exists('arena-map')) {
            this.add.image(width / 2, height / 2, 'arena-map')
                .setDisplaySize(width, height)
                .setDepth(-20);
        } else {
            this.add.rectangle(width / 2, height / 2, width, height, 0xf5bf73);
            this.add.circle(width / 2, 150, 100, 0xffebaf, 0.9);

            const mountains = this.add.graphics();
            mountains.fillStyle(0xbc6d45, 1);
            mountains.fillTriangle(0, 560, 220, 310, 410, 560);
            mountains.fillTriangle(250, 560, 510, 250, 760, 560);
            mountains.fillTriangle(620, 560, 890, 300, 1120, 560);
            mountains.fillTriangle(970, 560, 1180, 330, 1280, 560);

            const ring = this.add.graphics();
            ring.fillStyle(0x4f7a3d, 1);
            ring.fillRect(0, ARENA_BOUNDS.floorY + 18, width, 110);
            ring.fillStyle(0x6d4726, 1);
            ring.fillRect(0, ARENA_BOUNDS.floorY + 4, width, 18);
            ring.fillStyle(0x8c6a38, 0.35);
            ring.fillRect(0, ARENA_BOUNDS.floorY - 4, width, 10);
        }

        this.groundCollider = this.add.rectangle(
            (ARENA_BOUNDS.left + ARENA_BOUNDS.right) / 2,
            ARENA_BOUNDS.floorY + 58,
            ARENA_BOUNDS.right - ARENA_BOUNDS.left,
            112,
            0x000000,
            0
        );
        this.physics.add.existing(this.groundCollider, true);
    }

    createControls() {
        this.controls = {
            p1: this.input.keyboard.addKeys({
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                jump: Phaser.Input.Keyboard.KeyCodes.W,
                heavy: Phaser.Input.Keyboard.KeyCodes.G,
                kick: Phaser.Input.Keyboard.KeyCodes.H
            }),
            p2: this.input.keyboard.addKeys({
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                jump: Phaser.Input.Keyboard.KeyCodes.UP,
                heavy: Phaser.Input.Keyboard.KeyCodes.L,
                kick: Phaser.Input.Keyboard.KeyCodes.SEMICOLON
            })
        };
    }

    createFighters() {
        const leftName = this.fighterNames.left || (this.mode === MODES.CPU ? 'Desafiante' : 'Jogador 1');
        const rightName = this.fighterNames.right || (this.mode === MODES.CPU ? 'Canguru Cinza' : 'Jogador 2');

        this.fighter1 = new Fighter(this, {
            ...FIGHTER_PRESETS.red,
            x: ARENA_BOUNDS.leftSpawnX,
            y: ARENA_BOUNDS.spawnY,
            facing: 1,
            label: leftName,
            hitboxColor: 0xff8b61
        });

        this.fighter2 = new Fighter(this, {
            ...FIGHTER_PRESETS.blue,
            x: ARENA_BOUNDS.rightSpawnX,
            y: ARENA_BOUNDS.spawnY,
            facing: -1,
            label: rightName,
            hitboxColor: 0x66d6ff
        });

        this.fighter1.setOpponent(this.fighter2);
        this.fighter2.setOpponent(this.fighter1);

        this.physics.add.collider(this.fighter1, this.groundCollider);
        this.physics.add.collider(this.fighter2, this.groundCollider);
        this.physics.add.collider(this.fighter1, this.fighter2);

        if (this.mode === MODES.CPU) {
            this.cpuController = new SimpleCPU(this.fighter2, this.fighter1);
        }
    }

    readHumanInput(keys) {
        return {
            left: keys.left.isDown,
            right: keys.right.isDown,
            jump: Phaser.Input.Keyboard.JustDown(keys.jump),
            heavy: Phaser.Input.Keyboard.JustDown(keys.heavy),
            kick: Phaser.Input.Keyboard.JustDown(keys.kick)
        };
    }

    mergeInputs(baseInput, extraInput) {
        const base = baseInput || {};
        const extra = extraInput || {};

        return {
            left: Boolean(base.left || extra.left),
            right: Boolean(base.right || extra.right),
            jump: Boolean(base.jump || extra.jump),
            heavy: Boolean(base.heavy || extra.heavy),
            kick: Boolean(base.kick || extra.kick)
        };
    }

    refreshOrientationState() {
        if (!this.touchControls) {
            return;
        }

        this.isPortrait = isPortraitViewport(this);
        this.touchControls.setPortraitMode(this.isPortrait);
        this.touchControls.setRestartVisible(this.matchOver && !this.isPortrait);
    }

    update(time, delta) {
        const touchInput = this.touchControls ? this.touchControls.getInput() : {};
        const p1Keyboard = this.matchOver ? {} : this.readHumanInput(this.controls.p1);
        const p1Input = this.isPortrait ? {} : this.mergeInputs(p1Keyboard, touchInput);
        const p2Input = this.matchOver
            ? {}
            : this.isPortrait
                ? {}
            : this.mode === MODES.CPU
                ? this.cpuController.update(time)
                : this.readHumanInput(this.controls.p2);

        this.fighter1.updateFighter(p1Input, time, delta);
        this.fighter2.updateFighter(p2Input, time, delta);

        if (!this.matchOver && (this.fighter1.health <= 0 || this.fighter2.health <= 0)) {
            this.finishMatch();
        }

        this.hud.update();

        if (Phaser.Input.Keyboard.JustDown(this.menuKey) || this.touchControls?.consumeMenu()) {
            this.scene.start('MenuScene');
        }

        if (this.touchControls?.consumeFullscreen()) {
            this.toggleFullscreen();
        }

        if (this.touchControls) {
            this.touchControls.setRestartVisible(this.matchOver && !this.isPortrait);
        }

        if (this.matchOver && (Phaser.Input.Keyboard.JustDown(this.restartKey) || this.touchControls?.consumeRestart())) {
            this.scene.restart({ mode: this.mode, fighterNames: this.fighterNames });
        }
    }

    finishMatch() {
        this.matchOver = true;

        if (this.fighter1.health === this.fighter2.health) {
            this.hud.showWinner('Empate');
            return;
        }

        const winner = this.fighter1.health > this.fighter2.health ? this.fighter1 : this.fighter2;
        this.hud.showWinner(`${winner.label} venceu`);
    }

    onSceneShutdown() {
        if (this.touchControls) {
            this.touchControls.destroy();
            this.touchControls = null;
        }

        this.scale.off('resize', this.refreshOrientationState, this);
    }

    toggleFullscreen() {
        const target = document.getElementById('game-container') || document.documentElement;
        const requestFullscreen = target.requestFullscreen
            || target.webkitRequestFullscreen
            || target.msRequestFullscreen;
        const exitFullscreen = document.exitFullscreen
            || document.webkitExitFullscreen
            || document.msExitFullscreen;

        try {
            if (!document.fullscreenElement && requestFullscreen) {
                requestFullscreen.call(target);
                return;
            }

            if (document.fullscreenElement && exitFullscreen) {
                exitFullscreen.call(document);
            }
        } catch {
            // Ignore unsupported fullscreen errors on mobile browsers.
        }
    }

}
