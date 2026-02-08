/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles liquid puddle.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_net = require("lovec/mdl/MDL_net");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a puddle spread and trigger something.
   * Use {boolF} to filter out tiles to spread to.
   * Use {scr} to set what will happen if tile (that can be spread to) is beneath the puddle.
   * ---------------------------------------- */
  const spreadPuddle = function thisFun(puddle, amtDepos, boolF, scr) {
    if(puddle == null) return;
    if(amtDepos == null) amtDepos = 0.5;

    MDL_pos._tsRect(puddle.tile, 1, 0, thisFun.tmpTs).forEachFast(ot => {
      if(boolF != null && boolF(ot)) {
        Puddles.deposit(ot, puddle.liquid, Time.delta * amtDepos);
        if(ot === puddle.tile && scr != null) scr(ot);
      };
    });
  }
  .setProp({
    tmpTs: [],
  });
  exports.spreadPuddle = spreadPuddle;


  /* ----------------------------------------
   * NOTE:
   *
   * Change the liquid of a puddle.
   * ---------------------------------------- */
  const changePuddle = function(puddle, liq_gn, mtp) {
    if(puddle == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null || liq === puddle.liquid) return;

    let amt = puddle.amount * tryVal(mtp, 1.0);
    let t = puddle.tile;

    puddle.remove();
    Puddles.deposit(t, liq, amt);
  };
  exports.changePuddle = changePuddle;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {changePuddle} that syncs.
   * ---------------------------------------- */
  const changePuddle_global = function(puddle, liq_gn, mtp) {
    if(puddle == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null || liq === puddle.liquid) return;

    changePuddle(puddle, liq, mtp);

    MDL_net.sendPacket(
      "both", "lovec-both-puddle-change",
      packPayload([
        puddle.id, liq.name, mtp,
      ]),
      false, true,
    );
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("both", "lovec-both-puddle-change", payload => {
      let args = unpackPayload(payload);
      changePuddle(Groups.puddle.getById(args[0], args[1], args[2]));
    });
  });
  exports.changePuddle_global = changePuddle_global;
