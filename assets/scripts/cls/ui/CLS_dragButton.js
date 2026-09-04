/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * A draggable group of buttons.
     * New buttons are registered in {@link DB_misc}.
     * @class
     */
    const CLS_dragButton = newClass().initClass();


    CLS_dragButton.prototype.init = function() {


        /** @type {boolean} */
        this.isHidden = false;
        /** @type {boolean} */
        this.isLoaded = false;
        /** @type {number} */
        this.prefW = 0.0;
        /** @type {number} */
        this.timeScl = 1.0;

        /** @type {DragButtonData} */
        this.btnData = [
            [], [], [], [], [],
            [], [], [], [], [],
            [], [], [], [], [],
        ];
        /** @type {Array<number>} */
        this.colCounts = [
            0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
        ];
        /** @type {Table} */
        this.root = (function() {
            let tb = new Table();
            tb.visibility = () => Vars.ui.hudfrag.shown;
            return tb;
        })();


        this.load();
        TRIGGER.mapChange.addGlobalListener(nameMap => {
            this.timeScl = 1.0;
            Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
            this.rebuild();
        });


    };


    /** @type {number} */
    const BUTTON_SIZE = 42.0;
    /** @type {Array<CLS_dragButton>} */
    const addedGrps = [];


    let mouseMoveX = 0.0, mouseMoveY = 0.0, mouseMoveStartX = 0.0, mouseMoveStartY = 0.0;
    MDL_event.onDrag((dx, dy, x_f, y_f) => {
        mouseMoveX = dx;
        mouseMoveY = dy;
        mouseMoveStartX = x_f;
        mouseMoveStartY = y_f;
    });
    MDL_event.onUpdate(() => {
        addedGrps.forEachFast(grp => grp.update(), true);
    });


    /**
     * Whether it's allowed to change game speed now.
     * @return {boolean}
     */
    function checkCanControlTime() {
        return Vars.state.isGame() && Groups.player.size() === 1 && !Vars.state.getPlanet().campaignRules.pauseDisabled;
    };


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


    /* <------------------------------ util ------------------------------ */


    /**
     * Loads data for the group.
     * @return {void}
     */
    CLS_dragButton.prototype.load = function() {
        if(Vars.headless || this.isLoaded) return;

        (function() {
            let obj = DB_misc.db["mod"]["dragButton"];
            return !PARAM.MODDED ?
                obj["base"] :
                obj["base"].concat(obj["modded"]);
        })()
        .forEachRow(2, (name, paramObj) => {
            let rowInd = readParam(paramObj, "rowInd", 0);
            if(rowInd >= this.btnData.length) LCErrorHandler.throw("indexOutOfBound", rowInd, this.btnData.length);

            this.btnData[rowInd].push([
                !Core.bundle.has("drag." + name) ? null : Core.bundle.get("drag." + name),
                (function() {let icon, iconStr = readParam(paramObj, "icon", "error"); try {icon = Icon[iconStr]} catch(err) {icon = new TextureRegionDrawable(Core.atlas.find(iconStr))}; return icon})(),
                readParam(paramObj, "isToggle", false),
                readParam(paramObj, "clickScr", Function.air),
                readParam(paramObj, "updateScr", null),
            ]);
        }, true);
        this.isLoaded = true;
    };


    /**
     * Rebuilds the group.
     * @return {void}
     */
    CLS_dragButton.prototype.rebuild = function() {
        this.root.clearChildren();
        let btns = this.root.table(Styles.black3, tb => tb.left()).left().get();
        this.root.left().top().row();

        this.colCounts.setValue(0);

        // Drag button
        let isDragged = false;
        this.colCounts[0]++;
        let dragBtn = btns.button(Icon.move, Styles.cleari, () => {})
        .size(BUTTON_SIZE)
        .get();
        dragBtn.update(() => {
            if(isDragged) {
                this.root.translation.x += mouseMoveX;
                this.root.translation.y += mouseMoveY;
            };
        });
        dragBtn.tapped(() => isDragged = true);
        dragBtn.released(() => isDragged = false);

        // Collapser button
        this.colCounts[0]++;
        btns.button(this.isHidden ? Icon.downOpen : Icon.upOpen, Styles.cleari, () => {
            this.isHidden = !this.isHidden;
            this.rebuild();
        }).size(BUTTON_SIZE);

        // Loaded buttons
        btns.row();
        if(!this.isHidden) {
            let
                i = 0,
                iCap = this.btnData.iCap(),
                btnCell;

            while(i < iCap) {
                this.btnData[i].forEachFast(tup => {
                    this.colCounts[i + 1]++;
                    let
                        name = tup[0],
                        icon = tup[1],
                        isToggle = tup[2],
                        clickScr = tup[3],
                        updateScr = tup[4];

                    btnCell = btns.button(icon, isToggle ? Styles.clearTogglei : Styles.cleari, clickScr).size(BUTTON_SIZE);
                    if(name != null) btnCell.tooltip(name, true);
                    if(updateScr != null) {
                        let btn = btnCell.get();
                        btnCell.update(() => updateScr.call(btn));
                    };
                }, true);
                btns.row();
                i++;
            };
        };

        this.prefW = Math.max.apply(null, this.colCounts) * BUTTON_SIZE;

        // Time control
        if(!this.isHidden) {
            this.root.table(Tex.whiteui, tb => {
                tb.left().setColor(Pal.darkestGray);
                tb.add("").get().setText(prov(() => Strings.fixed(this.timeScl, 2) + "x"));
                tb.row();
                MDL_table.slider(tb, val => {
                    val = checkCanControlTime() ? val : 1.0;
                    Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0 * val);
                    this.timeScl = val;
                }, 0.25, 3.0, 0.25, this.timeScl, this.prefW);
            }).left().row();
        };
    };


    /**
     * Updates the group.
     * @return {void}
     */
    CLS_dragButton.prototype.update = function() {
        if(!checkCanControlTime()) {
            Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
        };
    };


    /**
     * Adds the group to scene.
     * @param {number|unset} [x]
     * @param {number|unset} [y]
     * @return {void}
     */
    CLS_dragButton.prototype.add = function(x, y) {
        if(Core.scene == null) return;
        if(x == null) x = MDL_ui.getCenterX() * 1.2;
        if(y == null) y = MDL_ui.getCenterY() * 0.4;

        this.rebuild();
        this.root.setPosition(x, y, Align.center);
        Core.scene.add(this.root);
        addedGrps.pushUnique(this);
    };




module.exports = CLS_dragButton;
