/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


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


    /**
     * Makes a block possible to output loot instead of items.
     * @class INTF_BLK_lootProducer
     */
    new CLS_interface("INTF_BLK_lootProducer", {


      init: function() {
        comp_init(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      /**
       * Expected craft time of this block.
       * <br> <LATER>
       * @memberof INTF_BLK_lootProducer
       * @instance
       * @return {number}
       */
      ex_getCraftTime: function() {
        return Number.n8;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class INTF_B_lootProducer
     */
    new CLS_interface("INTF_B_lootProducer", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_lootProducer
         * @instance
         */
        lootDumpX: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_lootProducer
         * @instance
         */
        lootDumpY: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_lootProducer
         * @instance
         */
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


      /**
       * If true, this building outputs loot instead of items.
       * Override this method if you're making mixed output.
       * @memberof INTF_B_lootProducer
       * @instance
       * @return {boolean}
       */
      ex_shouldDropLoot: function() {
        return true;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_lootProducer
       * @instance
       * @return {number}
       */
      ex_getProg: function() {
        return comp_ex_getProg(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Expected time spent on current recipe.
       * <br> <LATER>
       * @memberof INTF_B_lootProducer
       * @instance
       * @return {number}
       */
      ex_getCraftTimeCur: function() {
        return 0.0;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Expected amount of items to dump for each loot.
       * @memberof INTF_B_lootProducer
       * @instance
       * @return {number}
       */
      ex_getDumpAmt: function() {
        return this.block.itemCapacity;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_lootProducer
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,
          (wr, revi) => {
            wr.i(this.lootCharge);
          },

          (rd, revi) => {
            if(revi === 5) {
              return;
            };
            
            this.lootCharge = rd.i();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
