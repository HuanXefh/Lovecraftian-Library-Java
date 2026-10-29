/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Registers bullet flying modes.
     * @module lovec/tp/TP_bulletFlyingMode
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    exports.constant = new CLS_bulletFlyingMode("constant", bul => 1.0);
    exports.ballistic = new CLS_bulletFlyingMode("ballistic", bul => 1.0 - Math.pow(bul.fin() * 2.0 - 1.0, 2));
    exports.drop = new CLS_bulletFlyingMode("drop", bul => bul.fout());
    exports.lift = new CLS_bulletFlyingMode("lift", bul => bul.fin());
