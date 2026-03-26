export class SimpleCPU {

    constructor(fighter, target) {
        this.fighter = fighter;
        this.target = target;
        this.nextDecisionAt = 0;
        this.nextAttackAt = 0;
        this.nextJumpAt = 0;
        this.moveDirection = 0;
        this.pendingJump = false;
        this.pendingLight = false;
        this.pendingHeavy = false;
    }

    update(time) {
        if (time >= this.nextDecisionAt) {
            this.makeDecision(time);
        }

        const input = {
            left: this.moveDirection < 0,
            right: this.moveDirection > 0,
            jump: this.pendingJump,
            light: this.pendingLight,
            heavy: this.pendingHeavy
        };

        this.pendingJump = false;
        this.pendingLight = false;
        this.pendingHeavy = false;

        return input;
    }

    makeDecision(time) {
        const distance = this.target.x - this.fighter.x;
        const absDistance = Math.abs(distance);
        const verticalGap = Math.abs(this.target.y - this.fighter.y);
        const direction = Math.sign(distance) || 1;

        if (absDistance > 170) {
            this.moveDirection = direction;
        } else if (absDistance < 85) {
            this.moveDirection = Math.random() < 0.45 ? -direction : 0;
        } else {
            this.moveDirection = Math.random() < 0.7 ? direction : 0;
        }

        if (
            this.fighter.isGrounded()
            && time >= this.nextJumpAt
            && absDistance > 130
            && Math.random() < 0.16
        ) {
            this.pendingJump = true;
            this.nextJumpAt = time + Phaser.Math.Between(1400, 2600);
        }

        if (
            time >= this.nextAttackAt
            && absDistance <= 115
            && verticalGap <= 80
        ) {
            if (absDistance < 78 && Math.random() < 0.45) {
                this.pendingHeavy = true;
            } else {
                this.pendingLight = true;
            }

            this.nextAttackAt = time + Phaser.Math.Between(360, 820);
        }

        this.nextDecisionAt = time + Phaser.Math.Between(100, 190);
    }

}
