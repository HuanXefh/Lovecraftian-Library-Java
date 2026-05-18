/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new shoot patterns.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Like {@link ShootSpread} but repetitively.
   * <br> <DEDICATION>: Inspired by Psammos.
   */
  newShootPattern(
    "ShootBurst",
    paramObj => extend(ShootPattern, {


      shots: readParam(paramObj, "burstAmt", 1) * readParam(paramObj, "burstShotAmt", 1),
      firstShotDelay: readParam(paramObj, "firstShotDelay", 0.0),
      shotDelay: readParam(paramObj, "shotDelay", 0.0),
      spread: readParam(paramObj, "spread", 5.0),
      burstAmt: readParam(paramObj, "burstAmt", 1),
      burstShotAmt: readParam(paramObj, "burstShotAmt", 1),
      burstDelay: readParam(paramObj, "burstDelay", 0.0),


      shoot(shotAmt, bulHandler, barrelIncreF) {
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


    }),
  );
