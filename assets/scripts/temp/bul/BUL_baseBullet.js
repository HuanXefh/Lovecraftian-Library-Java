/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<BulletType, BUL_baseBullet>} BULBaseBullet
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BULBaseBullet} btp
     * @param {Bullet} bul
     * @param {Hitboxc} e
     * @param {number} health
     * @return {void}
     */
    function comp_hitEntity(btp, bul, e, health) {
        let wasDead = e instanceof Unit && e.dead;

        if(e instanceof Healthc) {
            let
                dmg = bul.damage * FRAG_attack.getDmgMtpByTypeMtpArr(e, btp.typeMtpArr),
                shield = e instanceof Shieldc ? Math.max(e.shield, 0.0) : 0.0;

            if(btp.maxDamageFraction > 0.0) {
                let cap = e.maxHealth * btp.maxDamageFraction + shield;
                dmg = Math.min(dmg, cap);
                health = Math.min(health, cap);
            } else {
                health += shield;
            };
            if(btp.pierceArmor) {
                e.damagePierce(dmg);
            } else {
                e.damage(dmg);
            };
        };

        if(e instanceof Unit) {
            // Knockback
            if(!btp.knockback.fEqual(0.0)) {
                Tmp.v3.set(e).sub(bul).nor().scl(btp.knockback * 80.0);
                if(btp.impact) {
                    Tmp.v3.setAngle(bul.rotation + (btp.knockback < 0.0 ? 180.0 : 0.0));
                    e.impulse(Tmp.v3);
                };
            };

            // Status effect
            e.apply(btp.status, btp.statusDuration);

            Events.fire(Reflect.get(BulletType, "bulletDamageEvent").set(e, bul));
        };

        if(!wasDead && e instanceof Unit && e.dead) {
            Events.fire(new UnitBulletDestroyEvent(e, bul));
        };

        btp.handlePierce(bul, health, e.x, e.y);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Root of all bullet types.
     * @class BUL_baseBullet
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "BUL_baseBullet")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({


        /**
         * `PARAM`: Damage multiplier on specific type of units.
         * @memberof BUL_baseBullet
         * @instance
         * @type {TDynamic<F2Array<string, number>>}
         */
        typeMtpArr: tprov(() => []),


        /* <------------------------------ vanilla ------------------------------> */


        drawSize: -1.0,
        maxRange: -1.0,
        circleShooterRadiusSmooth: -1.0,
        spawnBullets: tprov(() => []),
        parts: tprov(() => []),


    })
    .setParamParser([
        "drawSize", function(val) {
            // Calculate default draw size
            return val >= 0.0 ? val : (this.hitSize * 10.0);
        },
        "collidesTeam", function(val) {
            return this.healPercent > 0.0 || this.healAmount > 0.0;
        },
        "maxRange", function(val) {
            // Calculate max range automatically
            return val >= 0.0 ? val : (this.lifetime * this.speed);
        },
        "circleShooterRadiusSmooth", function(val) {
            return val >= 0.0 ? val : (this.circleShooterRadius * 0.7692);
        },
        "spawnBullets", function(val) {
            // Defined as array and finally converted to seq
            return tprov(() => val.get().toSeq());
        },
        "parts", function(val) {
            // Defined as array and finally converted to seq
            return tprov(() => val.get().toSeq());
        },
    ])
    .setMethod({


        hitEntity: function(bul, e, hp) {
            comp_hitEntity(this, bul, e, hp);
        }
        .setProp({
            noSuper: true,
        }),


    });
