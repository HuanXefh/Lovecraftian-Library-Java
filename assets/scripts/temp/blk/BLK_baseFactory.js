/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ import ------------------------------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_facilityBlock");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_terrainHandler");


  /* <------------------------------ component ------------------------------> */


  function comp_init(blk) {
    blk.priority = VAR.priority.fac;
    if(blk.setupVanillaProp) {
      if(blk.liquidOutputDirections != null) {
        blk.drawArrow = blk.liquidOutputDirections.length === 1 && blk.liquidOutputDirections[0] === -1;
      };
    };

    if(blk.rcMajorIo == null) {
      let
        amtItem = null,
        amtLiq = null,
        isWasteItem = false,
        isWasteLiq = false;
      if(blk.outputItems != null && blk.outputItems.length > 0) {
        amtItem = blk.outputItems[0].amount;
        isWasteItem = MDL_cond.isWaste(blk.outputItems[0]);
      };
      if(blk.outputLiquids != null && blk.outputLiquids.length > 0) {
        amtLiq = blk.outputLiquids[0].amount * 10.0;
        isWasteLiq = MDL_cond.isWaste(blk.outputLiquids[0]);
      };
      if(amtItem != null && amtLiq != null) {
        if((!isWasteItem && !isWasteLiq) || (isWasteItem && isWasteLiq)) {
          blk.rcMajorIo = amtItem >= amtLiq ? blk.outputItems[0].item : blk.outputLiquids[0].liquid;
        } else {
          blk.rcMajorIo = isWasteItem ? blk.outputLiquids[0].liquid : blk.outputItems[0].item
        };
      } else if(amtItem != null) {
        blk.rcMajorIo = blk.outputItems[0].item;
      } else if(amtLiq != null) {
        blk.rcMajorIo = blk.outputLiquids[0].liquid;
      };
    };
  };


  function comp_load(blk) {
    blk.craftSe = fetchSound(blk.craftSe);
  };


  function comp_setBars(blk) {
    if(!VAR.isMindustryX) {
      blk.addBar("lovec-prog", b => new Bar(
        prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.progress.perc(0))),
        prov(() => Pal.ammo),
        () => Mathf.clamp(b.progress, 0.0, 1.0),
      ));
    };
  };


  function comp_created(b) {
    Time.run(0.0, () => {
      if(isNaN(b.warmup)) b.warmup = 0.0;
      if(isNaN(b.progress)) b.progress = 0.0;
    });
  };


  function comp_craft(b) {
    MDL_sound.playAt(b.x, b.y, b.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
  };


  function comp_acceptItem(b, b_f, item) {
    if(!b.block.rotate || b.block.delegee.inputDirs.length === 0) return true;

    return b.block.delegee.inputDirs.some(offRot => b.relativeTo(b_f) === Mathf.mod(b.rotation + offRot, 4));
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(!b.block.rotate || b.block.delegee.fldInputDirs.length === 0 || MDL_cond.isAuxiliaryFluid(liq)) return true;

    return b.block.delegee.fldInputDirs.some(offRot => b.relativeTo(b_f) === Mathf.mod(b.rotation + offRot, 4));
  };


  function comp_canDump(b, b_t, item) {
    if(!b.block.rotate || b.block.delegee.outputDirs.length === 0) return true;

    return b.block.delegee.outputDirs.some(offRot => b.relativeTo(b_t) === Mathf.mod(b.rotation + offRot, 4));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Parent for all factories.
     * This template also serves as the Lovec version of {@link GenericCrafter}.
     * @class BLK_baseFactory
     * @extends BLK_baseBlock
     * @extends INTF_BLK_facilityBlock
     * @extends INTF_BLK_terrainHandler
     */
    newClass().extendClass(PARENT[0], "BLK_baseFactory").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Relative directions of item input sides.
       * @memberof BLK_baseFactory
       * @instance
       */
      inputDirs: tprov(() => []),
      /**
       * `PARAM`: Relative directions of fluid input sides (not abstract fluid).
       * @memberof BLK_baseFactory
       * @instance
       */
      fldInputDirs: tprov(() => []),
      /**
       * `PARAM`: Relative directions of item output sides.
       * @memberof BLK_baseFactory
       * @instance
       */
      outputDirs: tprov(() => []),
      /**
       * `PARAM`: Major output for this recipe. If null, this will be automatically set.
       * @memberof BLK_baseFactory
       * @instance
       * @type {UnlockableContent|null}
       */
      rcMajorIo: null,
      /**
       * `PARAM`: Sound played when this building crafts.
       * @memberof BLK_baseFactory
       * @instance
       */
      craftSe: Sounds.unset,


    })
    .setParamAlias([
      "craftEff", "craftEffect", Fx.none,
      "updateEff", "updateEffect", Fx.none,
      "updateEffP", "updateEffectChance", 0.02,
    ])
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
     * @class B_baseFactory
     * @extends B_baseBlock
     * @extends INTF_B_facilityBlock
     * @extends INTF_B_terrainHandler
     */
    newClass().extendClass(PARENT[1], "B_baseFactory").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------> */


      /**
       * `INTERNAL`
       * @memberof B_baseFactory
       * @instance
       * @type {UnlockableContent|null}
       */
      blk$rcMajorIo: TmpStateTag.needReplace,


    })
    .setMethod({


      created: function() {
        comp_created(this);
      },


      craft: function() {
        comp_craft(this);
      },


      acceptItem: function(b_f, item) {
        return comp_acceptItem(this, b_f, item);
      }
      .setProp({
        boolMode: "and",
      }),


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        boolMode: "and",
      }),


      canDump: function(b_t, item) {
        return comp_canDump(this, b_t, item);
      }
      .setProp({
        boolMode: "and",
      }),


      draw: function() {
        this.ex_drawRcIcon();
      },


      /**
       * `REALIZED`
       * @override
       * @memberof B_baseFactory
       * @instance
       * @func
       * @return {TextureRegion|null}
       */
      ex_getRcIcon: function() {
        return this.blk$rcMajorIo == null ?
          null :
          this.blk$rcMajorIo.uiIcon;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
