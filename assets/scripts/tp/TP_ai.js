/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new unit AIs.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_ai = require("lovec/mdl/MDL_ai");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- attack ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Only targets missiles in range.
   * ---------------------------------------- */
  newAi(
    "missile-interceptor",
    (paramObj) => extend(MissileAI, {


      updateMovement() {
        this.unloadPayloads();

        let time = this.unit instanceof TimedKillc ? unit.time : 999999.0;
        if(time >= unit.type.homingDelay && this.shooter != null && !this.shooter.dead) {
          this.unit.lookAt(this.shooter.aimX, this.shooter.aimY);
        };

        this.unit.moveAt(Reflect.get(AIController, this, "vec").trns(
          this.unit.rotation,
          this.unit.type.missileAccelTime < 0.0001 ?
            this.unit.speed() :
            Mathf.pow(Math.min(time / unit.type.missileAccelTime, 1.0), 2.0) * unit.speed(),
        ));
      },


      target(x, y, rad, targetAir, targetGround) {
        return MDL_pos._eTg(x, y, this.unit.team, rad, true, false, e => e.isMissile());
      },


    }),
  );


  /* <---------- support ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Mines selected item and offload it into {dockB}.
   * If this unit has any weapon, it will attack enemies in range.
   * ---------------------------------------- */
  newAi(
    "miner",
    (paramObj) => extend(AIController, {


      maxAttackDst: readParam(paramObj, "maxAttackDst", -1.0),
      dockB: null,
      oreT: null,
      isMining: false,
      timerOreFind: new Interval(1),


      updateMovement() {
        if(!MDL_ai.comp_updateMovement_attack(this, this.unit)) {
          if(this.dockB != null) {
            MDL_ai.comp_updateMovement_mine(this, this.unit, this.dockB, this.dockB.delegee.rsTg, this.dockB.block.delegee.blkR * Vars.tilesize);
          };
        };
      },


    }),
  );
