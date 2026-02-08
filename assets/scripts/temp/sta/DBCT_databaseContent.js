/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A special type of content that is only shown in database.
   * Technically a status effect, do not apply it!
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");


  /* <---------- component ----------> */


  function comp_setStats(sta) {
    sta.stats.remove(Stat.damageMultiplier);
    sta.stats.remove(Stat.healthMultiplier);
    sta.stats.remove(Stat.speedMultiplier);
    sta.stats.remove(Stat.reloadMultiplier);
    sta.stats.remove(Stat.buildSpeedMultiplier);
    sta.stats.remove(Stat.damage);
    sta.stats.remove(Stat.frequency);
    sta.stats.remove(Stat.healing);
    sta.stats.remove(Stat.affinities);
    sta.stats.remove(Stat.opposites);
    sta.stats.remove(Stat.reactive);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags()
  .setParam({
    allDatabaseTabs: false,
  })
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


    showUnlock: function() {
      return true;
    }
    .setProp({
      noSuper: true,
    }),


    isHidden: function() {
      return !this.show;
    }
    .setProp({
      noSuper: true,
    }),


    ex_checkDbctUnlocked: function() {
      return this.unlocked || global.lovecUtil.prop.debug;
    }
    .setProp({
      noSuper: true,
    }),


  });
