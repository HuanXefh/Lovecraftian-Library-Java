/* ----------------------------------------
 * NOTE:
 *
 * Database of reaction properties used in {MDL_reaction}.
 * ---------------------------------------- */


const EFF = require("lovec/glb/GLB_eff");


const FRAG_attack = require("lovec/frag/FRAG_attack");
const FRAG_puddle = require("lovec/frag/FRAG_puddle");


const MDL_content = require("lovec/mdl/MDL_content");
const MDL_effect = require("lovec/mdl/MDL_effect");


const DB_fluid = require("lovec/db/DB_fluid");
const DB_item = require("lovec/db/DB_item");


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /* ----------------------------------------
   * NOTE:
   *
   * Reaction definition, {e} and {rs} can be {null}.
   * Note that the script is called on server side only.
   * Format: {reaction, [p, (paramObj, x, y, e, rs) => {...}]}.
   * ---------------------------------------- */
  reaction: [

    // Create explosion
    "explosion", [0.001, (paramObj, x, y, e, rs) => {
      let pow = readParam(paramObj, "pow", 1.0);

      FRAG_attack._a_explosion_global(
        x, y,
        Mathf.lerp(40.0, 200.0, ct1.explosiveness) * pow,
        16.0 * pow,
        2.0 + pow * 3.0,
      );
    }],

    // Create fire
    "heat", [0.01, (paramObj, x, y, e, rs) => {
      MDL_effect.showAt_global(x, y, EFF.heatSmog, 0.0);
      if(e != null) global.lovec.frag_attack.damage(e, readParam(paramObj, "dmg", 10.0), 0.0, "heat");
      Bullets.fireball.createNet(Team.derelict, x, y, Mathf.random(360.0), -1.0, 1, 1);
    }],

    // Item changed to another item
    "denaturing", [0.002, (paramObj, x, y, b, rs) => {
      if(e == null || rs == null) return;
      if(e instanceof Building ? e.items == null : e.stack.amount < 1) return;
      let itm = global.lovec.mdl_content._ct(db["denaturingTarget"].read(rs.name), "rs");
      if(itm == null) return;

      let amt = Math.round(readParam(paramObj, "amt", 1));

      if(e instanceof Building) {
        e.removeStack(rs, amt);
        e.handleStack(itm, amt, e);
        Call.setItem(e, rs, e.items.get(rs));
        Call.setItem(e, itm, e.items.get(itm));
      } else {
        if(Mathf.chance(amt / e.stack.amount)) e.stack.item = itm;
      };
    }],

    // Change puddle liquid
    "solvation", [0.01, (paramObj, x, y, e, rs) => {
      if(rs == null) return;
      let liq = tryVal(db["solvationTarget"][readParam(paramObj, "solvent", "water")], Array.air).read(rs.name);
      if(liq == null) return;
      let ot = Vars.world.tileWorld(
        x + Mathf.range(Vars.tilesize) * (e instanceof Building ? ((e.block.size + (e.block.size % 2 === 0 ? 2 : 1)) / 2) : 1),
        y + Mathf.range(Vars.tilesize) * (e instanceof Building ? ((e.block.size + (e.block.size % 2 === 0 ? 2 : 1)) / 2) : 1),
      );
      if(ot == null) return;
      let puddle = Puddles.get(ot);
      if(puddle == null) return;

      let
        amt = Math.round(readParam(paramObj, "amt", 1)),
        puddleScl = readParam(paramObj, "puddleScl", 1.0);

      if(e != null) {
        if(e instanceof Building && e.items != null) {
          e.removeStack(rs, amt);
          Call.setItem(e, rs, e.items.get(rs));
        } else if(e instanceof Unit && e.stack.amount > 0) {
          e.stack.amount = Mathf.maxZero(e.stack.amount - amt);
        };
      };
      FRAG_puddle.changePuddle_global(puddle, liq, puddleScl);
    }],

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * Conditions for each reaction group.
   * ---------------------------------------- */
  groupCond: [

    "GROUP: air", (rs) => DB_fluid.db["group"]["air"].includes(rs.name),
    "GROUP: water", (rs) => DB_fluid.db["group"]["aqueous"].includes(rs.name),
    "GROUP: dehydrative", (rs) => DB_fluid.db["group"]["fTag"]["dehydrative"].includes(rs.name),
    "GROUP: acidic", (rs) => DB_fluid.db["group"]["acidic"].includes(rs.name),
    "GROUP: basic", (rs) => DB_fluid.db["group"]["basic"].includes(rs.name),

    "ITEMGROUP: denaturing", (rs) => db["denaturingTarget"].colIncludes(rs.name, 2, 0),
    "ITEMGROUP: solvation", (rs) => {
      let obj = db["solvationTarget"];
      for(let key in obj) {
        if(obj[key].colIncludes(rs.name, 2, 0)) return true;
      };
      return false;
    },
    "ITEMGROUP: acidic", (rs) => DB_item.db["group"]["acidic"].includes(rs.name),
    "ITEMGROUP: basic", (rs) => DB_item.db["group"]["basic"].includes(rs.name),
    "ITEMGROUP: sodium", (rs) => DB_item.db["group"]["sodium"].includes(rs.name),

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * List of fluid reactants and the event called.
   * This is expected to be read without order.
   * Format: {reactant1, reactant2, [reaction, param]}.
   * ---------------------------------------- */
  fluid: [

    "GROUP: water", "GROUP: dehydrative", ["heat", {}],

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * For item reaction. The first reactant is item and second is fluid.
   * ---------------------------------------- */
  item: [

    "ITEMGROUP: denaturing", "GROUP: air", ["denaturing", {amt: 1}],
    "ITEMGROUP: solvation", "GROUP: water", ["solvation", {solvent: "water", puddleScl: 0.8}],

    "ITEMGROUP: sodium", "GROUP: water", ["explosion", {pow: 1.0}],

    "ITEMGROUP: acidic", "GROUP: basic", ["heat", {}],
    "ITEMGROUP: basic", "GROUP: acidic", ["heat", {}],

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * Target item in a denaturing reaction.
   * If {null} no item will be formed.
   * ---------------------------------------- */
  denaturingTarget: [],


  /* ----------------------------------------
   * NOTE:
   *
   * Target liquid in a solvation reaction.
   * If {null} no liquid puddle will be changed.
   * ---------------------------------------- */
  solvationTarget: {


    water: [

      /* <---------- item0chem (elementary) ----------> */

      /* calcium */

      "loveclab-item0chem-lime", "loveclab-liq0int0sol-slaked-lime",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_reaction");


exports.db = db;
