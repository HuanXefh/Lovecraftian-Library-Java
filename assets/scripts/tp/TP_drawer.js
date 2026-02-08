/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new drawers.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_entity = require("lovec/mdl/MDL_entity");


  /* <---------- region ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A modified {DrawSprite} for rotators, where clockwise rotation is supported.
   * ---------------------------------------- */
  newDrawer(
    "DrawRotator",
    (paramObj) => extend(DrawBlock, {


      suffix: readParam(paramObj, "suffix", "-rotator"),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      ang: readParam(paramObj, "ang", 0.0),
      spd: readParam(paramObj, "spd", 0.0),
      shouldFade: readParam(paramObj, "shouldFade", true),
      rotReg: null,


      load(blk) {
        this.rotReg = fetchRegion(blk, this.suffix, "-rotator");
      },


      icons(blk) {
        return [this.rotReg];
      },


      drawPlan(blk, plan, planLi) {
        Draw.rect(this.rotReg, plan.drawx() + this.offX, plan.drawy() + this.offY, this.ang);
      },


      draw(b) {
        let ang_fi = Mathf.mod(MDL_entity._tProg(b) * this.spd + this.ang, 90.0);
        if(!this.shouldFade) {
          Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang_fi);
        } else {
          if(this.spd < 0.0) {
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, -ang_fi + 90.0);
            Draw.alpha(1.0 - ang_fi / 90.0);
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, -ang_fi);
          } else {
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang_fi);
            Draw.alpha(ang_fi / 90.0);
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang_fi - 90.0);
          };
          Draw.reset();
        };
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Draws the icon of some content.
   * ---------------------------------------- */
  newDrawer(
    "DrawContentIcon",
    (paramObj) => extend(DrawBlock, {


      ctGetterTup: readParam(paramObj, "ctGetterTup", null),
      colorGetterTup: readParam(paramObj, "colorGetterTup", null),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      regScl: readParam(paramObj, "regScl", 1.0),


      load(blk) {
        if(this.ctGetterTup instanceof UnlockableContent) {
          let ct = this.ctGetterTup;
          this.ctGetterTup = [b => ct];
        };
        if(this.colorGetterTup instanceof Color) {
          let color = this.colorGetterTup;
          this.colorGetterTup = [b => color];
        };
      },


      draw(b) {
        if(this.ctGetterTup == null || this.ctGetterTup[0](b) == null) return;
        let reg = this.ctGetterTup[0](b).uiIcon;

        if(this.colorGetterTup == null) {
          Draw.rect(reg, b.x + this.offX, b.y + this.offY, reg.width * 2.0 * this.regScl / Vars.tilesize, reg.height * 2.0 * this.regScl / Vars.tilesize);
        } else {
          Draw.color(MDL_color._color(this.colorGetterTup[0](b)));
          Draw.rect(reg, b.x + this.offX, b.y + this.offY, reg.width * 2.0 * this.regScl / Vars.tilesize, reg.height * 2.0 * this.regScl / Vars.tilesize);
          Draw.color();
        };
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * A modified {DrawLiquidRegion}.
   * ---------------------------------------- */
  newDrawer(
    "DrawMixedLiquid",
    (paramObj) => extend(DrawBlock, {


      suffix: readParam(paramObj, "suffix", "-liquid"),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      canRot: readParam(paramObj, "canRot", false),
      liqReg: null,


      load(blk) {
        if(!blk.hasLiquids) ERROR_HANDLER.throw("noLiquidModule", blk.name);
        this.liqReg = fetchRegion(blk, this.suffix, "-liquid");
      },


      draw(b) {
        let cap = 0;
        b.liquids.each(liq => {
          if(!MDL_cond._isAuxiliaryFluid(liq)) cap++;
        });
        if(cap === 0) return;

        b.liquids.each(liq => {
          if(MDL_cond._isAuxiliaryFluid(liq)) return;
          Draw.color(liq.color, b.liquids.get(liq) / b.block.liquidCapacity / cap);
          this.canRot ?
            Draw.rect(this.liqReg, b.x + this.offX * Mathf.cosDeg(b.drawrot()), b.y + this.offY * Mathf.sinDeg(b.drawrot()), b.drawrot()) :
            Draw.rect(this.liqReg, b.x + this.offX, b.y + this.offY, 0.0);
        });
        Draw.color();
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * A drawer that spawns effect.
   * ---------------------------------------- */
  newDrawer(
    "DrawEffect",
    (paramObj) => extend(DrawBlock, {


      eff: readParam(paramObj, "eff", Fx.none),
      effP: readParam(paramObj, "effP", Fx.none),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      rad: readParam(paramObj, "rad", 0.0),
      canRot: readParam(paramObj, "canRot", false),


      draw(b) {
        if(Vars.state.isPaused() || !Mathf.chanceDelta(this.effP * b.efficiency)) return;
        this.eff.at(
          b.x + (this.offX + Mathf.range(this.rad)) * (!this.canRot ? 1.0 : Mathf.cosDeg(b.drawrot())),
          b.y + (this.offY + Mathf.range(this.rad)) * (!this.canRot ? 1.0 : Mathf.sinDeg(b.drawrot())),
        );
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Draws fire that won't spread.
   * ---------------------------------------- */
  newDrawer(
    "DrawFire",
    (paramObj) => extend(DrawBlock, {


      regStr: readParam(paramObj, "regStr", "fire"),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      frameDur: readParam(paramObj, "frameDur", 2.25),
      frameCap: readParam(paramObj, "frameCap", 40),
      frameCur: 0,
      regs: null,


      load(blk) {
        this.regs = [];
        let i = 0;
        while(i < this.frameCap) {
          this.regs[i] = Core.atlas.find(this.regStr + i);
          i++;
        };
        this.frameCur = this.frameCap * Math.random();
      },


      draw(b) {
        if(!Vars.state.isPaused()) {
          this.frameCur += Time.delta / this.frameDur;
          if(this.frameCur > this.frameCap) {
            this.frameCur %= this.frameCap;
          };
        };
        let warmup = tryProp(b.warmup, b);
        Draw.color(Color.white, warmup > 0.0 ? 1.0 : 0.0);
        processScl(warmup);
        Draw.rect(this.regs[Math.floor(this.frameCur)], b.x + this.offX, b.y + this.offY);
        processScl(warmup);
        Draw.color();
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawBubbles} but alpha of color is supported.
   * ---------------------------------------- */
  newDrawer(
    "DrawRipple",
    (paramObj) => extend(DrawBlock, {


      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      amt: readParam(paramObj, "amt", 12),
      rad: readParam(paramObj, "rad", 3.0),
      size: readParam(paramObj, "size", 3.0),
      strokeMin: readParam(paramObj, "strokeMin", 0.2),
      color: readParam(paramObj, "color", "ffffff40"),
      scl: readParam(paramObj, "scl", 30.0),
      recur: readParam(paramObj, "recur", 6.0),
      isFilled: readParam(paramObj, "isFilled", false),
      rand: new Rand(),


      load(blk) {
        this.color = MDL_color._color(this.color, "new");
      },


      draw(b) {
        let warmup = tryProp(b.warmup, b, 0.0);
        if(warmup < 0.01) return;

        Draw.color(this.color, this.color.a * warmup);
        this.rand.setSeed(b.id);
        let i = 0, offX, offY, life;
        while(i < this.amt) {
          offX = this.rand.range(this.rad);
          offY = this.rand.range(this.rad);
          life = 1.0 - ((Time.time / this.scl + this.rand.random(this.recur)) % this.recur);
          if(life > 0.0) {
            if(this.isFilled) {
              Fill.circle(b.x + offX, b.y + offY, this.size);
            } else {
              Lines.stroke(warmup * (life + this.strokeMin));
              Lines.poly(b.x + offX, b.y + offY, 8, (1.0 - life) * this.size);
            };
          };
          i++;
        };
        Draw.color();
      },


    }),
  );
