/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new shoot patterns.
   * @module lovec/tp/TP_shoot
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Like {@link ShootSpread} but repetitively.
   * <br> `DEDICATION`: Inspired by Psammos.
   * @type {FFunction<Object, ShootPattern>}
   */
  const ShootBurst = paramObj => extend(ShootPattern, {


      /** @type {number} */
      shots: readParam(paramObj, "burstAmt", 1) * readParam(paramObj, "burstShotAmt", 1),
      /** @type {number} */
      firstShotDelay: readParam(paramObj, "firstShotDelay", 0.0),
      /** @type {number} */
      shotDelay: readParam(paramObj, "shotDelay", 0.0),
      /** @type {number} */
      spread: readParam(paramObj, "spread", 5.0),
      /** @type {number} */
      burstAmt: readParam(paramObj, "burstAmt", 1),
      /** @type {number} */
      burstShotAmt: readParam(paramObj, "burstShotAmt", 1),
      /** @type {number} */
      burstDelay: readParam(paramObj, "burstDelay", 0.0),


      /**
       * @param {number} shotAmt
       * @param {ShootPattern.BulletHandler} bulHandler
       * @param {java.lang.Runnable} barrelIncrementer
       * @return {void}
       */
      shoot(shotAmt, bulHandler, barrelIncrementer) {
          let i = 0, j, offAng;
          while(i < this.burstAmt) {
              j = 0;
              while(j < this.burstShotAmt) {
                  offAng = j * this.spread - (this.burstShotAmt - 1) * this.spread * 0.5;
                  bulHandler.shoot(0.0, 0.0, offAng, this.firstShotDelay + this.shotDelay * j + this.burstDelay * i);
                  j++;
              };
              i++;
          };
      },


  });
  newShootPattern("ShootBurst", ShootBurst);
  exports.ShootBurst = ShootBurst;
