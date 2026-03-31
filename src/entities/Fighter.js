const DEFAULT_BODY_SIZE = { width: 132, height: 300, offsetX: 122, offsetY: 360 };

export class Fighter extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, config) {
        super(scene, config.x, config.y, config.texture, config.frame ?? 0);

        this.scene = scene;
        this.label = config.label;
        this.maxHealth = config.maxHealth;
        this.health = config.maxHealth;
        this.moveSpeed = config.moveSpeed;
        this.jumpSpeed = config.jumpSpeed;
        this.airControl = config.airControl;
        this.hurtDuration = config.hurtDuration;
        this.attacks = config.attacks;
        this.facing = config.facing || 1;
        this.state = 'idle';
        this.hurtTimer = 0;
        this.currentAttack = null;
        this.opponent = null;
        this.visualScale = config.scale || 1;
        this.tintColor = config.tint;
        this.originY = config.originY || 1;
        this.animationSet = config.animations || {};

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, this.originY);
        this.setScale(this.visualScale);
        this.setDepth(20);
        this.setCollideWorldBounds(true);
        this.setTint(this.tintColor);

        if (config.bodyRatios) {
            this.body.setSize(
                Math.round(this.displayWidth * config.bodyRatios.width),
                Math.round(this.displayHeight * config.bodyRatios.height)
            );
            this.body.setOffset(
                Math.round(this.displayWidth * config.bodyRatios.offsetX),
                Math.round(this.displayHeight * config.bodyRatios.offsetY)
            );
        } else {
            const bodySize = config.body || DEFAULT_BODY_SIZE;
            this.body.setSize(
                bodySize.width,
                bodySize.height
            );
            this.body.setOffset(
                bodySize.offsetX,
                bodySize.offsetY
            );
        }
        this.body.setDragX(1800);
        this.body.setMaxVelocity(this.moveSpeed * 2, 1400);

        this.shadow = scene.add.ellipse(
            config.x,
            scene.floorShadowY || config.y + 10,
            config.shadowWidth || 94,
            config.shadowHeight || 20,
            config.shadowColor || 0x20150f,
            0.18
        ).setDepth(8);

        this.hitboxPreview = scene.add.rectangle(0, 0, 10, 10, config.hitboxColor, 0.2)
            .setDepth(40)
            .setVisible(false);

        this.updateFacing(this.facing);
        this.setState('idle', true);
    }

    setOpponent(opponent) {
        this.opponent = opponent;
    }

    isGrounded() {
        return this.body.blocked.down || this.body.touching.down;
    }

    updateFacing(direction) {
        if (!direction) {
            return;
        }

        this.facing = direction > 0 ? 1 : -1;
        this.setFlipX(this.facing < 0);
    }

    setState(nextState, force = false) {
        if (!force && this.state === nextState) {
            return;
        }

        this.state = nextState;
        this.applyAnimationForState();
    }

    applyAnimationForState() {
        const animationKey = this.animationSet[this.state];
        if (!animationKey) {
            return;
        }

        if (this.anims.currentAnim && this.anims.currentAnim.key === animationKey && this.anims.isPlaying) {
            return;
        }

        this.anims.play(animationKey, true);
    }

    updateFighter(input, time, delta) {
        const currentInput = input || {};
        const moveIntent = (currentInput.left ? -1 : 0) + (currentInput.right ? 1 : 0);

        if (this.state === 'ko') {
            this.hideHitbox();
            if (this.isGrounded() && Math.abs(this.body.velocity.x) < 12) {
                this.setVelocityX(0);
            }
            this.updatePresentation();
            return;
        }

        if (!this.currentAttack && this.state !== 'hurt' && this.opponent) {
            const targetDirection = Math.sign(this.opponent.x - this.x);
            if (moveIntent === 0 && Math.abs(this.opponent.x - this.x) > 10) {
                this.updateFacing(targetDirection);
            }
        }

        if (this.state === 'hurt') {
            this.hurtTimer -= delta;
            if (this.hurtTimer <= 0) {
                this.setState(this.isGrounded() ? 'idle' : 'jump');
            }
        }

        if (this.currentAttack) {
            this.updateAttack(delta);
        }

        const isLocked = this.state === 'hurt' || Boolean(this.currentAttack);
        if (!isLocked) {
            const moveSpeed = this.isGrounded() ? this.moveSpeed : this.moveSpeed * this.airControl;
            this.setVelocityX(moveIntent * moveSpeed);

            if (moveIntent !== 0) {
                this.updateFacing(moveIntent);
            }

            if (currentInput.jump && this.isGrounded()) {
                this.setVelocityY(-this.jumpSpeed);
                this.setState('jump');
            }

            if (currentInput.kick) {
                this.startAttack('kick');
            } else if (currentInput.heavy) {
                this.startAttack('heavy');
            }
        } else if (this.currentAttack && this.isGrounded()) {
            this.setVelocityX(this.body.velocity.x * 0.82);
        }

        if (!this.currentAttack && this.state !== 'hurt') {
            if (!this.isGrounded()) {
                this.setState('jump');
            } else if (Math.abs(this.body.velocity.x) > 12) {
                this.setState('walk');
            } else {
                this.setState('idle');
            }
        }

        this.keepInsideArena();
        this.updatePresentation();
    }

    startAttack(type) {
        if (this.currentAttack || this.state === 'hurt' || this.state === 'ko') {
            return;
        }

        const attackData = this.attacks[type];
        this.currentAttack = {
            type,
            timer: 0,
            hasConnected: false,
            data: attackData
        };

        if (type === 'heavy') {
            this.setState('attackHeavy');
        } else {
            this.setState('kick');
        }
        this.setVelocityX(this.facing * (attackData.lungeX || 0));
    }

    updateAttack(delta) {
        const attack = this.currentAttack;
        const attackEnd = attack.data.startup + attack.data.active + attack.data.recovery;
        const activeStart = attack.data.startup;
        const activeEnd = activeStart + attack.data.active;

        attack.timer += delta;

        if (attack.timer >= activeStart && attack.timer < activeEnd) {
            this.showHitbox(attack.data);
            this.tryHitOpponent(attack.data);
        } else {
            this.hideHitbox();
        }

        if (attack.timer >= attackEnd) {
            this.currentAttack = null;
            this.hideHitbox();
        }
    }

    tryHitOpponent(attackData) {
        if (!this.opponent || this.currentAttack.hasConnected || this.opponent.state === 'ko') {
            return;
        }

        const hitbox = this.buildAttackHitbox(attackData);
        const hurtbox = this.opponent.getHurtbox();

        if (!Phaser.Geom.Intersects.RectangleToRectangle(hitbox, hurtbox)) {
            return;
        }

        this.currentAttack.hasConnected = true;
        this.opponent.receiveHit({
            damage: attackData.damage,
            knockbackX: attackData.knockbackX,
            knockbackY: attackData.knockbackY,
            attackerFacing: this.facing,
            heavy: this.currentAttack.type === 'heavy'
        });
    }

    receiveHit({ damage, knockbackX, knockbackY, attackerFacing, heavy }) {
        if (this.state === 'ko') {
            return;
        }

        this.currentAttack = null;
        this.hideHitbox();
        this.health = Math.max(0, this.health - damage);
        this.setTintFill(0xffffff);
        this.scene.time.delayedCall(80, () => {
            this.clearTint();
            this.setTint(this.tintColor);
        });
        this.scene.cameras.main.shake(heavy ? 110 : 70, heavy ? 0.006 : 0.003);

        if (this.health <= 0) {
            this.setState('ko');
            this.setVelocityX(attackerFacing * knockbackX * 1.25);
            this.setVelocityY(knockbackY * 1.45);
            return;
        }

        this.setState('hurt');
        this.hurtTimer = this.hurtDuration;
        this.setVelocityX(attackerFacing * knockbackX);
        this.setVelocityY(knockbackY);
    }

    buildAttackHitbox(attackData) {
        const width = attackData.width;
        const height = attackData.height;
        const centerX = this.x + this.facing * ((this.displayWidth * 0.18) + attackData.offsetX + (width / 2));
        const centerY = this.y - (this.displayHeight * 0.33) + attackData.topOffset;

        return new Phaser.Geom.Rectangle(
            centerX - (width / 2),
            centerY - (height / 2),
            width,
            height
        );
    }

    getHurtbox() {
        const width = this.displayWidth * 0.28;
        const height = this.displayHeight * 0.36;
        const x = this.x - (width * 0.55);
        const y = this.y - (this.displayHeight * 0.41);

        return new Phaser.Geom.Rectangle(x, y, width, height);
    }

    showHitbox(attackData) {
        const hitbox = this.buildAttackHitbox(attackData);

        this.hitboxPreview.setPosition(
            hitbox.x + hitbox.width / 2,
            hitbox.y + hitbox.height / 2
        );
        this.hitboxPreview.width = hitbox.width;
        this.hitboxPreview.height = hitbox.height;
        this.hitboxPreview.setVisible(this.scene.debugHitboxes);
    }

    hideHitbox() {
        this.hitboxPreview.setVisible(false);
    }

    keepInsideArena() {
        if (!this.scene.arenaClamp) {
            return;
        }

        const minX = this.scene.arenaClamp.left + (this.displayWidth * 0.2);
        const maxX = this.scene.arenaClamp.right - (this.displayWidth * 0.2);
        const clampedX = Phaser.Math.Clamp(this.x, minX, maxX);

        if (clampedX !== this.x) {
            this.setX(clampedX);
            this.setVelocityX(0);
        }
    }

    updatePresentation() {
        if (!this.shadow) {
            return;
        }

        const floorShadowY = this.scene.floorShadowY || this.y + 10;
        const lift = Phaser.Math.Clamp((floorShadowY - this.y) / 180, 0, 0.42);

        this.shadow.setPosition(this.x, floorShadowY);
        this.shadow.setScale(1 - (lift * 0.35), 1 - (lift * 0.55));
        this.shadow.setAlpha(0.18 - (lift * 0.08));
    }

    destroy(fromScene) {
        if (this.shadow) {
            this.shadow.destroy();
        }

        if (this.hitboxPreview) {
            this.hitboxPreview.destroy();
        }

        super.destroy(fromScene);
    }

}
