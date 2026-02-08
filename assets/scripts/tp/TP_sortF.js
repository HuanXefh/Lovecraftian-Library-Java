/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers target sorting functions.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  newPropSortF("smallest", (unit, x, y) => unit.hitSize);
  newPropSortF("largest", (unit, x, y) => -unit.hitSize);
  newPropSortF("slowest", (unit, x, y) => unit.speed());
  newPropSortF("fastest", (unit, x, y) => -unit.speed());
  newPropSortF("lowestHealth", (unit, x, y) => unit.health);
  newPropSortF("highestHealth", (unit, x, y) => -unit.health);
  newPropSortF("lowestShield", (unit, x, y) => unit.shield);
  newPropSortF("highestShield", (unit, x, y) => -unit.shield);
  newPropSortF("flying", (unit, x, y) => unit.flying ? -Number.n8 : 0.0);
  newPropSortF("player", (unit, x, y) => unit.isPlayer() ? -Number.n8 : 0.0);
  newPropSortF("luckiest", (unit, x, y) => Mathf.randomSeed(unit.id, 0.0, Number.n8));
