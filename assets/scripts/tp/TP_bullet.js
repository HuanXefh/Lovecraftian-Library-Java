/*
  ================================================================================
  Section: Introduction
  ================================================================================
*/


    /**
     * Registers new bullet templates.
     * @module lovec/tp/TP_bullet
     */


/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    newBulletTemplate("SpriteBullet", () => require("lovec/temp/bul/BUL_spriteBullet"));
    newBulletTemplate("MassDriverBullet", () => require("lovec/temp/bul/BUL_massDriverBullet"));
