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


  /* <------------------------------ base ------------------------------ */


  /**
   * Gets y of camera.
   * @return {number}
   */
  const getCameraX = function() {
    return Core.camera.position.x;
  };
  exports.getCameraX = getCameraX;


  /**
   * Gets y of camera.
   * @return {number}
   */
  const getCameraY = function() {
    return Core.camera.position.y;
  };
  exports.getCameraY = getCameraY;


  /**
   * Gets screen width.
   * @return {number}
   */
  const getScreenW = function() {
    return Core.graphics.getWidth();
  };
  exports.getScreenW = getScreenW;


  /**
   * Gets screen height.
   * @return {number}
   */
  const getScreenH = function() {
    return Core.graphics.getHeight();
  };
  exports.getScreenH = getScreenH;


  /**
   * Gets x of screen center.
   * @return {number}
   */
  const getCenterX = function() {
    return Core.graphics.getWidth() * 0.5;
  };
  exports.getCenterX = getCenterX;


  /**
   * Gets y of screen center.
   * @return {number}
   */
  const getCenterY = function() {
    return Core.graphics.getHeight() * 0.5;
  };
  exports.getCenterY = getCenterY;


  /**
   * Gets current zoom scaling.
   * @return {number}
   */
  const getZoom = function() {
    return Vars.renderer.getDisplayScale();
  };
  exports.getZoom = getZoom;


  /**
   * Gets standard UI width.
   * @param {number|unset} [pad]
   * @param {number|unset} [cap]
   * @param {number|unset} [offW]
   * @return {number}
   */
  const getUiW = function(pad, cap, offW) {
    if(pad == null) pad = 20.0;
    if(cap == null) cap = 760.0;
    if(offW == null) offW = 0.0;

    return Math.max(Math.min(getScreenW() / global.lovecUtil.prop.uiScale - pad * 2.0, cap), 64.0) - offW;
  };
  exports.getUiW = getUiW;


  /**
   * Gets standard UI height.
   * @param {number|unset} [pad]
   * @param {number|unset} [cap]
   * @param {number|unset} [offH]
   * @return {number}
   */
  const getUiH = function(pad, cap, offH) {
    if(pad == null) pad = 20.0;
    if(cap == null) cap = 760.0;
    if(offH == null) offH = 0.0;

    return Math.max(Math.min(getScreenH() / global.lovecUtil.prop.uiScale - pad * 2.0, cap), 64.0) - offH;
  };
  exports.getUiH = getUiH;


  /**
   * Gets standard UI scaling.
   * @return {number}
   */
  const getUiScl = function() {
    return Math.min(getScreenW() / VAR.length.bgW, getScreenH() / VAR.length.bgH);
  };
  exports.getUiScl = getUiScl;


  /**
   * Gets preferred column amount.
   * @param {number|unset} [w]
   * @param {number|unset} [pad]
   * @param {number|unset} [ord]
   * @return {number}
   */
  const getColAmt = function(w, pad, ord) {
    if(w == null) w = 32.0;
    if(pad == null) pad = 4.0;
    if(ord == null) ord = 1;

    return Math.max(Math.floor(getUiW(null, null, ord * VAR.length.ordW, 0.0) / (w + pad)), 7);
  };
  exports.getColAmt = getColAmt;


  /* <------------------------------ info ------------------------------ */


  /**
   * Displays information at screen center.
   * @param {string|unset} [nameMod]
   * @param {string|unset} [bp]
   * @param {number|unset} [timeS]
   * @return {void}
   */
  const showAnnounce = function(nameMod, bp, timeS) {
    if(nameMod == null) nameMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.announce(MDL_bundle.getInfo(nameMod, bp), timeS);
  }
  .setAnno("non-headless");
  exports.showAnnounce = showAnnounce;


  /**
   * Displays information that fades out at upper position.
   * @param {string|unset} [nameMod]
   * @param {string|unset} [bp]
   * @param {number|unset} [timeS]
   * @return {void}
   */
  const showFadeInfo = function(nameMod, bp, timeS) {
    if(nameMod == null) nameMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.showInfoFade(MDL_bundle.getInfo(nameMod, bp), timeS);
  }
  .setAnno("non-headless");
  exports.showFadeInfo = showFadeInfo;


  /**
   * Content unlocked, sector captured...
   * Only possible to show in game.
   * @param {string|unset} [nameMod]
   * @param {string|unset} [bp]
   * @param {TextureRegionDrawable|unset} [icon]
   * @param {number|unset} [w]
   * @return {void}
   */
  const showToast = function(nameMod, bp, icon, w) {
    if(nameMod == null) nameMod = "lovec";
    if(bp == null) bp = "test";
    if(icon == null) icon = VARGEN.icons.ohno;
    if(w == null) w = -1.0;

    Vars.ui.hudfrag.showToast(icon, w, MDL_bundle.getInfo(nameMod, bp));
  }
  .setAnno("non-headless");
  exports.showToast = showToast;


  /**
   * Displays information at some world position.
   * @param {number} x
   * @param {number} y
   * @param {string|unset} [nameMod]
   * @param {string|unset} [bp]
   * @param {number|unset} [timeS]
   * @return {void}
   */
  const showLabel = function(x, y, nameMod, bp, timeS) {
    if(nameMod == null) nameMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.showLabel(MDL_bundle.getInfo(nameMod, bp), timeS, x, y);
  }
  .setAnno("non-headless");
  exports.showLabel = showLabel;


  /**
   * Displays an error dialog.
   * @param {string|unset} [nameMod]
   * @param {string|unset} [bp]
   * @return {void}
   */
  const showError = function(nameMod, bp) {
    if(nameMod == null) nameMod = "lovec";
    if(bp == null) bp = "test";

    Core.app.post(() => {
      Vars.ui.showErrorMessage(MDL_bundle.getInfo(nameMod, bp));
    });
  }
  .setAnno("non-headless");
  exports.showError = showError;


  /* <------------------------------ drama ------------------------------ */


  /**
   * Makes the actor appear at a position, by default center of screen.
   * @param {DialogActor} actor
   * @param {number|unset} [x]
   * @param {number|unset} [y]
   * @param {number|unset} [align]
   * @return {void}
   */
  const setActorPos = function(actor, x, y, align) {
    let done = false;
    actor.update(() => {
      if(!done) {
        actor.setPosition(tryVal(x, getCenterX()), tryVal(y, getCenterY()), tryVal(align, Align.center));
        done = true;
      };
    });
  };
  exports.setActorPos = setActorPos;


  /**
   * Applies a list of actions to some actor, then adds it to the scene.
   * @param {DialogActor} actor
   * @param {number|unset} delay
   * @param {Array<Action>} acts
   * @param {boolean|unset} [permanent] - If true, the actor won't get removed finally.
   * @return {void}
   */
  const setActorAction = function(actor, delay, acts, permanent) {
    if(delay == null) delay = 0.0;

    let acts_fi = [Actions.fadeOut(0.0)];
    if(delay > 0.0) {
      acts_fi.push(Actions.delay(delay));
    };
    acts_fi.pushAll(acts);
    if(!permanent) {
      acts_fi.push(Actions.remove());
    };

    actor.actions.apply(actor, acts_fi);
    actor.pack();
    actor.act(0.1);
    if(Core.scene != null) {
      Core.scene.add(actor);
    };
  };
  exports.setActorAction = setActorAction;


  /**
   * Removes actor from the scene.
   * @param {DialogActor} actor
   * @return {void}
   */
  const removeActor = function(actor) {
    actor.actions(Actions.remove());
  };
  exports.removeActor = removeActor;


  /**
   * Clears background, BGM, image, and characters.
   * @return {void}
   */
  const clearDialFlow = function() {
    TRIGGER_BACKGROUND = false;
    TRIGGER_MUSIC = false;
    LCSoundControl.stop();
    UTIL_dialogFlow.removeTextCur();
    UTIL_dialogFlow.clearRead();
    UTIL_dialogFlow.clearLog();
    UTIL_dialogFlow.clearPool();
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
  const createFade = function(delay, color, inTimeS, outTimeS, susTimeS) {
    if(color == null) color = Color.black;
    if(inTimeS == null) inTimeS = 1.0;
    if(outTimeS == null) outTimeS = inTimeS;
    if(susTimeS == null) susTimeS = 0.5;

    // Created last so it's on top of everything
    Core.app.post(() => {
      let actor = new Table();
      actor.touchable = Touchable.disabled;

      actor.table(Tex.whiteui, tb => {
        tb.setColor(color);
      })
      .width(getScreenW() * 1.2 / global.lovecUtil.prop.uiScale)
      .height(getScreenH() * 1.2 / global.lovecUtil.prop.uiScale)
      .row();

      setActorPos(actor);
      setActorAction(actor, delay, [
        Actions.fadeIn(inTimeS),
        Actions.delay(susTimeS),
        Actions.fadeOut(outTimeS),
      ]);
    });

    return inTimeS + susTimeS;
  };
  exports.createFade = createFade;


  /**
   * Creates a simple flash.
   * @param {number} delay
   * @param {Color|unset} [color]
   * @return {number}
   */
  const createFlash = function(delay, color) {
    if(color == null) color = Color.white;

    createFade(delay, color, 0.1, 0.1, 0.0);
  };
  exports.createFlash = createFlash;


  /**
   * Shows a background image.
   * @param {number} delay
   * @param {string} nameBg
   * @param {function(): boolean} endF
   * @param {number|unset} [inTimeS]
   * @return {number}
   */
  const createBg = function(delay, nameBg, endF, inTimeS) {
    if(inTimeS == null) inTimeS = 1.0;

    let actor = new Table();
    actor.touchable = Touchable.disabled;
    UTIL_dialogFlow.getPool("bg").push(actor);

    actor.table(new TextureRegionDrawable(Core.atlas.find(nameBg)), tb => {})
    .width(VAR.length.bgW * getUiScl())
    .height(VAR.length.bgH * getUiScl())
    .row();

    setActorPos(actor);
    setActorAction(actor, delay, [
      Actions.fadeIn(inTimeS),
      Actions.run(() => actor.update(() => {
        if(endF()) {
          UTIL_dialogFlow.getPool("bg").pull(actor);
          removeActor(actor);
        };
      })),
    ], true);

    return inTimeS;
  };
  exports.createBg = createBg;


  /**
   * Plays background music, temporarily mutes vanilla sound control.
   * @param {number} delay
   * @param {MusicGn} mus_gn
   * @param {function(): boolean} endF
   * @return {number}
   */
  const createBgm = function(delay, mus_gn, endF) {
    let actor = new Table();

    setActorAction(actor, delay, [
      Actions.run(() => {
        LCSoundControl.setMusic(fetchMusic(mus_gn));
      }),
      Actions.run(() => actor.update(() => {
        if(endF()) {
          LCSoundControl.stop();
          removeActor(actor);
        };
      })),
    ], true);

    return 0.0;
  };
  exports.createBgm = createBgm;


  /**
   * Shows a character art.
   * The sprite is named like "chara-<nameChara>".
   * @param {number} delay
   * @param {string} nameMod
   * @param {string} nameChara
   * @param {function(): boolean} endF
   * @param {number|unset} [fracX] - The initial x position of image as fraction.
   * @param {boolean|Color|unset} [isDark0color] - Determines color of the image. The character art will be darkened if this property is true.
   * @param {string|unset} [anim] - Determines animation used on the image.
   * @param {Object|unset} [animParamObj]
   * @param {Array<Action>|unset} [customActs]
   * @param {number|unset} [customActTimeS] - Time spent on `customActs`.
   * @return {number}
   */
  const createChara = function(
    delay, nameMod, nameChara, endF,
    fracX, isDark0color, anim, animParamObj,
    customActs, customActTimeS
  ) {
    if(customActTimeS == null) customActTimeS = 0.0;

    let actor = new Table();
    actor.touchable = Touchable.disabled;
    UTIL_dialogFlow.getPool("chara").push(actor);

    actor.table(new TextureRegionDrawable(Core.atlas.find(nameMod + "-chara-" + nameChara, Core.atlas.find("lovec-chara-error"))), tb => {
      if(isDark0color instanceof Color) {
        tb.setColor(isDark0color);
      } else if(isDark0color) {
        tb.setColor(VAR.color.darkMix);
      };
    })
    .width(VAR.length.charaW * getUiScl() / global.lovecUtil.prop.uiScale)
    .height(VAR.length.charaH * getUiScl() / global.lovecUtil.prop.uiScale)
    .row();

    let done = false;
    actor.update(() => {
      if(!done) {
        actor.setPosition(getScreenW() * (tryVal(fracX, 0.5)), getScreenH() * 0.4, Align.center);
        done = true;
      };
    });

    let
      animTup,
      transTimeS, fracXFrom, fracXTo;

    // I have to hard-code this, otherwise it's bugged, WTF???
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
          Actions.translateBy((fracXTo - fracXFrom) * getScreenW() * 0.5, 0.0, transTimeS * 0.5, Interp.pow2In),
          Actions.translateBy((fracXTo - fracXFrom) * getScreenW() * 0.5, 0.0, transTimeS * 0.5, Interp.pow2Out),
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

    if(!fetchSetting("test-show-error-chara") && !Core.atlas.has(nameMod + "-chara-" + nameChara)) {
      // Do nothing
    } else {
      if(customActs != null) {
        animTup[1].withAll(customActs);
      };
      animTup[1].push(Actions.run(() => actor.update(() => {
        if(endF()) {
          UTIL_dialogFlow.getPool("chara").pull(actor);
          removeActor(actor);
        };
      })));
      setActorAction(actor, delay, animTup[1], true);
    };

    return animTup[0] + customActTimeS;
  };
  exports.createChara = createChara;


  /**
   * Shows selection buttons for dialog flow.
   * @param {number} delay
   * @param {Array} textScrArr - `ROW`: text, scr.
   * @param {number|unset} [w]
   * @param {number|unset} [h]
   * @param {number|unset} [inTimeS]
   * @return {number}
   */
  const createSelection = function(delay, textScrArr, w, h, inTimeS) {
    if(w == null) w = 500.0;
    if(h == null) h = 50.0;
    if(inTimeS == null) inTimeS = 0.5;

    let actor = new Table();
    actor.center();
    textScrArr.forEachRow(2, (text, scr) => {
      actor.button(text, () => {
        UTIL_dialogFlow.addLog({
          chara: "SPEC: selection",
          text: text,
        });
        scr();
        shouldClose = true;
      }).center().size(w, h).row();
      actor.add("").row();
    }, true);
    UTIL_dialogFlow.getPool("selection").push(actor);

    let shouldClose = false;
    setActorPos(actor);
    setActorAction(actor, delay, [
      Actions.fadeIn(inTimeS),
      Actions.run(() => actor.update(() => {
        if(shouldClose) {
          UTIL_dialogFlow.getPool("selection").pull(actor);
          removeActor(actor);
        };
      })),
    ], true);

    return inTimeS;
  };
  exports.createSelection = createSelection;


  /**
   * Shows clickable text box at the bottom of screen.
   * @param {number} delay
   * @param {DialogTuple|unset} [dialTup]
   * @param {DialogCharaTuple|unset} [charaTup]
   * @param {(function(): void)|unset} [scr] - Called just before the text box is removed.
   * @param {Object|unset} [paramObj]
   * @param {SoundGn|unset} [paramObj.sound] - If set, the sound will be played when the text is shown.
   * @param {number|unset} [paramObj.haltTimeS] - If set, the box will be removed after some seconds.
   * @param {boolean|unset} [paramObj.autoClick] - If true, the box will be automatically clicked.
   * @param {boolean|unset} [paramObj.isTail] - Set this to true for last text.
   * @param {Function|unset} [paramObj.selectionScr] - Use this field to call {@link createSelection}.
   * @param {(function(): boolean)|unset} [endF]
   * @return {number}
   */
  const createText = function(delay, dialTup, charaTup, scr, paramObj, endF) {
    if(scr == null) scr = Function.air;

    let actor = new Table();
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
      color = charaTup == null ? Color.white : MDL_color.getCharaColor(charaTup[0], charaTup[1]),
      dialChara = charaTup == null ? "" : MDL_bundle.getChara(charaTup[0], charaTup[1]).color(color),
      dialText = dialTup == null ? "" : MDL_bundle.getDialText(dialTup[0], dialTup[1], dialTup[2]).color(color);

    if(charaTup != null) {
      // `TABLE`: character name
      actor.table(Tex.bar, tb => {
        tb.top().marginLeft(36.0).marginRight(36.0).marginTop(16.0).marginBottom(16.0).setColor(Color.darkGray);
        tb.add(dialChara).center().fontScale(1.35).labelAlign(Align.left);
      }).left().row();
    };
    // `TABLE`: text box
    actor.table(Tex.bar, tb => {
      tb.top().setColor(Pal.darkestGray);
      // `TABLE`: text container
      tb.table(Styles.none, tb1 => {
        let flab = new FLabel((MDL_text.getSpace() === "" ? "{slower}" : "{normal}") + dialText);
        if(shouldTriggerScrOnClick) tb1.clicked(() => {
          if(!flab.hasEnded()) {
            flab.skipToTheEnd();
          } else {
            scr();
            actor.actions(Actions.remove());
          };
        });

        tb1.left().top().marginLeft(48.0).marginRight(48.0).marginTop(28.0).marginBottom(28.0);
        tb1.add(flab).left().top().fontScale(1.35).style(Styles.outlineLabel).labelAlign(Align.topLeft).wrap().width(getScreenW() * 0.6 - 150.0).height(140.0);
      }).left().top();
      // `TABLE`: spacing
      tb.table(Styles.none, tb1 => {}).growX();
      // `TABLE`: buttons
      tb.table(Styles.none, tb1 => {
        tb1.top();
        tb1.button("X", () => Vars.ui.showConfirm(MDL_bundle.getInfo("lovec", "dial-skip-dial-confirm"), MDL_bundle.getInfo("lovec", "dial-skip-dial-confirm", true), () => {
          clearDialFlow();
          removeActor(actor);
        })).size(40.0).tooltip(MDL_bundle.getInfo("lovec", "tt-skip-dial"), true).row();
        tb1.button("L", () => fetchDialog("dialFlowLog").ex_show()).size(40.0).tooltip(MDL_bundle.getInfo("lovec", "tt-dial-flow-log"), true).row();
      }).right().top();
    }).width(getScreenW() * 0.6).height(160.0).row();

    setActorPos(actor, null, 0.0, Align.bottom);
    setActorAction(actor, delay,
      actions_fi != null ?
        actions_fi :
        [Actions.fadeIn(0.25), Actions.run(() => actor.update(() => {
          if(endF != null && endF()) removeActor(actor);
        }))],
      true,
    );

    if(selectionScr != null) paramObj.selectionScr();
    if(sound != null) MDL_sound.play(paramObj.sound);

    UTIL_dialogFlow.setTextCur(actor);
    UTIL_dialogFlow.addLog({
      chara: dialChara,
      text: dialText,
    });

    return delay_fi != null ?
      delay_fi :
      0.5;
  };
  exports.createText = createText;


  /**
   * Creates a dialog flow, which should be defined with {@link newDialogFlow} beforehand.
   * See {@link DialogFlowData}.
   * @param {string} nameDialFlow
   * @return {void}
   */
  const createFlow = function thisFun(nameDialFlow) {
    let dialFlowData = fetchDialogFlow(nameDialFlow);
    if(dialFlowData.length === 0) {
      console.warn("[LOVEC] Cannot find dialog flow for " + nameDialFlow + "!");
      return;
    };

    thisFun.flowIndMap.put(dialFlowData, 0);
    thisFun.callFlow(dialFlowData);
  }
  .setProp({
    flowIndMap: new ObjectMap(),
    callFlow: function(dialFlowData) {
      UTIL_dialogFlow.clearPool("chara");

      let ind = createFlow.flowIndMap.get(dialFlowData, 0);
      let obj = tryVal(dialFlowData[ind * 4 + 2], Object.air);
      let args = dialFlowData[ind * 4 + 3];

      if(obj.scr != null) obj.scr();
      if(args != null) {
        args.forEachFast(arr => createChara(arr[0], arr[1], arr[2], () => UTIL_dialogFlow.checkRead(ind), arr[3], arr[4], arr[5], arr[6], arr[7]), true);
      };
      createText(0.0, dialFlowData[ind * 4], dialFlowData[ind * 4 + 1], () => {
        let nextInd = ind + 1;
        createFlow.flowIndMap.put(dialFlowData, nextInd);
        UTIL_dialogFlow.setRead(ind);
        if(nextInd * 4 < dialFlowData.length) {
          createFlow.callFlow(dialFlowData);
        } else {
          clearDialFlow();
        };
      }, obj, () => UTIL_dialogFlow.checkRead(ind));
    },
    callNext: function(dialFlowData) {
      let nextInd = createFlow.flowIndMap.get(dialFlowData, 0) + 1;
      createFlow.flowIndMap.put(dialFlowData, nextInd);
      UTIL_dialogFlow.setRead(nextInd - 1);
      createFlow.callFlow(dialFlowData);
    },
  });
  exports.createFlow = createFlow;
