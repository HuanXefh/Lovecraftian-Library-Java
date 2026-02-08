/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new consumers.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const VAR = require("lovec/glb/GLB_var");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- special ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Consumes one liquid among a list of liquids, where each liquid has an efficiency multiplier.
   * ---------------------------------------- */
  newConsumer(
    "ConsumeLiquidEfficiencyMap",
    (paramObj) => extend(
      ConsumeLiquidFilter,
      (function() {
        let arr = readParam(paramObj, "liqEffcMap", Array.air).readCol(2, 0);
        return liq => arr.includes(liq.name);
      })(),
      readParam(paramObj, "amt", 0.0),
      {


        effcMap: readParam(paramObj, "liqEffcMap", Array.air).toObjMap(),


        display(stats) {
          stats.add(this.booster ? Stat.booster : Stat.input, newStatValue(tb => {
            this.effcMap.each((nmLiq, effc) => {
              let liq = Vars.content.liquid(nmLiq);
              if(liq == null) return;
              tb.row();
              tb.table(Styles.none, tb1 => {
                tb1.left();
                MDL_table.__rcCt(tb1, liq, this.amount).left().marginLeft(24.0);
                tb1.add(effc.perc(0)).color(Color.gray).left().padLeft(72.0);
              }).left();
            });
          }));
        },


        efficiency(b) {
          let liq = this.getConsumed(b);
          return liq == null ?
            0.0 :
            (this.super$efficiency(b) * this.effcMap.get(liq.name, 0.0));
        },


        ex_setRcDict(blk, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) {
          let liq;
          this.effcMap.each((nmLiq, effc) => {
            liq = Vars.content.liquid(nmLiq);
            if(liq == null) return;
            dictConsFld[liq.id].push(blk, this.amount, {});
          });
        },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * A power consumer that releases lightning arcs, used by some metallic conduits.
   * Triggered manually.
   * ---------------------------------------- */
  newConsumer(
    "ConsumePowerShortCircuitPipe",
    (paramObj) => extend(ConsumePower, {


      usage: readParam(paramObj, "amt", 0.0),
      dmgMtp: readParam(paramObj, "dmgMtp", 1.0),


      display(stats) {},


      trigger(b) {
        if(b.liquids == null || !tryJsProp(b.liquids.current(), "isConductive", false)) return;
        if(b.power == null || b.power.status < 0.0001) return;

        TRIGGER.poweredMetalPipe.fire();
        FRAG_attack._a_lightning(b.x, b.y, null, VAR.blk_lightningDmg * b.power.status * this.dmgMtp, null, 6, 4, null, "ground");
      },


      efficiency(b) {
        return 1.0;
      },


    }),
  );
