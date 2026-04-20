/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * A mess of UI and dialog flow methods.
   * @module lovec/mdl/MDL_ui
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Gets y of camera.
   * @return {number}
   */
  const _cameraX = function() {
    return Core.camera.position.x;
  };
  exports._cameraX = _cameraX;


  /**
   * Gets y of camera.
   * @return {number}
   */
  const _cameraY = function() {
    return Core.camera.position.y;
  };
  exports._cameraY = _cameraY;


  /**
   * Gets screen width.
   * @return {number}
   */
  const _screenW = function() {
    return Core.graphics.getWidth();
  };
  exports._screenW = _screenW;


  /**
   * Gets screen height.
   * @return {number}
   */
  const _screenH = function() {
    return Core.graphics.getHeight();
  };
  exports._screenH = _screenH;


  /**
   * Gets x of screen center.
   * @return {number}
   */
  const _centerX = function() {
    return Core.graphics.getWidth() * 0.5;
  };
  exports._centerX = _centerX;


  /**
   * Gets y of screen center.
   * @return {number}
   */
  const _centerY = function() {
    return Core.graphics.getHeight() * 0.5;
  };
  exports._centerY = _centerY;


  /**
   * Gets current zoom scaling.
   * @return {number}
   */
  const _zoom = function() {
    return Vars.renderer.getDisplayScale();
  };
  exports._zoom = _zoom;


  /**
   * Gets standard UI width.
   * @param {number|unset} [pad]
   * @param {number|unset} [cap]
   * @param {number|unset} [offW]
   * @return {number}
   */
  const _uiW = function(pad, cap, offW) {
    if(pad == null) pad = 20.0;
    if(cap == null) cap = 760.0;
    if(offW == null) offW = 0.0;

    return Math.max(Math.min(_screenW() - pad * 2.0, cap), 64.0) - offW;
  };
  exports._uiW = _uiW;


  /**
   * Gets standard UI height.
   * @param {number|unset} [pad]
   * @param {number|unset} [cap]
   * @param {number|unset} [offH]
   * @return {number}
   */
  const _uiH = function(pad, cap, offH) {
    if(pad == null) pad = 20.0;
    if(cap == null) cap = 760.0;
    if(offH == null) offH = 0.0;

    return Math.max(Math.min(_screenH() - pad * 2.0, cap), 64.0) - offH;
  };
  exports._uiH = _uiH;


  /**
   * Gets standard UI scaling.
   * @return {number}
   */
  const _uiScl = function() {
    return Math.min(_screenW() / VAR.length.bgW, _screenH() / VAR.length.bgH);
  };
  exports._uiScl = _uiScl;


  /**
   * Gets prefered column amount.
   * @param {number|unset} [w]
   * @param {number|unset} [pad]
   * @param {number|unset} [ord]
   * @return {number}
   */
  const _colAmt = function(w, pad, ord) {
    if(w == null) w = 32.0;
    if(pad == null) pad = 4.0;
    if(ord == null) ord = 1;

    return Math.max(Math.floor(_uiW(null, null, ord * VAR.length.ordW, 0.0) / (w + pad)), 7);
  };
  exports._colAmt = _colAmt;


  /* <---------- info ----------> */


  /**
   * Displays information at screen center.
   * @param {string|unset} [nmMod]
   * @param {string|unset} [bp]
   * @param {number|unset} [timeS]
   * @return {void}
   */
  const show_announce = function(nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.announce(MDL_bundle._info(nmMod, bp), timeS);
  }
  .setAnno("non-headless");
  exports.show_announce = show_announce;


  /**
   * Displays information that fades out at upper position.
   * @param {string|unset} [nmMod]
   * @param {string|unset} [bp]
   * @param {number|unset} [timeS]
   * @return {void}
   */
  const show_fadeInfo = function(nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.showInfoFade(MDL_bundle._info(nmMod, bp), timeS);
  }
  .setAnno("non-headless");
  exports.show_fadeInfo = show_fadeInfo;


  /**
   * Content unlocked, sector captured...
   * Only possible to show in game.
   * @param {string|unset} [nmMod]
   * @param {string|unset} [bp]
   * @param {TextureRegionDrawable|unset} [icon]
   * @param {number|unset} [w]
   * @return {void}
   */
  const show_toast = function(nmMod, bp, icon, w) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(icon == null) icon = VARGEN.icons.ohno;
    if(w == null) w = -1.0;

    Vars.ui.hudfrag.showToast(icon, w, MDL_bundle._info(nmMod, bp));
  }
  .setAnno("non-headless");
  exports.show_toast = show_toast;


  /**
   * Displays information at some world position.
   * @param {number} x
   * @param {number} y
   * @param {string|unset} [nmMod]
   * @param {string|unset} [bp]
   * @param {number|unset} [timeS]
   * @return {void}
   */
  const show_label = function(x, y, nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.showLabel(MDL_bundle._info(nmMod, bp), timeS, x, y);
  }
  .setAnno("non-headless");
  exports.show_label = show_label;


  /**
   * Displays an error dialog.
   * @param {string|unset} [nmMod]
   * @param {string|unset} [bp]
   * @return {void}
   */
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


  /**
   * Makes the actor appear at a position, by default center of screen.
   * @param {Table} tb
   * @param {number|unset} [x]
   * @param {number|unset} [y]
   * @param {number|unset} [align]
   * @return {void}
   */
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


  /**
   * Applys a list of actions to some actor, then adds it to the scene.
   * @param {Table} tb
   * @param {number|unset} delay
   * @param {Array<Action>} acts
   * @param {boolean|unset} [permanent] - If true, the actor won't get removed finally.
   * @return {void}
   */
  const setActor_action = function(tb, delay, acts, permanent) {
    if(delay == null) delay = 0.0;

    let acts_fi = [Actions.fadeOut(0.0)];
    if(delay > 0.0) acts_fi.push(Actions.delay(delay));
    acts_fi.pushAll(acts);
    if(!permanent) acts_fi.push(Actions.remove());

    tb.actions.apply(tb, acts_fi);
    tb.pack();
    tb.act(0.1);
    if(Core.scene != null) Core.scene.add(tb);
  };
  exports.setActor_action = setActor_action;


  /**
   * Removes actor from the scene.
   * @param {Table} tb
   * @return {void}
   */
  const removeActor = function(tb) {
    tb.actions(Actions.remove());
  };
  exports.removeActor = removeActor;


  /**
   * Clears background, BGM, image, and characters.
   * @return {void}
   */
  const clearDialFlow = function() {
    TRIGGER_BACKGROUND = false;
    TRIGGER_MUSIC = false;
    TRIGGERS_IMAGE.setVal(false);
    MUSIC_HANDLER.stop();
    VARGEN.dialFlowTextLog.clear();
    VARGEN.dialFlowBgPool.forEachFast(tb => removeActor(tb));
    VARGEN.dialFlowImgPool.forEachFast(tb => removeActor(tb));
    VARGEN.dialFlowCharaPool.forEachFast(tb => removeActor(tb));
    VARGEN.dialFlowSelectionPool.forEachFast(tb => removeActor(tb));
    _d_flow.tmpBools.clear();
  };
  exports.clearDialFlow = clearDialFlow;


  /**
   * Creates a color transition.
   * @param {number} delay
   * @param {Color|unset} [color]
   * @param {number|unset} [inTimeS]
   * @param {number|unset} [outTimeS]
   * @param {number|unset} [susTimeS]
   * @return {number}
   */
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


  /**
   * Creates a simple flash.
   * @param {number} delay
   * @param {Color|unset} [color]
   * @return {number}
   */
  const _d_flash = function(delay, color) {
    if(color == null) color = Color.white;

    _d_fade(delay, color, 0.1, 0.1, 0.0);
  };
  exports._d_flash = _d_flash;


  /**
   * Shows a background image.
   * @param {number} delay
   * @param {string} nmBg
   * @param {function(): boolean} endGetter
   * @param {number|unset} [inTimeS]
   * @return {number}
   */
  const _d_bg = function(delay, nmBg, endGetter, inTimeS) {
    if(inTimeS == null) inTimeS = 1.0;

    const tb = new Table();
    tb.touchable = Touchable.disabled;
    VARGEN.dialFlowBgPool.push(tb);

    tb.table(new TextureRegionDrawable(Core.atlas.find(nmBg)), tb1 => {})
    .width(VAR.length.bgW * _uiScl())
    .height(VAR.length.bgH * _uiScl())
    .row();

    setActor_pos(tb);
    setActor_action(tb, delay, [
      Actions.fadeIn(inTimeS),
      Actions.run(() => tb.update(() => {
        if(endGetter()) {
          VARGEN.dialFlowBgPool.pull(tb);
          removeActor(tb);
        };
      })),
    ], true);

    return inTimeS;
  };
  exports._d_bg = _d_bg;


  /**
   * Plays background music, temporarily mutes vanilla sound control.
   * @param {number} delay
   * @param {MusicGn} mus_gn
   * @param {function(): boolean} endGetter
   * @return {number}
   */
  const _d_bgm = function(delay, mus_gn, endGetter) {
    const tb = new Table();

    setActor_action(tb, delay, [
      Actions.run(() => {
        MUSIC_HANDLER.setMusic(mus_gn);
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


  /**
   * Shows a character art.
   * The sprite is named like "chara-<nmChara>".
   * @param {number} delay
   * @param {string} nmMod
   * @param {string} nmChara
   * @param {function(): boolean} endGetter
   * @param {number|unset} [fracX] - The initial x position of image as fraction.
   * @param {boolean|Color|unset} [isDark0color] - Determines color of the image. The character art will be darkened if this property is true.
   * @param {string|unset} [anim] - Determines animation used on the image.
   * @param {Object|unset} [animParamObj]
   * @param {Array<Action>|unset} [customActs]
   * @param {number|unset} [customActTimeS] - Time spent on `customActs`.
   * @return {number}
   */
  const _d_chara = function(
    delay, nmMod, nmChara, endGetter,
    fracX, isDark0color, anim, animParamObj,
    customActs, customActTimeS
  ) {
    if(customActTimeS == null) customActTimeS = 0.0;

    const tb = new Table();
    tb.touchable = Touchable.disabled;
    VARGEN.dialFlowCharaPool.push(tb);

    tb.table(new TextureRegionDrawable(Core.atlas.find(nmMod + "-chara-" + nmChara, Core.atlas.find("lovec-chara-error"))), tb1 => {
      if(isDark0color instanceof Color) {
        tb1.setColor(isDark0color);
      } else if(isDark0color) {
        tb1.setColor(VAR.color.darkMix);
      };
    })
    .width(VAR.length.charaW * _uiScl())
    .height(VAR.length.charaH * _uiScl())
    .row();

    let done = false;
    tb.update(() => {
      if(!done) {
        tb.setPosition(_screenW() * (tryVal(fracX, 0.5)), _screenH() * 0.4, Align.center);
        done = true;
      };
    });

    // I have to hard-code this, or it's bugged, WTF???
    let
      animTup,
      transTimeS, fracXFrom, fracXTo;
    switch(anim) {


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


      case "jump" :
        animTup = [0.5, [
          Actions.fadeIn(0.0),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
        ]];
        break;


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

    if(!fetchSetting("test-show-error-chara") && !Core.atlas.has(nmMod + "-chara-" + nmChara)) {
      // Do nothing
    } else {
      if(customActs != null) {
        animTup[1].clear().pushAll(customActs);
      };
      animTup[1].push(Actions.run(() => tb.update(() => {
        if(endGetter()) {
          VARGEN.dialFlowCharaPool.pull(tb);
          removeActor(tb);
        };
      })));
      setActor_action(tb, delay, animTup[1], true);
    };

    return animTup[0] + customActTimeS;
  };
  exports._d_chara = _d_chara;


  /**
   * Shows selection buttons for dialog flow.
   * @param {number} delay
   * @param {Array} textScrArr - <ROW>: text, scr.
   * @param {number|unset} [w]
   * @param {number|unset} [h]
   * @param {number|unset} [inTimeS]
   * @return {number}
   */
  const _d_selection = function(delay, textScrArr, w, h, inTimeS) {
    if(w == null) w = 500.0;
    if(h == null) h = 50.0;
    if(inTimeS == null) inTimeS = 0.5;

    const tb = new Table();
    tb.center();
    textScrArr.forEachRow(2, (text, scr) => {
      tb.button(text, () => {
        VARGEN.dialFlowTextLog.push({
          chara: "SPEC: selection",
          text: text,
        });
        scr();
        shouldClose = true;
      }).center().size(w, h).row();
      tb.add("").row();
    });
    VARGEN.dialFlowSelectionPool.push(tb);

    let shouldClose = false;
    setActor_pos(tb);
    setActor_action(tb, delay, [
      Actions.fadeIn(inTimeS),
      Actions.run(() => tb.update(() => {
        if(shouldClose) {
          VARGEN.dialFlowSelectionPool.pull(tb);
          removeActor(tb);
        };
      })),
    ], true);

    return inTimeS;
  };
  exports._d_selection = _d_selection;


  /**
   * Shows clickable text box at the bottom of screen.
   * @param {number} delay
   * @param {DialogTuple|unset} [dialTup]
   * @param {CharacterTuple|unset} [charaTup]
   * @param {(function(): void)|unset} [scr] - Called just before the text box is removed.
   * @param {Object|unset} [paramObj]
   * @param {SoundGn|unset} [paramObj.sound] - If set, the sound will be played when the text is shown.
   * @param {number|unset} [paramObj.haltTimeS] - If set, the box will be removed after some seconds.
   * @param {boolean|unset} [paramObj.autoClick] - If true, the box will be automatically clicked.
   * @param {boolean|unset} [paramObj.isTail] - Set this to true for last text.
   * @param {Function|unset} [paramObj.selectionScr] - Use this field to call {@link _d_selection}.
   * @param {(function(): boolean)|unset} [endGetter]
   * @return {number}
   */
  const _d_text = function(delay, dialTup, charaTup, scr, paramObj, endGetter) {
    if(scr == null) scr = Function.air;

    const tb = new Table();
    let
      sound = readParam(paramObj, "sound", null),
      haltTimeS = readParam(paramObj, "haltTimeS", -1.0),
      autoClick = readParam(paramObj, "autoClick", false),
      isTail = readParam(paramObj, "isTail", false),
      selectionScr = readParam(paramObj, "selectionScr", null);

    let
      shouldTriggerScrOnClick = haltTimeS < 0.0 && !autoClick && !isTail && selectionScr == null,
      actions_fi = haltTimeS >= 0.0 ?
        [Actions.delay(haltTimeS), Actions.run(() => scr()), Actions.remove()] :
        autoClick ?
          [Actions.fadeIn(0.25), Actions.run(() => scr()), Actions.remove()] :
          isTail ?
            [Actions.fadeIn(0.25), Actions.run(() => scr()), Actions.fadeOut(0.25), Actions.remove()] :
            null,
      delay_fi = haltTimeS != null ?
        haltTimeS :
        autoClick ?
          0.25 :
          null,
      color = charaTup == null ? Color.white : MDL_color._charaColor(charaTup[0], charaTup[1]),
      dialChara = charaTup == null ? "" : MDL_bundle._chara(charaTup[0], charaTup[1]).color(color),
      dialText = dialTup == null ? "" : MDL_bundle._dialText(dialTup[0], dialTup[1], dialTup[2]).color(color);

    if(charaTup != null) {
      // <TABLE>: character name
      tb.table(Tex.bar, tb1 => {
        tb1.top().marginLeft(36.0).marginRight(36.0).marginTop(16.0).marginBottom(16.0).setColor(Color.darkGray);
        tb1.add(dialChara).center().fontScale(1.35).labelAlign(Align.left);
      }).left().row();
    };
    // <TABLE>: text box
    tb.table(Tex.bar, tb1 => {
      tb1.top().setColor(Pal.darkestGray);
      // <TABLE>: text container
      tb1.table(Styles.none, tb2 => {
        let flab = new FLabel(MDL_text._space() === "" ? "{slower}" : "{normal}" + dialText);
        if(shouldTriggerScrOnClick) tb2.clicked(() => {
          if(!flab.hasEnded()) {
            flab.skipToTheEnd();
          } else {
            scr();
            tb.actions(Actions.remove());
          };
        });

        tb2.left().marginLeft(48.0).marginRight(48.0).marginTop(28.0).marginBottom(28.0);
        tb2.add(flab).left().fontScale(1.35).style(Styles.outlineLabel).labelAlign(Align.left).wrap().width(_uiW(90.0));
      }).left();
      // <TABLE>: spacing
      tb1.table(Styles.none, tb2 => {}).growX();
      // <TABLE>: buttons
      tb1.table(Styles.none, tb2 => {
        tb2.button("X", () => Vars.ui.showConfirm(MDL_bundle._info("lovec", "dial-skip-dial-confirm"), MDL_bundle._info("lovec", "dial-skip-dial-confirm", true), () => {
          clearDialFlow();
          removeActor(tb);
        })).size(40.0).tooltip(MDL_bundle._info("lovec", "tt-skip-dial"), true).row();
        tb2.button("L", () => fetchDialog("dialFlowLog").ex_show()).size(40.0).tooltip(MDL_bundle._info("lovec", "tt-dial-flow-log"), true).row();
      }).right();
    }).width(_screenW() * 0.6).height(160.0).row();

    setActor_pos(tb, null, 0.0, Align.bottom);
    setActor_action(tb, delay,
      actions_fi != null ?
        actions_fi :
        [Actions.fadeIn(0.25), Actions.run(() => tb.update(() => {
          if(endGetter != null && endGetter()) removeActor(tb);
        }))],
      true,
    );

    if(selectionScr != null) paramObj.selectionScr();
    if(sound != null) MDL_effect.play(paramObj.sound);

    VARGEN.dialFlowTextLog.push({
      chara: dialChara,
      text: dialText,
    });

    return delay_fi != null ?
      delay_fi :
      0.5;
  };
  exports._d_text = _d_text;


  /**
   * Creates a dialog flow, which should be defined with {@link newDialogFlow} beforehand.
   * See {@link DialogFlowData}.
   * @param {string} nmDialFlow
   * @return {void}
   */
  const _d_flow = function thisFun(nmDialFlow) {
    let dialFlowData = fetchDialogFlow(nmDialFlow);
    if(dialFlowData.length === 0) {
      Log.warn("[LOVEC] Cannot find dialog flow for " + nmDialFlow + "!");
      return;
    };

    thisFun.flowIndMap.put(dialFlowData, 0);
    thisFun.callFlow(dialFlowData);
  }
  .setProp({
    flowIndMap: new ObjectMap(),
    callFlow: function(dialFlowData) {
      VARGEN.dialFlowCharaPool.forEachFast(tb => removeActor(tb));

      let ind = _d_flow.flowIndMap.get(dialFlowData, 0);
      let obj = tryVal(dialFlowData[ind * 4 + 2], Object.air);
      let args = dialFlowData[ind * 4 + 3];

      if(obj.scr != null) obj.scr();
      if(args != null) {
        args.forEachFast(arr => _d_chara(arr[0], arr[1], arr[2], () => _d_flow.tmpBools[ind], arr[3], arr[4], arr[5], arr[6], arr[7]));
      };
      _d_text(0.0, dialFlowData[ind * 4], dialFlowData[ind * 4 + 1], () => {
        let nextInd = ind + 1;
        _d_flow.flowIndMap.put(dialFlowData, nextInd);
        _d_flow.tmpBools[ind] = true;
        if(nextInd * 4 < dialFlowData.length) {
          _d_flow.callFlow(dialFlowData);
        } else {
          clearDialFlow();
        };
      }, obj, () => _d_flow.tmpBools[ind]);
    },
    callNext: function(dialFlowData) {
      let nextInd = _d_flow.flowIndMap.get(dialFlowData, 0) + 1;
      _d_flow.flowIndMap.put(dialFlowData, nextInd);
      _d_flow.tmpBools[nextInd - 1] = true;
      _d_flow.callFlow(dialFlowData);
    },
    tmpBools: [],
  });
  exports._d_flow = _d_flow;
