/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers target sorting functions.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  function sumCrowdHealth(unit, x, y) {
    let sum = 0.0;
    MDL_pos._it_units(x, y, VAR.range.sortCrowdRad, unit.team, ounit => unit.flying === ounit.flying, ounit => {
      sum += ounit.health;
    });
    return sum;
  };


  newPropSortF("smallest", (unit, x, y) => unit.hitSize);
  newPropSortF("largest", (unit, x, y) => -unit.hitSize);
  newPropSortF("slowest", (unit, x, y) => unit.speed());
  newPropSortF("fastest", (unit, x, y) => -unit.speed());
  newPropSortF("lowestHealth", (unit, x, y) => unit.health);
  newPropSortF("highestHealth", (unit, x, y) => -unit.health);
  newPropSortF("lowestCrowdHealth", (unit, x, y) => sumCrowdHealth(unit, x, y));
  newPropSortF("highestCrowdHealth", (unit, x, y) => -sumCrowdHealth(unit, x, y));
  newPropSortF("flying", (unit, x, y) => unit.flying ? -Number.n8 : 0.0);
  newPropSortF("player", (unit, x, y) => unit.isPlayer() ? -Number.n8 : 0.0);
  newPropSortF("luckiest", (unit, x, y) => Mathf.randomSeed(unit.id, 0.0, Number.n8));
