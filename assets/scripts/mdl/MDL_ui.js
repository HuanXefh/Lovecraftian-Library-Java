/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A mess of UI and dialog flow methods.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * X coordinate of camera.
   * ---------------------------------------- */
  const _cameraX = function() {
    return Core.camera.position.x;
  };
  exports._cameraX = _cameraX;


  /* ----------------------------------------
   * NOTE:
   *
   * Y coordinate of camera.
   * ---------------------------------------- */
  const _cameraY = function() {
    return Core.camera.position.y;
  };
  exports._cameraY = _cameraY;


  /* ----------------------------------------
   * NOTE:
   *
   * Screen width.
   * ---------------------------------------- */
  const _screenW = function() {
    return Core.graphics.getWidth();
  };
  exports._screenW = _screenW;


  /* ----------------------------------------
   * NOTE:
   *
   * Screen height.
   * ---------------------------------------- */
  const _screenH = function() {
    return Core.graphics.getHeight();
  };
  exports._screenH = _screenH;


  /* ----------------------------------------
   * NOTE:
   *
   * X coordinate of screen center.
   * ---------------------------------------- */
  const _centerX = function() {
    return Core.graphics.getWidth() * 0.5;
  };
  exports._centerX = _centerX;


  /* ----------------------------------------
   * NOTE:
   *
   * Y coordinate of screen center.
   * ---------------------------------------- */
  const _centerY = function() {
    return Core.graphics.getHeight() * 0.5;
  };
  exports._centerY = _centerY;


  /* ----------------------------------------
   * NOTE:
   *
   * Zoom scale.
   * ---------------------------------------- */
  const _zoom = function() {
    return Vars.renderer.getDisplayScale();
  };
  exports._zoom = _zoom;


  /* ----------------------------------------
   * NOTE:
   *
   * Standard UI width.
   * ---------------------------------------- */
  const _uiW = function(pad, cap, offW, offH) {
    if(pad == null) pad = 20.0;
    if(cap == null) cap = 760.0;
    if(offW == null) offW = 0.0;
    if(offH == null) offH = 0.0;

    return Math.max(Math.min(_screenW() - pad * 2.0, cap), 64.0) - offW;
  };
  exports._uiW = _uiW;


  /* ----------------------------------------
   * NOTE:
   *
   * Standard UI height.
   * ---------------------------------------- */
  const _uiH = function(pad, cap, offW, offH) {
    if(pad == null) pad = 20.0;
    if(cap == null) cap = 760.0;
    if(offW == null) offW = 0.0;
    if(offH == null) offH = 0.0;

    return h_fi = Math.max(Math.min(_screenH() - pad * 2.0, cap), 64.0) - offH;
  };
  exports._uiH = _uiH;


  /* ----------------------------------------
   * NOTE:
   *
   * Standard scale for some UI fragments.
   * ---------------------------------------- */
  const _uiScl = function() {
    return Math.min(_screenW() / VAR.len_bgW, _screenH() / VAR.len_bgH);
  };
  exports._uiScl = _uiScl;


  /* ----------------------------------------
   * NOTE:
   *
   * How many columns is suitable for current window size.
   * ---------------------------------------- */
  const _colAmt = function(w, pad, ord) {
    if(w == null) w = 32.0;
    if(pad == null) pad = 4.0;
    if(ord == null) ord = 1;

    return Math.max(Math.floor(_uiW(null, null, ord * VAR.rad_ordRad, 0.0) / (w + pad)), 7);
  };
  exports._colAmt = _colAmt;


  /* <---------- info ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Displays information at screen center.
   * ---------------------------------------- */
  const show_announce = function(nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.announce(MDL_bundle._info(nmMod, bp), timeS);
  }
  .setAnno("non-headless");
  exports.show_announce = show_announce;


  /* ----------------------------------------
   * NOTE:
   *
   * Displays information at upper position that fades out.
   * ---------------------------------------- */
  const show_fadeInfo = function(nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.showInfoFade(MDL_bundle._info(nmMod, bp), timeS);
  }
  .setAnno("non-headless");
  exports.show_fadeInfo = show_fadeInfo;


  /* ----------------------------------------
   * NOTE:
   *
   * Content unlocked, sector captured...
   * Only possible to show in game.
   * ---------------------------------------- */
  const show_toast = function(nmMod, bp, icon, w) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(icon == null) icon = VARGEN.icons.ohno;
    if(w == null) w = -1.0;

    Vars.ui.hudfrag.showToast(icon, w, MDL_bundle._info(nmMod, bp));
  }
  .setAnno("non-headless");
  exports.show_toast = show_toast;


  /* ----------------------------------------
   * NOTE:
   *
   * Displays information at some world position.
   * ---------------------------------------- */
  const show_label = function(x, y, nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.showLabel(MDL_bundle._info(nmMod, bp), timeS, x, y);
  }
  .setAnno("non-headless");
  exports.show_label = show_label;


  /* ----------------------------------------
   * NOTE:
   *
   * Displays an error dialog.
   * ---------------------------------------- */
  const show_error = function(nmMod, bp) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";

    Core.app.post(() => {
      Vars.ui.showErrorMessage(MDL_bundle._info(nmMod, bp));
    });
  }
  .setAnno("non-headless");
  exports.show_error = show_error;


  /* <---------- drama ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Makes the actor appear at a position, by default the center of screen.
   * ---------------------------------------- */
  const setActor_pos = function(tb, x, y, align) {
    let done = false;
    tb.update(() => {
      if(!done) {
        tb.setPosition(tryVal(x, _centerX()), tryVal(y, _centerY()), tryVal(align, Align.center));
        done = true;
      };
    });
  };
  exports.setActor_pos = setActor_pos;


  /* ----------------------------------------
   * NOTE:
   *
   * Applys a list of actions to the actor, and adds it to the scene.
   * If {permanent} is {true}, the actor won't get removed finally.
   * ---------------------------------------- */
  const setActor_action = function(tb, delay, acts, permanent) {
    let acts_fi = [Actions.fadeOut(0.0), Actions.delay(tryVal(delay, 0.0))].pushAll(acts);
    if(!permanent) acts_fi.push(Actions.remove());
    tb.actions.apply(tb, acts_fi);
    tb.pack();
    tb.act(0.1);
    if(Core.scene != null) Core.scene.add(tb);
  };
  exports.setActor_action = setActor_action;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply removes the acctor from the scene.
   * ---------------------------------------- */
  const removeActor = function(tb) {
    tb.actions(Actions.remove());
  };
  exports.removeActor = removeActor;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a color transition.
   * ---------------------------------------- */
  const _d_fade = function(delay, color, inTimeS, outTimeS, susTimeS) {
    if(color == null) color = Color.black;
    if(inTimeS == null) inTimeS = 1.0;
    if(outTimeS == null) outTimeS = inTimeS;
    if(susTimeS == null) susTimeS = 0.5;

    // Created last so it's on top of everything
    Core.app.post(() => {
      const tb = new Table();
      tb.touchable = Touchable.disabled;

      tb.table(Tex.whiteui, tb1 => {
        tb1.setColor(color);
      })
      .width(_screenW() * 1.2)
      .height(_screenH() * 1.2)
      .row();

      setActor_pos(tb);
      setActor_action(tb, delay, [
        Actions.fadeIn(inTimeS),
        Actions.delay(susTimeS),
        Actions.fadeOut(outTimeS),
      ]);
    });

    return inTimeS + susTimeS;
  };
  exports._d_fade = _d_fade;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a simple flash.
   * ---------------------------------------- */
  const _d_flash = function(delay, color) {
    if(color == null) color = Color.white;

    _d_fade(delay, color, 0.1, 0.1, 0.0);
  };
  exports._d_flash = _d_flash;


  /* ----------------------------------------
   * NOTE:
   *
   * Shows a background image.
   * ---------------------------------------- */
  const _d_bg = function(delay, nmBg, endGetter, inTimeS) {
    if(inTimeS == null) inTimeS = 1.0;

    const tb = new Table();
    tb.touchable = Touchable.disabled;

    tb.table(new TextureRegionDrawable(Core.atlas.find(nmBg)), tb1 => {})
    .width(VAR.len_bgW * _uiScl())
    .height(VAR.len_bgH * _uiScl())
    .row();

    setActor_pos(tb);
    setActor_action(tb, delay, [
      Actions.fadeIn(inTimeS),
      Actions.run(() => tb.update(() => {
        if(endGetter()) removeActor(tb);
      })),
    ], true);

    return inTimeS;
  };
  exports._d_bg = _d_bg;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a background music player.
   * This temporarily mutes vanilla sound control.
   * ---------------------------------------- */
  const _d_bgm = function(delay, mus, endGetter) {
    const tb = new Table();

    setActor_action(tb, delay, [
      Actions.run(() => {
        MUSIC_HANDLER.setMusic(mus);
      }),
      Actions.run(() => tb.update(() => {
        if(endGetter()) {
          MUSIC_HANDLER.stop();
          removeActor(tb);
        };
      })),
    ], true);

    return 0.0;
  };
  exports._d_bgm = _d_bgm;


  /* ----------------------------------------
   * NOTE:
   *
   * Shows a character art.
   * Format for image name: {chara-*character name*}.
   *
   * {fracX} determines the initial position of the character, 0.5 for center.
   * {isDark0color} can be boolean or Arc color. If {true} the character is darkened, if color the image will be tinted.
   * {anim} is the animation used, see the code below.
   * {customActs} is a list of cutomized actions, and {customActTimeS} is the expected duration in seconds.
   * ---------------------------------------- */
  const _d_chara = function(
    delay, nmMod, chara, endGetter,
    fracX, isDark0color, anim, animParamObj,
    customActs, customActTimeS
  ) {
    if(customActs == null) customActs = [];
    if(customActTimeS == null) customActTimeS = 0.0;

    const tb = new Table();
    tb.touchable = Touchable.disabled;

    tb.table(new TextureRegionDrawable(Core.atlas.find(nmMod + "-chara-" + chara, Core.atlas.find("lovec-chara-error"))), tb1 => {
      if(isDark0color instanceof Color) {
        tb1.setColor(isDark0color);
      } else if(isDark0color) {
        tb1.setColor(Color.valueOf("606060"));
      };
    })
    .width(VAR.len_charaW * _uiScl())
    .height(VAR.len_charaH * _uiScl())
    .row();

    var done = false;
    tb.update(() => {
      if(!done) {
        tb.setPosition(_screenW() * (tryVal(fracX, 0.5)), _screenH() * 0.4, Align.center);
        done = true;
      };
    });

    // I have to hard-code this or it's bugged, WTF???
    let
      animTup,
      transTimeS, fracXFrom, fracXTo;
    switch(anim) {


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara fades in or out.
       * ---------------------------------------- */
      case "fade-in" :
        transTimeS = readParam(animParamObj, "transTimeS", 0.75);
        animTup = [transTimeS, [
          Actions.fadeIn(transTimeS),
        ]];
        break;


      case "fade-out" :
        transTimeS = readParam(animParamObj, "transTimeS", 0.75);
        animTup = [transTimeS, [
          Actions.fadeIn(0.0),
          Actions.fadeOut(transTimeS),
        ]];
        break;


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara move somewhere else, no y-coordinate.
       * ---------------------------------------- */
      case "move" :
        transTimeS = readParam(animParamObj, "transTimeS", 0.75);
        fracXFrom = readParam(animParamObj, "fracXFrom", 0.5);
        fracXTo = readParam(animParamObj, "fracXTo", 0.5);
        animTup = [transTimeS, [
          Actions.fadeIn(0.0),
          Actions.translateBy((fracXTo - fracXFrom) * _screenW() * 0.5, 0.0, transTimeS * 0.5, Interp.pow2In),
          Actions.translateBy((fracXTo - fracXFrom) * _screenW() * 0.5, 0.0, transTimeS * 0.5, Interp.pow2Out),
        ]];
        break;


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara jump twice.
       * ---------------------------------------- */
      case "jump" :
        animTup = [0.5, [
          Actions.fadeIn(0.0),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
        ]];
        break;


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara jump six times.
       * ---------------------------------------- */
      case "jump-violent" :
        animTup = [1.5, [
          Actions.fadeIn(0.0),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
        ]];
        break;


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara shake horizonally.
       * ---------------------------------------- */
      case "shake" :
        animTup = [0.5, [
          Actions.fadeIn(0.0),
          Actions.translateBy(-20.0, 0.0, 0.125),
          Actions.translateBy(40.0, 0.0, 0.125),
          Actions.translateBy(-40.0, 0.0, 0.125),
          Actions.translateBy(20.0, 0.0, 0.125),
        ]];
        break;


      default :
        animTup = [0.0, [Actions.fadeIn(0.0)]];

    };

    if(!fetchSetting("test-show-errored-chara") && !Core.atlas.has(nmMod + "-chara-" + chara)) {
      // Do nothing
    } else {
      setActor_action(tb, delay, animTup[1].concat(customActs).concat([
        Actions.run(() => tb.update(() => {
          if(endGetter()) removeActor(tb);
        })),
      ]), true);
    };

    return animTup[0] + customActTimeS;
  };
  exports._d_chara = _d_chara;


  /* ----------------------------------------
   * NOTE:
   *
   * Shows selection buttons for branched dialog flow.
   * Is it really needed for a linear progression game???
   * ---------------------------------------- */
  const _d_selection = function(delay, textScrArr, w, h, inTimeS) {
    if(w == null) w = 500.0;
    if(h == null) h = 50.0;
    if(inTimeS == null) inTimeS = 0.75;

    const tb = new Table();
    tb.center();
    textScrArr.forEachRow(2, (text, scr) => {
      tb.button(text, () => {
        scr();
        shouldClose = true;
      }).center().size(w, h).row();
      tb.add("").row();
    });

    let shouldClose = false;
    setActor_pos(tb);
    setActor_action(tb, delay, [
      Actions.fadeIn(inTimeS),
      Actions.run(() => tb.update(() => {
        if(shouldClose) removeActor(tb);
      })),
    ], true);

    return inTimeS;
  };
  exports._d_selection = _d_selection;


  /* ----------------------------------------
   * NOTE:
   *
   * A common text box used for drama that is shown at the bottom of screen.
   * {tupDial} is a 3-tuple of {nmMod}, {nmDial} and {ind}.
   * {tupChara} is a 2-tuple of {nmMod} and {nmChara}.
   * {scr} is called before the box is removed.
   * ---------------------------------------- */
  const _d_text = function(delay, tupDial, tupChara, scr, paramObj, endGetter) {
    if(scr == null) scr = Function.air;
    if(paramObj == null) paramObj = Object.air;

    const tb = new Table();

    let color = Color.white;
    if(tupChara != null) {
      color = MDL_color._charaColor(tupChara[0], tupChara[1]);
      // @TABLE: character name
      tb.table(Tex.bar, tb1 => {
        tb1.marginLeft(24.0).marginRight(24.0).marginTop(8.0).marginBottom(8.0).setColor(Color.darkGray);
        tb1.add(MDL_bundle._chara(tupChara[0], tupChara[1]).color(color)).center().fontScale(1.35).labelAlign(Align.left);
      }).left().row();
    };
    // @TABLE: text box
    tb.table(Tex.bar, tb1 => {
      tb1.left().top().marginLeft(48.0).marginRight(48.0).marginTop(32.0).marginBottom(32.0).setColor(Pal.darkestGray);
      let dialText = tupDial == null ? "" : MDL_bundle._dialText(tupDial[0], tupDial[1], tupDial[2]).color(color);
      tb1.add(dialText).left().fontScale(1.35).style(Styles.outlineLabel).labelAlign(Align.left).wrap().width(_uiW(90.0));
    }).width(_screenW() * 0.6).height(160.0).row();

    if(paramObj.haltTimeS == null && !paramObj.autoClick && !paramObj.isTail && paramObj.selectionScr == null) tb.clicked(() => {
      scr();
      tb.actions(Actions.remove());
    });

    setActor_pos(tb, null, 0.0, Align.bottom);
    setActor_action(tb, delay,
      paramObj.haltTimeS != null ?
        [Actions.delay(paramObj.haltTimeS), Actions.run(() => scr()), Actions.remove()] :
        paramObj.autoClick ?
          [Actions.fadeIn(0.25), Actions.run(() => scr()), Actions.remove()] :
          paramObj.isTail ?
            [Actions.fadeIn(0.25), Actions.run(() => scr()), Actions.fadeOut(0.25), Actions.remove()] :
            [Actions.fadeIn(0.25), Actions.run(() => tb.update(() => {
              if(endGetter != null && endGetter()) {
                removeActor(tb);
              };
            }))],
      true,
    );

    if(paramObj.selectionScr != null) paramObj.selectionScr();
    if(paramObj.sound != null) MDL_effect.play(paramObj.sound);

    return paramObj.haltTimeS != null ?
      paramObj.haltTimeS :
      paramObj.autoClick ?
        0.25 :
        0.5;
  };
  exports._d_text = _d_text;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a dialog flow (multiple texts in sequence).
   * Format for {dialFlowArr}: {[nmMod1, nmDial, dialInd], [nmMod2, nmChara], paramObj, charaArgs}.
   * Format for {charaArgs}: {[delay, nmMod, nmChara, fracX, isDark0color, anim, animParamObj, customActs]}
   * ---------------------------------------- */
  const _d_flow = function thisFun(nmDialFlow) {
    let dialFlowArr = fetchDialogFlow(nmDialFlow);
    if(dialFlowArr.length === 0) {
      Log.warn("[LOVEC] Cannot find dialog flow for " + nmDialFlow + "!");
      return;
    };

    thisFun.flowIndMap.put(dialFlowArr, 0);
    thisFun.callFlow(dialFlowArr);
  }
  .setProp({
    flowIndMap: new ObjectMap(),
    callFlow: flowArr => {
      let ind = _d_flow.flowIndMap.get(flowArr, 0);
      let obj = tryVal(flowArr[ind * 4 + 2], Object.air);
      let args = flowArr[ind * 4 + 3];

      if(obj.scr != null) obj.scr();
      if(args != null) {
        args.forEachFast(arr => _d_chara(arr[0], arr[1], arr[2], () => _d_flow.tmpBools[ind], arr[3], arr[4], arr[5], arr[6], arr[7]));
      };
      _d_text(0.0, flowArr[ind * 4], flowArr[ind * 4 + 1], () => {
        let nextInd = ind + 1;
        _d_flow.flowIndMap.put(flowArr, nextInd);
        _d_flow.tmpBools[ind] = true;
        if(nextInd * 4 < flowArr.length) {
          _d_flow.callFlow(flowArr);
        } else {
          _d_flow.tmpBools.clear();
        };
      }, obj, () => _d_flow.tmpBools[ind]);
    },
    callNext: flowArr => {
      let nextInd = _d_flow.flowIndMap.get(flowArr, 0) + 1;
      _d_flow.flowIndMap.put(flowArr, nextInd);
      _d_flow.tmpBools[nextInd - 1] = true;
      _d_flow.callFlow(flowArr);
    },
    tmpBools: [],
  });
  exports._d_flow = _d_flow;


/*
  ========================================
  Section: Application
  ========================================
*/
