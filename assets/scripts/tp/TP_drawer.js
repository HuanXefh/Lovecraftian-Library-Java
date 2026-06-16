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


  /* <------------------------------ auxiliary ------------------------------ */


  let
    x,
    y,
    offX,
    offY,
    reg,
    ang,
    life,
    scl,
    i,
    iCap,
    j,
    jCap,
    amt,
    cond,
    cap,
    warmup,
    cd;


  /* <------------------------------ region ------------------------------ */


  /**
   * A modified {@link DrawRegion} for rotators, where clockwise rotation is supported.
   */
  newDrawer(
    "DrawRotator",
    paramObj => extend(DrawBlock, {


      suffix: readParam(paramObj, "suffix", "-rotator"),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      ang: readParam(paramObj, "ang", 0.0),
      spd: readParam(paramObj, "spd", 0.0),
      shouldFade: readParam(paramObj, "shouldFade", true),
      rotReg: null,


      load(blk) {
        this.rotReg = fetchRegion(blk, this.suffix);
      },


      icons(blk) {
        return [this.rotReg];
      },


      drawPlan(blk, plan, planLi) {
        Draw.rect(this.rotReg, plan.drawx() + this.offX, plan.drawy() + this.offY, this.ang);
      },


      draw(b) {
        ang = Mathf.mod(MDL_entity._tProg(b) * this.spd + this.ang, 90.0);
        if(!this.shouldFade) {
          Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang);
        } else {
          if(this.spd < 0.0) {
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, -ang + 90.0);
            Draw.alpha(1.0 - ang_fi / 90.0);
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, -ang);
          } else {
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang);
            Draw.alpha(ang_fi / 90.0);
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang - 90.0);
          };
          Draw.reset();
        };
      },


    }),
  );


  /**
   * Draws the icon of some content.
   */
  newDrawer(
    "DrawContent",
    paramObj => extend(DrawBlock, {


      ctGetterTup: readParam(paramObj, "ctGetterTup", null),
      colorGetterTup: readParam(paramObj, "colorGetterTup", null),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      regScl: readParam(paramObj, "regScl", 1.0) * 2.0 / Vars.tilesize,


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
        reg = this.ctGetterTup[0](b).fullIcon;

        if(this.colorGetterTup == null) {
          Draw.rect(reg, b.x + this.offX, b.y + this.offY, reg.width * this.regScl, reg.height * this.regScl);
        } else {
          Draw.color(MDL_color._color(this.colorGetterTup[0](b)));
          Draw.rect(reg, b.x + this.offX, b.y + this.offY, reg.width * this.regScl, reg.height * this.regScl);
          Draw.color();
        };
      },


    }),
  );


  /**
   * Draws stacked items.
   * <br> <DEDICATION>: Inspired by Psammos.
   */
  newDrawer(
    "DrawItemPile",
    paramObj => extend(DrawBlock, {


      itmGetterTup: readParam(paramObj, "itmGetterTup", null),
      fracGetterTup: readParam(paramObj, "fracGetterTup", null),
      amtGetterTup: readParam(paramObj, "amtGetterTup", 12),
      rad: readParam(paramObj, "rad", 8.0),
      w: readParam(paramObj, "w", 7.0),
      z: readParam(paramObj, "z", null),
      shaReg: null,


      load(blk) {
        this.shaReg = Core.atlas.find("circle-shadow");

        if(this.itmGetterTup instanceof Item) {
          let itm = this.itmGetterTup;
          this.itmGetterTup = [b => itm];
        };
        if(typeof this.fracGetterTup === "number") {
          let frac = this.fracGetterTup;
          this.fracGetterTup = [b => frac];
        } else if(this.itmGetterTup != null && blk.hasItems) {
          this.fracGetterTup = [b => b.items.get(this.itmGetterTup[0](b)) / blk.itemCapacity];
        } else {
          this.fracGetterTup = [b => 1.0];
        };
        if(typeof this.amtGetterTup === "number") {
          let amt = this.amtGetterTup;
          this.amtGetterTup = [b => amt];
        };
      },


      draw(b) {
        if(this.itmGetterTup == null || this.itmGetterTup[0](b) == null) return;

        processZ(tryVal(this.z, Draw.z() + 0.5));
        Angles.randLenVectors(b.id, Mathf.maxZero(Math.round(this.amtGetterTup[0](b) * this.fracGetterTup[0](b))), this.rad, (dx, dy) => {
          Draw.color(Color.black, 0.4);
          Draw.rect(this.shaReg, b.x + dx, b.y + dy, this.w * 1.6, this.w * 1.6);
          Draw.color();
          Draw.rect(this.itmGetterTup[0](b).fullIcon, b.x + dx, b.y + dy, this.w, this.w, Mathf.randomSeed(b.tile.pos() + dx + dy * 10000.0, 0.0, 360.0));
        });
        processZ();
      },


    }),
  );


  /**
   * A modified {@link DrawLiquidRegion}.
   */
  newDrawer(
    "DrawMixedLiquid",
    paramObj => extend(DrawBlock, {


      suffix: readParam(paramObj, "suffix", "-liquid"),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      rotate: readParam(paramObj, "rotate", false),
      liqReg: null,


      load(blk) {
        if(!blk.hasLiquids) ERROR_HANDLER.throw("noLiquidModule", blk.name);
        this.liqReg = fetchRegion(blk, this.suffix);
      },


      draw(b) {
        cap = 0;
        b.liquids.each(liq => {
          if(!liq.gas && !MDL_cond._isAuxiliaryFluid(liq)) cap++;
        });
        if(cap === 0) return;

        b.liquids.each(liq => {
          if(liq.gas || MDL_cond._isAuxiliaryFluid(liq)) return;
          Draw.color(liq.color, b.liquids.get(liq) / b.block.liquidCapacity / cap);
          this.rotate ?
            Draw.rect(this.liqReg, b.x + this.offX * Mathf.cosDeg(b.drawrot()), b.y + this.offY * Mathf.sinDeg(b.drawrot()), b.drawrot()) :
            Draw.rect(this.liqReg, b.x + this.offX, b.y + this.offY, 0.0);
        });
        Draw.color();
      },


    }),
  );


  /* <------------------------------ effect ------------------------------ */


  /**
   * A drawer that spawns effect.
   */
  newDrawer(
    "DrawEffect",
    paramObj => extend(DrawBlock, {


      eff: readParam(paramObj, "eff", Fx.none),
      effP: readParam(paramObj, "effP", Fx.none),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      rad: readParam(paramObj, "rad", 0.0),
      rotate: readParam(paramObj, "rotate", false),
      angGetterTup: readParam(paramObj, "angGetterTup", null),
      colorGetterTup: readParam(paramObj, "colorGetterTup", null),
      dataGetterTup: readParam(paramObj, "dataGetterTup", null),
      z: readParam(paramObj, "z", null),


      load(blk) {
        if(typeof this.angGetterTup === "number") {
          let ang = this.angGetterTup;
          this.angGetterTup = [(b, x, y) => ang];
        } else if(this.angGetterTup === "random") {
          this.angGetterTup = [(b, x, y) => Mathf.random(360.0)];
        };
        if(this.colorGetterTup instanceof Color) {
          let color = this.colorGetterTup;
          this.colorGetterTup = [(b, x, y) => color];
        };
        if(this.dataGetterTup != null && typeof this.dataGetterTup !== "function") {
          let data = this.dataGetterTup;
          this.dataGetterTup = [(b, x, y) => data];
        };
      },


      draw(b) {
        if(Vars.state.isPaused() || !Mathf.chanceDelta(this.effP * b.efficiency)) return;

        if(this.z != null) this.eff.layer = this.z;
        x = b.x + (this.offX + Mathf.range(this.rad)) * (!this.rotate ? 1.0 : Mathf.cosDeg(b.drawrot()));
        y = b.y + (this.offY + Mathf.range(this.rad)) * (!this.rotate ? 1.0 : Mathf.sinDeg(b.drawrot()));

        this.eff.at(
          x, y,
          this.angGetterTup == null ? 0.0 : this.angGetterTup[0](b, x, y),
          this.colorGetterTup == null ? Color.white : this.colorGetterTup[0](b, x, y),
          this.dataGetterTup == null ? null : this.dataGetterTup[0](b, x, y),
        );
      },


    }),
  );


  /**
   * Draws fire that won't spread.
   */
  newDrawer(
    "DrawFire",
    paramObj => extend(DrawBlock, {


      regStr: readParam(paramObj, "regStr", "fire"),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      frameDur: readParam(paramObj, "frameDur", 2.25),
      frameCap: readParam(paramObj, "frameCap", 40),
      frameCur: 0,
      regs: null,


      load(blk) {
        this.regs = [];
        i = 0;
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
        warmup = tryProp(b.warmup, b);
        Draw.color(Color.white, warmup > 0.0 ? 1.0 : 0.0);
        processScl(warmup);
        Draw.rect(this.regs[Math.floor(this.frameCur)], b.x + this.offX, b.y + this.offY);
        processScl(warmup);
        Draw.color();
      },


    }),
  );


  /**
   * {@link DrawBubbles} but alpha of color is supported.
   */
  newDrawer(
    "DrawRipple",
    paramObj => extend(DrawBlock, {


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
      noLiqCheck: readParam(paramObj, "noLiqCheck", false),
      rand: new Rand(),
      noLiqCdMap: new ObjectMap(),


      load(blk) {
        this.color = MDL_color._color(this.color, "new");

        TRIGGER.mapExit.addGlobalListener(() => {
          this.noLiqCdMap.clear();
        });
      },


      draw(b) {
        warmup = tryProp(b.warmup, b);
        if(warmup < 0.01) return;
        if(this.noLiqCheck) {
          cd = this.noLiqCdMap.get(b, 0.0);
          cond = true;
          b.liquids.each(liq => {
            if(!cond) return;
            amt = b.liquids.get(liq);
            if(amt > 0.01 && !liq.gas && !MDL_cond._isAuxiliaryFluid(liq)) {
              cond = false;
            };
          });
          if(cond) {
            cd = Math.min(cd + 1.0, 20.0);
            this.noLiqCdMap.put(b, cd);
          } else {
            cd = 0.0;
            this.noLiqCdMap.put(b, cd);
          };
          if(cd >= 20.0) return;
        };

        Draw.color(this.color, this.color.a * warmup);
        this.rand.setSeed(b.id);
        i = 0;
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


  /* <------------------------------ special ------------------------------ */


  /**
   * Used to call original draw methods when {@link BLK_baseBlock#forceUseDrawer} is true.
   */
  newDrawer(
    "DrawBackup",
    paramObj => extend(DrawBlock, {


      load(blk) {
        MDL_event._c_onLoad(() => {
          if(!checkCreatedByTemp(blk)) throw new Error("DrawBackup can only be used for blocks created with content templates! Exception: {$1}".format(blk.name));
          if(!blk.delegee.forceUseDrawer) throw new Error("DrawBackup can only be used when `forceUseDrawer` is true! Exception: {$1}".format(blk.name));
        });
      },


      draw(b) {
        b.delegee.__BACKUP_DRAW__.call(b);
      },


      drawLight(b) {
        b.delegee.__BACKUP_DRAWLIGHT__.call(b);
      },


    }),
  );
