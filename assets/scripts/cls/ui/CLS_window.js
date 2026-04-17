/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Container of a special table that can be dragged.
   * @class
   * @param {string|unset} [title]
   * @param {function(Table): void} [tableF]
   */
  const CLS_window = newClass().initClass();


  CLS_window.prototype.init = function(title, tableF) {
    this.title = tryVal(title, "").plain();
    this.tableF = tryVal(tableF, Function.air);

    this.initParam();

    this.root = CLS_window.getRootTable(this);
    this.base = null;
  };


  let mouseMoveX = 0.0, mouseMoveY = 0.0, mouseMoveStartX = 0.0, mouseMoveStartY = 0.0;
  MDL_event._c_onDrag((dx, dy, x_f, y_f) => {
    mouseMoveX = dx;
    mouseMoveY = dy;
    mouseMoveStartX = x_f;
    mouseMoveStartY = y_f;
  }, 19552700);


  const selectedWins = [];
  const btnStyles = {};
  MDL_event._c_onLoad(() => {
    btnStyles.setProp({
      close: extend(TextButton.TextButtonStyle, {
        font: Fonts.outline,
        fontColor: Pal.remove,
        downFontColor: Pal.remove,
        overFontColor: Color.white,
      }),
      minimize: extend(TextButton.TextButtonStyle, {
        font: Fonts.outline,
        fontColor: Pal.heal,
        downFontColor: Pal.heal,
        overFontColor: Color.white,
      }),
      restore: extend(TextButton.TextButtonStyle, {
        font: Fonts.outline,
        fontColor: Pal.accent,
        downFontColor: Pal.accent,
        overFontColor: Color.white,
      }),
    });
  });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets a new root table for some window.
   * @param {CLS_window} win
   * @return {Table}
   */
  CLS_window.getRootTable = function(win) {
    const tb = new Table().top();
    tb.tapped(() => {
      if(!Core.input.keyDown(KeyCode.controlLeft) && !Core.input.keyDown(KeyCode.controlRight)) selectedWins.clear();
      selectedWins.pushUnique(win);
      Core.scene.root.getChildren().remove(tb);
      Core.scene.root.getChildren().add(tb);
    });
    tb.update(() => {
      if(Core.input.keyDown(KeyCode.shiftLeft) || Core.input.keyDown(KeyCode.shiftRight)) {
        if(Core.input.keyDown(KeyCode.x)) selectedWins.forEachFast(win => win.close());
        if(Core.input.keyDown(KeyCode.s)) selectedWins.forEachCond(win => !win.isHidden, win => win.minimize());
        if(Core.input.keyDown(KeyCode.a)) selectedWins.forEachCond(win => win.isHidden, win => win.minimize());
      };
    });
    tb.visibility = () => Vars.ui.hudfrag.shown && PARAM.SHOULD_SHOW_WINDOW;
    return tb;
  };


  /**
   * Gets a new base table for some window.
   * @param {CLS_window} win
   * @return {Table}
   */
  CLS_window.getBaseTable = function(win) {
    return new Table(Tex.whiteui);
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ property ------------------------------ */


  /**
   * Sets colors used for the window.
   * @param {Color|unset} [titleColor]
   * @param {Color|unset} [contColor]
   * @return {this}
   */
  CLS_window.prototype.setColor = function(titleColor, contColor) {
    if(titleColor != null) this.titleColor = titleColor;
    if(contColor != null) this.contColor = contColor;

    return this;
  };


  /**
   * Sets range for window width and height.
   * @param {number|unset} [minW]
   * @param {number|unset} [maxW]
   * @param {number|unset} [minH]
   * @param {number|unset} [maxH]
   * @return {this}
   */
  CLS_window.prototype.setSizeRange = function(minW, maxW, minH, maxH) {
    if(minW != null) this.minW = minW;
    if(maxW != null) this.maxW = maxW;
    if(minH != null) this.minH = minH;
    if(maxH != null) this.maxH = maxH;

    return this;
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Initializes some parameters of this window.
   * @return {this}
   */
  CLS_window.prototype.initParam = function() {
    this.added = false;
    this.isHidden = false;
    this.prefW = 0.0;
    this.prefH = 0.0;
    this.prefWCont = 0.0;
    this.prefHCont = 0.0;

    this.minW = 320.0;
    this.maxW = 840.0;
    this.minH = 40.0;
    this.maxH = 420.0;
    this.titleColor = Color.darkGray;
    this.contColor = Pal.darkestGray;

    return this;
  };


  /**
   * Rebuilds the entire window.
   * @return {void}
   */
  CLS_window.prototype.rebuild = function thisFun() {
    const root = this.root;
    root.clearChildren();
    const base = CLS_window.getBaseTable(this);
    this.base = base;
    root.add(base).top().growX();

    base.update(() => {
      base.setColor(selectedWins.includes(this) ? Pal.accent : Color.white);
    });
    base.top();

    // Row 1
    (3)._it(() => thisFun.addPlaceholder(base));
    base.row();
    // Row 2 (contents)
    thisFun.addPlaceholder(base);
    base.table(Styles.none, tb => {
      // <TABLE>: title
      let titleCell = tb.table(Tex.whiteui, tb1 => {
        tb1.left().setColor(this.titleColor);
        tb1.dragged((dx, dy) => {
          selectedWins.forEachFast(win => {
            win.root.translation.x += mouseMoveX;
            win.root.translation.y += mouseMoveY;
          });
        });
        // <TABLE>: title base
        tb1.table(Styles.none, tb2 => {
          tb2.left();
          MDL_table.__margin(tb2, 0.25);
          let funBtnSize = 8.0;
          // Close
          tb2.table(Styles.none, tb3 => {}).width(funBtnSize);
          tb2.button("X", btnStyles.close, () => selectedWins.forEachFast(win => win.close())).size(funBtnSize).padRight(4.0).tooltip(MDL_bundle._term("lovec", "win-close"), true);
          // Minimize & restore
          tb2.table(Styles.none, tb3 => {}).width(funBtnSize);
          tb2.button(this.isHidden ? "L" : "S", btnStyles[this.isHidden ? "restore" : "minimize"], () => selectedWins.forEachFast(win => win.minimize())).size(funBtnSize).padRight(4.0).tooltip(MDL_bundle._term("lovec", this.isHidden ? "win-restore" : "win-minimize"), true);
          // Text
          tb2.table(Styles.none, tb3 => {}).width(16.0);
          tb2.table(Styles.none, tb3 => tb3.add(this.title));
          tb2.table(Styles.none, tb3 => {}).width(16.0);
        });
      }).growX();
      tb.row();
      // <TABLE>: contents
      if(!this.isHidden) {
        tb.table(Tex.whiteui, tb1 => {
          tb1.left().setColor(this.contColor);
          MDL_table.__margin(tb1);
          tb1.pane(pnTb => {
            this.tableF(pnTb);
            this.prefW = Mathf.clamp(pnTb.prefWidth, this.minW, this.maxW);
            this.prefH = Mathf.clamp(pnTb.prefHeight, this.minH, this.maxH);
          }).width(this.prefW).height(this.prefH);
          this.prefWCont = tb1.prefWidth;
          this.prefHCont = tb1.prefHeight;
        }).grow().row();
      };
      titleCell.width(this.prefWCont);
    });
    thisFun.addPlaceholder(base);
    base.row();
    // Row 3
    (3)._it(() => thisFun.addPlaceholder(base));

    if(this.isHidden) {
      root.table(Styles.none, tb1 => {}).height(this.prefHCont);
    };

    // Move the window table to center position
    root.setPosition(MDL_ui._centerX(), MDL_ui._centerY() + this.prefH * 0.5, Align.center);
  }
  .setProp({
    addPlaceholder: function(tb) {
      tb.table(Styles.none, tb1 => {}).width(2.0).height(2.0);
    },
  });


  /**
   * Adds the window to scene.
   * @return {void}
   */
  CLS_window.prototype.add = function() {
    if(Core.scene == null || this.added) return;
    if(Core.app.isMobile()) {
      MDL_ui.show_fadeInfo("lovec", "non-mobile");
      return;
    };

    this.rebuild();
    this.root.setPosition(MDL_ui._centerX(), MDL_ui._centerY() + this.prefH * 0.5, Align.center);
    Core.scene.add(this.root);
    this.added = true;
  };


  /**
   * Removes the window from scene.
   * @return {void}
   */
  CLS_window.prototype.close = function() {
    if(!this.added) return;

    this.root.actions(Actions.remove());
    this.added = false;
    Core.app.post(() => {
      selectedWins.remove(this);
    });
  };


  /**
   * Minimizes the window, or restores it if already hidden.
   * @return {void}
   */
  CLS_window.prototype.minimize = function() {
    if(!this.added) return;

    this.isHidden = !this.isHidden;
    this.rebuild();
  };




module.exports = CLS_window;
