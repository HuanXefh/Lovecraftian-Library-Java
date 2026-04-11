/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles liquid puddle.
   * @module lovec/frag/FRAG_puddle
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Lets a puddle spread and trigger something.
   * @param {Puddle} puddle
   * @param {number|unset} amtDepos
   * @param {function(Tile): boolean} boolF - Whether some tile is spreadable.
   * @param {function(Tile): void} scr - Called when puddle is on some tile.
   * @return {void}
   */
  const spreadPuddle = function thisFun(puddle, amtDepos, boolF, scr) {
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


  /**
   * Change the liquid of a puddle.
   * @param {Puddle} puddle
   * @param {LiquidGn} liq_gn
   * @param {number|unset} [mtp]
   * @return {void}
   */
  const changePuddle = function(puddle, liq_gn, mtp) {
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null || liq === puddle.liquid) return;

    let amt = puddle.amount * tryVal(mtp, 1.0);
    let t = puddle.tile;

    puddle.remove();
    Puddles.deposit(t, liq, amt);
  };
  exports.changePuddle = changePuddle;


  /**
   * Variant of {@link changePuddle} for sync.
   * @param {Puddle} puddle
   * @param {LiquidGn} liq_gn
   * @param {number|unset} [mtp]
   * @return {void}
   */
  const changePuddle_global = function(puddle, liq_gn, mtp) {
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
      changePuddle(Groups.puddle.getById(args[0]), args[1], args[2]);
    });
  });
  exports.changePuddle_global = changePuddle_global;
