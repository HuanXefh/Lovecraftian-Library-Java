/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Item incinerator that is actually a crafter.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentMultiSelector");
  const TRIGGER = require("lovec/glb/BOX_trigger");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_effect = require("lovec/mdl/MDL_effect");


  /* <---------- component ----------> */


  function comp_init(blk) {
    resetBlockFlag(blk, []);
    blk.group = BlockGroup.transportation;
  };


  function comp_load(blk) {
    blk.craftSe = fetchSound(blk.craftSe);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-prog", b => new Bar(
      MDL_bundle._term("lovec", "progress"),
      Pal.ammo,
      () => Mathf.clamp(b.progress, 0.0, 1.0),
    ));
  };


  function comp_craft(b) {
    MDL_effect.playAt(b.x, b.y, b.block.delegee.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);

    let flam = 0.0, explo = 0.0, pow = 0.0, amt = 0;
    b.items.each(itm => {
      if(b.block.consumesItem(itm)) return;
      if(b.block.outputItems != null && b.block.outputItems.some(itmStack => itmStack.item === itm)) return;

      amt = b.items.get(itm);
      flam += itm.flammability * amt * 3.0;
      explo += itm.explosiveness * amt * 3.0;
      pow += itm.charge * amt * 3.0;
      b.items.set(itm, 0);
    });

    if(flam > 0.0 || explo > 0.0 || pow > 0.0) {
      TRIGGER.incineratorExplosion.fire();
      Sounds.bang.at(b);
      Damage.dynamicExplosion(b.x, b.y, flam, explo, pow, FRAG_attack._presExploRad(b.block.size) / Vars.tilesize, true);
    };
  };


  function comp_acceptItem(b, b_f, itm) {
    return b.ctTgs.length === 0 ?
      b.items.total() < b.block.itemCapacity :
      b.ctTgs.includes(itm) && b.items.total() < b.block.itemCapacity;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({
      // @PARAM: See {BLK_baseFactory}.
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


      outputsItems: function() {
        return this.outputItems != null && this.outputItems.length > 0;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      craft: function() {
        comp_craft(this);
      },


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      shouldConsume: function() {
        return this.items.total() > 0;
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);
      },


    }),


  ];
