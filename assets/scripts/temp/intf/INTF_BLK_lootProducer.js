/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Makes a block drop loot instead of outputting items.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.drawArrow = blk.rotate;
    };

    blk.ex_addLogicGetter(LAccess.progress, b => b.ex_getProg());
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-prog", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.ex_getProg().perc(0))),
      prov(() => Pal.ammo),
      () => Mathf.clamp(b.ex_getProg()),
    ));
  };


  function comp_onProximityUpdate(b) {
    if(!b.block.rotate) {
      b.lootDumpX = b.x;
      b.lootDumpY = b.y;
    } else {
      let coords = MDL_pos._coordsBack(b.x, b.y, b.block.size, b.rotation);
      b.lootDumpX = coords[0];
      b.lootDumpY = coords[1];
    };
  };


  function comp_pickedUp(b) {
    b.lootDumpX = b.lootDumpY = null;
  };


  function comp_offload(b, itm) {
    if(!b.ex_shouldDropLoot()) {
      b.super$offload(itm);
      return;
    };
    if(b.lootDumpX == null || b.lootDumpY == null) return;

    b.lootCharge++;
    if(b.lootCharge >= b.ex_getDumpAmt()) {
      b.lootCharge = 0;
      FRAG_item.produceLootAt(b.lootDumpX, b.lootDumpY, b, itm, b.ex_getDumpAmt(), true);
    };
  };


  function comp_ex_getProg(b) {
    return !b.ex_shouldDropLoot() ?
      b.ex_getCraftTimeCur() / b.block.ex_getCraftTime() :
      (b.lootCharge * b.block.ex_getCraftTime() + b.ex_getCraftTimeCur()) / (b.block.itemCapacity * b.block.ex_getCraftTime());
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      init: function() {
        comp_init(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns time required for the recipe.
       * ---------------------------------------- */
      ex_getCraftTime: function() {
        return Number.n8;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        lootDumpX: null,
        lootDumpY: null,
        lootCharge: 0,
      }),


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      offload: function(itm) {
        comp_offload(this, itm);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * If {true}, this building will output loot instead of items.
       * Change this if you are making mixed output.
       * ---------------------------------------- */
      ex_shouldDropLoot: function() {
        return true;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getProg: function() {
        return comp_ex_getProg(this);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns current time of the recipe.
       * ---------------------------------------- */
      ex_getCraftTimeCur: function() {
        return 0.0;
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Amount of items to dump.
       * ---------------------------------------- */
      ex_getDumpAmt: function() {
        return this.block.itemCapacity;
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            wr.i(this.lootCharge);
          },

          (rd, revi) => {
            this.lootCharge = rd.i();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
