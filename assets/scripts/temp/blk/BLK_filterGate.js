/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.config(JAVA.boolean, (b, bool) => {
      if(bool !== b.delegee.isInv) {
        b.delegee.isInv = bool;
        EFF.placeFadePack[b.block.size].at(b);
        TRIGGER.invertSelection.fire();
      };
    });

    blk.config(JAVA.object_arr, (b, cfgArr) => {
      switch(cfgArr[0]) {
        case "selectorBlock" :
          b.sortItem = MDL_content._ct(cfgArr[1], "rs");
          b.delegee.isInv = cfgArr[2];
          EFF.placeFadePack[b.block.size].at(b);
          break;
      };
    });
  };


  function comp_load(blk) {
    blk.invReg = fetchRegion(blk, "-inv");
  };


  function comp_setBars(blk) {
    blk.removeBar("items");
  };


  function comp_getTileTarget(b, itm, b_f, isFlip) {
    let rot = b_f.relativeTo(b);
    let b_t = b.nearby(rot);
    let tg = null;

    if((b.block.delegee.filterScrTup[0](b, b_f, itm) !== b.isInv) === b.enabled) {
      if(b.isSame(b_f) && b.isSame(b_t)) return tg;
      tg = b_t;
    } else {
      let b_s1 = b.nearby(Mathf.mod(rot - 1, 4));
      let b_s2 = b.nearby(Mathf.mod(rot + 1, 4));
      let cond1 = b_s1 != null && b_s1.team === b.team && !(b_s1.block.instantTransfer && b_f.block.instantTransfer) && b_s1.acceptItem(b, itm);
      let cond2 = b_s2 != null && b_s2.team === b.team && !(b_s2.block.instantTransfer && b_f.block.instantTransfer) && b_s2.acceptItem(b, itm);

      if(cond1 && !cond2) {
        tg = b_s1;
      } else if(!cond1 && cond2) {
        tg = b_s2;
      } else if(!cond2) {
        return tg;
      } else {
        tg = (b.rotation & (1 << rot)) === 0 ? b_s1 : b_s2;
        if(isFlip) b.rotation ^= (1 << rot);
      };
    };

    return tg;
  };


  function comp_buildConfiguration(b, tb) {
    if(!b.block.delegee.hideSelection) {
      MDL_table._s_ct(
        tb, b.block, Vars.content.items().toArray(),
        () => b.sortItem, val => b.configure(val), false,
        b.block.selectionRows, b.block.selectionColumns,
      );
    };

    tb.row();
    MDL_table.__btnCfgToggle(tb, b, VARGEN.icons.swap, VARGEN.icons.swap, b.isInv)
    .tooltip(MDL_bundle._info("lovec", "tt-invert-selection"), true);
  };


  function comp_draw(b) {
    if(b.isInv) {
      Draw.rect(b.block.delegee.invReg, b.x, b.y);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Sorter with `blk.invert` being useless.
     * <br> <SINGLESIZE>
     * @class BLK_filterGate
     * @extends BLK_baseItemGate
     */
    newClass().extendClass(PARENT[0], "BLK_filterGate").initClass()
    .setParent(Sorter)
    .setTags("blk-dis", "blk-gate")
    .setParam({


      /**
       * <PARAM>: Item is selected when this returns true.
       * <ARGS>: b, b_f, itm.
       * @memberof BLK_filterGate
       * @instance
       */
      filterScrTup: prov(() => [(b, b_f, itm) => itm === b.sortItem]),
      /**
       * <PARAM>: If true, item selector will be hidden.
       * @memberof BLK_filterGate
       * @instance
       */
      hideSelection: false,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_filterGate
       * @instance
       */
      invReg: null,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class B_filterGate
     * @extends B_baseItemGate
     */
    newClass().extendClass(PARENT[1], "B_filterGate").initClass()
    .setParent(Sorter.SorterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_filterGate
       * @instance
       */
      isInv: false,


    })
    .setMethod({


      getTileTarget: function(itm, b_f, isFlip) {
        return comp_getTileTarget(this, itm, b_f, isFlip);
      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return [
          "selectorBlock",
          this.sortItem == null ? "null" : this.sortItem.name,
          this.isInv,
        ].toJavaArr(JAVA.object);
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        MDL_io._wr_ct(wr, this.sortItem);
        wr.bool(this.isInv);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.sortItem = MDL_io._rd_ct(rd);
        this.isInv = rd.bool();
      },


    }),


  ];
