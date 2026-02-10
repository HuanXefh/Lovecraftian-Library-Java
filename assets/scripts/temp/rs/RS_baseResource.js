/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items and liquids are both resource.
   * Resource in Lovec does not support animated sprite by default to allow icon tags.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");
  const PARAM = require("lovec/glb/GLB_param");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- component ----------> */


  function comp_init(rs) {
    // Ensure that some fields are loaded
    rs.ex_getShortName();
    rs.ex_getIntmdTags();
  };


  function comp_loadIcon(rs) {
    // Use a new texture region to keep "ohno" intact
    if(rs.fullIcon === Core.atlas.find("error")) {
      rs.fullIcon = rs.uiIcon = new TextureRegion();
    };

    // If recolored sprite is created, use it instead
    if(rs.recolorRegStr != null) {
      let reg = Core.atlas.find(rs.name + "-recolor");
      rs.fullIcon.set(reg);
      rs.uiIcon.set(reg);
    };

    if(rs.skipIconTagGen) return;
    let iCap = rs.alts;
    if(iCap === 0) return;

    // Set up icon tag-based sprites
    let regs = [Core.atlas.find(rs.name + "-t0")], regInd;
    iCap._it(1, i => {
      regs.push(Core.atlas.find(rs.name + "-t" + (i + 1)));
    });
    MDL_event._c_onUpdate(() => {
      regInd = !PARAM.flickerIconTag ?
        1 :
        (Math.floor((Time.globalTime / PARAM.iconTagIntv) % regs.length));

      rs.fullIcon.set(regs[regInd]);
      rs.uiIcon.set(regs[regInd]);
    });
  };


  function comp_createIcons(rs, packer) {
    // {rs.intmdParent} is still a string at this moment
    let parent = !rs.useParentReg ? null : tryVal(rs.intmdParent, null);
    // Set resource color based on sprite color
    if(!rs.skipColorAssign) {
      rs.color = MDL_color._iconColor(tryVal(parent, rs), null, rs.color);
    };

    let pixBase = Core.atlas.getPixmap(tryVal(parent, rs.name));

    if(rs.recolorRegStr != null && parent != null && global.lovecUtil.prop.useRecolorSpr) {
      // Generate recolored sprite
      let pix = MDL_texture._pix_gsColor(
        Core.atlas.getPixmap(rs.recolorRegStr),
        Core.atlas.getPixmap(parent),
      );
      packer.add(MultiPacker.PageType.main, rs.name + "-recolor", pix);
      pix.dispose();
      pixBase = Core.atlas.getPixmap(rs.name + "-recolor");
    } else {
      rs.recolorRegStr = null;
    };

    if(rs.skipIconTagGen) return;
    let tags = rs.ex_getIntmdTags();
    if(tags.length === 0) return;

    // Generate icon tag-based sprites
    let pixOri = MDL_texture._pix_stack(pixBase);
    packer.add(MultiPacker.PageType.main, rs.name + "-t0", pixOri);
    pixOri.dispose();
    let alts = 0, pixCombine;

    if(rs.recolorRegStr != null && parent != null) {
      // For recolored sprites, always use parent as the icon tag
      pixCombine = MDL_texture._pix_ctStack(pixBase, parent);
      packer.add(MultiPacker.PageType.main, rs.name + "-t1", pixCombine);
      pixCombine.dispose();
      alts++;
      // No need to add dust icon tag if the sprite is a recolored dust
      tags = Array.air;
    };

    // Use icon sprite as the icon tag if found, for each intermediate tag
    let nmMod = MDL_content._mod(rs), pixTag;
    if(nmMod != null) {
      tags.forEachFast(tag => {
        if(!Core.atlas.has(nmMod + "-rs0tag-" + tag)) return;

        pixTag = Core.atlas.getPixmap(nmMod + "-rs0tag-" + tag);
        pixCombine = MDL_texture._pix_stack(pixBase, pixTag);
        packer.add(MultiPacker.PageType.main, rs.name + "-t" + (alts + 1), pixCombine);
        pixCombine.dispose();
        alts++;
      });
    };

    // Extra resource sprites as icon tags, if used
    rs.extraIntmdParents.forEachFast(nmRs => {
      pixCombine = MDL_texture._pix_ctStack(pixBase, nmRs);
      packer.add(MultiPacker.PageType.main, rs.name + "-t" + (alts + 1), pixCombine);
      pixCombine.dispose();
      alts++;
    });

    rs.alts = alts;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_baseResource").initClass()
  .setParent(null)
  .setTags()
  .setParam({
    // @PARAM: Whether to skip color assignment based on sprite.
    skipColorAssign: false,
    // @PARAM: Whether to skip icon tag generation, to allow vanilla animated sprite.
    skipIconTagGen: false,
    // @PARAM: Whether to skip automatic reaction assignment.
    skipReactionAssign: false,
    // @PARAM: Whether to clear unnecessary vanilla stats for the resource (e.g. flammability will be shown only when larger than 0.0).
    overwriteVanillaStat: true,
    // @PARAM: Whether to automatically set values of some vanilla properties.
    overwriteVanillaProp: true,

    alts: 0,
    shortName: null,
    intmdParent: null,
    intmdTags: null,
    extraIntmdParents: prov(() => []),
    useParentReg: false,
    recolorRegStr: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    loadIcon: function() {
      comp_loadIcon(this);
    },


    createIcons: function(packer) {
      comp_createIcons(this, packer);
    },


    /* ----------------------------------------
     * NOTE:
     *
     * Use this to get shortened name for this resource.
     * Examples:
     * Sodium Hydroxide -> NaOH
     * Slaked Lime -> Ca(OH)2
     * Dimethyl Formamide -> DMF
     * ---------------------------------------- */
    ex_getShortName: function() {
      if(this.shortName == null) {
        this.shortName = DB_HANDLER.read("rs-short-name", this, DB_HANDLER.read("rs-formula", this, this.localizedName));
      };
      return this.shortName;
    }
    .setProp({
      noSuper: true,
    }),


    /* ----------------------------------------
     * NOTE:
     *
     * Used in intermediate resource for name generation.
     * ---------------------------------------- */
    ex_generateIntmdName: function() {
      if(Vars.headless || this.intmdParent == null || this.intmdTags.length === 0) return;

      let str;
      if(this.intmdTags.length === 1 && DB_item.db["intmd"]["insertName"].colIncludes(this.intmdTags[0], 2)) {
        // For a single name to insert, use "main (type)" format
        str = this.intmdParent.localizedName + MDL_text._space() + "([$1])".format(DB_item.db["intmd"]["insertName"].read(this.intmdTags[0], "!ERR"));
      } else {
        // For regular intermediate, use "type (insert/main/sub)" format
        str = String(this.ex_getLocalizedIntmdName());
        let strs1 = [];
        DB_item.db["intmd"]["insertName"].forEachRow(2, (tag, str1) => {
          if(this.intmdTags.includes(tag)) strs1.push(str1);
        });
        if(strs1.length > 0) {
          let strs = str.split("(");
          if(strs.length !== 1) {
            str = strs[0];
            strs1.forEachFast(str1 => str += str1 + " / ");
            str += strs[1];
          };
        };
      };

      MDL_content.rename(this, str);
    }
    .setProp({
      noSuper: true,
    }),


    /* ----------------------------------------
     * NOTE:
     *
     * Use this to fetch intermediate tags of the resource.
     * ---------------------------------------- */
    ex_getIntmdTags: function() {
      if(this.intmdTags == null) {
        this.intmdTags = MDL_content._intmdTags(this);
        DB_item.db["intmd"]["tagCheck"].forEachRow(2, (tag, boolF) => {
          if(boolF(this)) this.intmdTags.pushUnique(tag);
        });
        // Should not be stored in template tags anymore, for better performance
        this.tempTags.pullAll(this.intmdTags);
      };
      return this.intmdTags;
    }
    .setProp({
      noSuper: true,
    }),


    ex_getLocalizedIntmdName: function() {
      return this.ex_getLocalizedMainName() + MDL_text._space() + "([$1])".format(this.ex_getLocalizedSubName());
    }
    .setProp({
      noSuper: true,
    }),


    // @LATER
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-mixture");
    }
    .setProp({
      noSuper: true,
    }),


    ex_getLocalizedSubName: function() {
      let str = tryFun(this.intmdParent.ex_getShortName, this.intmdParent, this.intmdParent.localizedName);
      this.extraIntmdParents.forEachFast(rs => str += " / " + tryFun(rs.ex_getShortName, rs, rs.localizedName));
      return str;
    }
    .setProp({
      noSuper: true,
    }),


  });
