/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentMultiSelector");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_fluidTypeFilter");


  /* <---------- auxiliary ----------> */


  const EXPLO_FLAM_THR = 0.5;


  /* <---------- component ----------> */


  function comp_init(blk) {
    resetBlockFlag(blk, []);
    blk.group = BlockGroup.transportation;

    blk.outputsLiquid = blk.outputLiquids != null && blk.outputLiquids.length > 0;
  };


  function comp_load(blk) {
    blk.craftSe = fetchSound(blk.craftSe);
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.productionTime);
    blk.stats.add(Stat.productionTime, blk.craftTime / 60.0, StatUnit.seconds);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-prog", b => new Bar(
      MDL_bundle.getTerm("lovec", "progress"),
      Pal.ammo,
      () => Mathf.clamp(b.progress, 0.0, 1.0),
    ));
  };


  function comp_updateTile(b) {
    if(b.efficiency < 0.0001) {
      b.progress = 0.0;
    };

    if(TIMER.sec) {
      if(b.items != null && !b.justCrafted) {
        b.hasItemTarget = false;
        b.items.each(item => {
          if(b.hasItemTarget) return;
          if(!b.block.consumesItem(item)) {
            b.hasItemTarget = true;
          };
        });
      };

      if(b.liquids != null && !b.justCrafted) {
        b.hasLiqTarget = false;
        b.liquids.each((liq, amt) => {
          if(b.hasLiqTarget) return;
          if(!b.block.consumesLiquid(liq) && amt > 1.0) {
            b.hasLiqTarget = true;;
          };
        });
      };

      // Skip a round for consistent incineration
      b.justCrafted = false;
    };
  };


  function comp_craft(b) {
    MDL_sound.playAt(b.x, b.y, b.block.delegee.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);

    let
      flam = 0.0,
      explo = 0.0,
      pow = 0.0,
      canExplo = b.ex_canExploIncinerate(),
      amt;

    if(b.items != null) {
      b.items.each(item => {
        if(b.block.consumesItem(item)) return;
        if(b.block.outputItems != null && b.block.outputItems.some(itemStack => itemStack.item === item)) return;

        amt = b.items.get(item);
        if(canExplo) {
          flam += (item.flammability < EXPLO_FLAM_THR ? 0.0 : item.flammability) * amt * 3.0;
          explo += item.explosiveness * amt * 3.0;
          pow += item.charge * amt * 3.0;
        };
        b.items.set(item, 0);
      });
    };
    if(b.liquids != null) {
      b.liquids.each((liq, amt) => {
        if(b.block.consumesLiquid(liq) || amt < 0.01) return;
        if(b.block.outputLiquids != null && b.block.outputLiquids.some(liqStack => liqStack.liquid === liq)) return;

        if(canExplo) {
          flam += (liq.flammability < EXPLO_FLAM_THR ? 0.0 : liq.flammability) * amt * 30.0;
          explo += liq.explosiveness * amt * 30.0;
        };
        b.liquids.set(liq, 0.0);
      });
    };

    if(flam > 0.0 || explo > 0.0 || pow > 0.0) {
      TRIGGER.incineratorExplosion.fire();
      Sounds.unitExplode1.at(b);
      Damage.dynamicExplosion(b.x, b.y, flam, explo, pow, FRAG_attack.getPresExploRad(b.block.size) / Vars.tilesize, true);
    };

    b.justCrafted = true;
  };


  function comp_acceptItem(b, b_f, item) {
    if(b.items == null) return false;
    if(b.block.consumesItem(item) && b.items.get(item) < b.getMaximumAccepted(item)) return true;
    if(!b.block.delegee.itemTargetFilter.get(item)) return false;

    return b.ctTargets.length === 0 ?
      b.items.total() < b.block.itemCapacity :
      b.ctTargets.includes(item) && b.items.total() < b.block.itemCapacity;
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(b.liquids == null) return false;
    if(b.liquids.get(liq) / b.block.liquidCapacity >= 0.98) return false;
    if(b.block.consumesLiquid(liq)) return true;
    if(!b.block.delegee.liqTargetFilter.get(liq)) return false;

    return b.ctTargets.length === 0 || b.ctTargets.includes(liq);
  };


  function comp_drawSelect(b) {
    b.ex_drawSelected();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Incinerator that is actually a crafter.
     * @class BLK_incinerator
     * @extends BLK_baseItemBlock
     * @extends INTF_BLK_contentMultiSelector
     */
    newClass().extendClass(PARENT[0], "BLK_incinerator").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-non-fac")
    .setParam({


      /**
       * `PARAM`: If true, explosion can happen if explosive resource is consumed.
       * @memberof BLK_incinerator
       * @instance
       */
      hasExploIncineration: true,
      /**
       * `PARAM`: Extra filter for valid item.
       * <br> `ARGS`: item.
       * @memberof BLK_incinerator
       * @instance
       */
      itemTargetFilter: tprov(() => func(function(item) {return true})),
      /**
       * `PARAM`: Extra filter for valid fluid.
       * <br> `ARGS`: liq.
       * @memberof BLK_incinerator
       * @instance
       */
      liqTargetFilter: tprov(() => func(function(liq) {return true})),
      /**
       * `PARAM`: See {@link BLK_baseFactory}.
       * @memberof BLK_incinerator
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


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      outputsItems: function() {
        return this.outputItems != null && this.outputItems.length > 0;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof BLK_incinerator
       * @instance
       * @return {Array<UnlockableContent>}
       */
      ex_findSelectionTargets: function() {
        let arr = [];
        if(this.hasItems) {
          arr.pushAll(Vars.content.items().select(item => this.itemTargetFilter.get(item)).toArray());
        };
        if(this.hasLiquids) {
          if(this.fldType === "liquid") {
            arr.pushAll(Vars.content.liquids().select(liq => !liq.gas && this.liqTargetFilter.get(liq)).toArray());
          } else if(this.fldType === "gas") {
            arr.pushAll(Vars.content.liquids().select(liq => liq.gas && this.liqTargetFilter.get(liq)).toArray());
          } else {
            arr.pushAll(Vars.content.liquids().select(liq => this.liqTargetFilter.get(liq)).toArray());
          };
        };

        return arr;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof BLK_incinerator
       * @instance
       * @return {boolean}
       */
      ex_isSwitchDisableTarget: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_incinerator
     * @extends B_baseItemBlock
     * @extends INTF_B_contentMultiSelector
     */
    newClass().extendClass(PARENT[1], "B_incinerator").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_incinerator
       * @instance
       */
      hasItemTarget: false,
      /**
       * `INTERNAL`
       * @memberof B_incinerator
       * @instance
       */
      hasLiqTarget: false,
      /**
       * `INTERNAL`
       * @memberof B_incinerator
       * @instance
       */
      justCrafted: false,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      craft: function() {
        comp_craft(this);
      },


      acceptItem: function(b_f, item) {
        return comp_acceptItem(this, b_f, item);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      shouldConsume: function() {
        return this.hasItemTarget || this.hasLiqTarget;
      }
      .setProp({
        noSuper: true,
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
      },


      /**
       * Whether explosion can happen.
       * @memberof B_incinerator
       * @instance
       * @return {boolean}
       */
      ex_canExploIncinerate: function() {
        return Vars.state.rules.reactorExplosions && this.block.delegee.hasExploIncineration;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
