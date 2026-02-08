/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers cache layers.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  newCacheLayer(
    "lovec-lava", fetchShader("shader0surf-flr0liq-lava"), CacheLayer.water,
  );
  newCacheLayer(
    "lovec-puddle", fetchShader("shader0surf-flr0liq-puddle"), CacheLayer.water,
  );
  newCacheLayer(
    "lovec-river", fetchShader("shader0surf-flr0liq-river"), CacheLayer.water,
  );
  newCacheLayer(
    "lovec-sea", fetchShader("shader0surf-flr0liq-sea"), CacheLayer.water,
  );
