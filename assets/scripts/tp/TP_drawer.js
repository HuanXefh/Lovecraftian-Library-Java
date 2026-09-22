/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new drawers.
   * @module lovec/tp/TP_drawer
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ special ------------------------------> */


  /**
   * Used in {@link INTF_B_recipeHandler} to apply drawer defined in recipes.
   * @type {FFunction<Object, DrawBlock>}
   */
  const DrawRecipe = paramObj => extend(DrawBlock, {


      /**
       * @param {Block} blk
       * @return {void}
       */
      load(blk) {
          if(!checkCreatedByTemp(blk) || !blk.ex_isSubInsOf("INTF_BLK_recipeHandler")) throw new Error("DrawRecipe can only be used for recipe factories! Exception: {$1}".format(blk.name));
      },


      /**
       * @param {Building} b
       * @return {void}
       */
      draw(b) {
          if(b.delegee.rcDrawer != null) {
              b.delegee.rcDrawer.draw.call(b);
          };
      },


  });
  newDrawer("DrawRecipe", DrawRecipe);
  exports.DrawRecipe = DrawRecipe;
