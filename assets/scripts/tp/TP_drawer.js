/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new drawers.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ special ------------------------------ */


  /**
   * Used in {@link INTF_B_recipeHandler} to apply drawer defined in recipes.
   */
  newDrawer(
    "DrawRecipe",
    paramObj => extend(DrawBlock, {


      load(blk) {
        if(!checkCreatedByTemp(blk) || !blk.ex_isSubInsOf("INTF_BLK_recipeHandler")) throw new Error("DrawRecipe can only be used for recipe factories! Exception: {$1}".format(blk.name));
      },


      draw(b) {
        if(b.delegee.rcDrawer != null) {
          b.delegee.rcDrawer.draw.call(b);
        };
      },


    }),
  );
