/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers cache layers.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  newShaderCacheLayer(
    "lovec-lava", fetchShader("shader0surf-flr0liq-lava"), CacheLayer.water,
  );
  newShaderCacheLayer(
    "lovec-puddle", fetchShader("shader0surf-flr0liq-puddle"), CacheLayer.water,
  );
  newShaderCacheLayer(
    "lovec-river", fetchShader("shader0surf-flr0liq-river"), CacheLayer.water,
  );
  newShaderCacheLayer(
    "lovec-sea", fetchShader("shader0surf-flr0liq-sea"), CacheLayer.water,
  );
