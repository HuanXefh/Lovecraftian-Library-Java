/** mindustry.ui.Bar */
declare class Bar extends Element {
    constructor()
    constructor(name: string, color: Color, fracF: Floatp)
    constructor(nameF: _Prov<string>, colorF: _Prov<Color>, fracF: Floatp)

    reset(frac: number): void
    set(nameF: _Prov<string>, colorF: _Prov<Color>, fracF: Floatp): void
    snap(): void
    outline(color: Color, stroke: number): this
    flash(): void
    blink(color: Color): this
}


/** mindustry.ui.ReqImage */
declare class ReqImage extends Stack {
    constructor(ele: Element, validF: Boolp)
    constructor(reg: TextureRegion, validF: Boolp)
}
/** mindustry.ui.MultiReqImage */
declare class MultiReqImage extends Stack {
    add(reqImg: ReqImage): void
}


/** mindustry.ui.Fonts */
declare class Fonts {
    static def: Fonts;
    static outline: Fonts;
    static icon: Fonts;
    static iconLarge: Fonts;
    static tech: Fonts;
    static logic: Fonts;
    static monospace: Fonts;

    static getUnicode(str: string): number
    static getUnicodeString(str: string): string
    static hasUnicodeStr(str: string): boolean
    static unicodeToName(unicode: number): string|null
    static getLargeIcon(name: string): TextureRegion

    static registerIcon(name: string, id: number, reg: TextureRegion): void
    static unregisterIcon(name: string): void
    static hasIcon(name: string): boolean
    static getGlyph(font: Font, glyph: java.lang.Character): TextureRegionDrawable

    static cursorScale(): number
}


/** mindustry.ui.Styles */
declare class Styles {
    static black: Drawable;
    static black9: Drawable;
    static black8: Drawable;
    static black6: Drawable;
    static black3: Drawable;
    static black5: Drawable;
    static grayPanel: Drawable;
    static grayPanelDark: Drawable;
    static none: Drawable;
    static flatDown: Drawable;
    static flatOver: Drawable;
    static accentDrawable: Drawable;

    static defaultb: Button.ButtonStyle;
    static underlineb: Button.ButtonStyle;

    static defaultt: TextButton.TextButtonStyle;
    static flatt: TextButton.TextButtonStyle;
    static grayt: TextButton.TextButtonStyle;
    static flatTogglet: TextButton.TextButtonStyle;
    static flatBordert: TextButton.TextButtonStyle;
    static nonet: TextButton.TextButtonStyle;
    static logicTogglet: TextButton.TextButtonStyle;
    static flatToggleMenut: TextButton.TextButtonStyle;
    static togglet: TextButton.TextButtonStyle;
    static cleart: TextButton.TextButtonStyle;
    static clearTogglet: TextButton.TextButtonStyle;
    static fullTogglet: TextButton.TextButtonStyle;
    static squareTogglet: TextButton.TextButtonStyle;
    static logict: TextButton.TextButtonStyle;

    static defaulti: ImageButton.ImageButtonStyle;
    static nodei: ImageButton.ImageButtonStyle;
    static emptyi: ImageButton.ImageButtonStyle;
    static emptyTogglei: ImageButton.ImageButtonStyle;
    static selecti: ImageButton.ImageButtonStyle;
    static logici: ImageButton.ImageButtonStyle;
    static geni: ImageButton.ImageButtonStyle;
    static grayi: ImageButton.ImageButtonStyle;
    static graySquarei: ImageButton.ImageButtonStyle;
    static flati: ImageButton.ImageButtonStyle;
    static squarei: ImageButton.ImageButtonStyle;
    static squareTogglei: ImageButton.ImageButtonStyle;
    static grayTogglei: ImageButton.ImageButtonStyle;
    static clearNonei: ImageButton.ImageButtonStyle;
    static cleari: ImageButton.ImageButtonStyle;
    static clearTogglei: ImageButton.ImageButtonStyle;
    static clearNoneTogglei: ImageButton.ImageButtonStyle;

    static defaultPane: ScrollPane.ScrollPaneStyle;
    static horizontalPane: ScrollPane.ScrollPaneStyle;
    static smallPane: ScrollPane.ScrollPaneStyle;
    static noBarPane: ScrollPane.ScrollPaneStyle;

    static defaultSlider: Slider.SliderStyle;

    static defaultLabel: Label.LabelStyle;
    static outlineLabel: Label.LabelStyle;
    static techLabel: Label.LabelStyle;
    static monoLabel: Label.LabelStyle;

    static defaultField: TextField.TextFieldStyle;
    static nodeField: TextField.TextFieldStyle;
    static areaField: TextField.TextFieldStyle;
    static nodeArea: TextField.TextFieldStyle;

    static defaultCheck: CheckBox.CheckBoxStyle;

    static defaultDialog: Dialog.DialogStyle;
    static fullDialog: Dialog.DialogStyle;

    static defaultTree: TreeElement.TreeStyle;
}


/** mindustry.ui.Elems */
declare class Elems {
    static check(text: string, checked: boolean, cons: Boolc): Button
    static check(text: string, checkedF: Boolp, cons: Boolc): Button
    static check(text: string, checkedCur: boolean, checkedF: Boolp|null, cons: Boolc): Button
}


/** mindustry.ui.dialogs.BaseDialog */
declare class BaseDialog extends Dialog {}
/** mindustry.ui.dialogs.ContentInfoDialog */
declare class ContentInfoDialog extends BaseDialog {
    show(ct: UnlockableContent): void
}
/** mindustry.ui.dialogs.ColorPicker */
declare class ColorPicker extends BaseDialog {
    show(color: Color, cons: Cons<Color>): void
    show(color: Color, useAlpha: boolean, cons: Cons<Color>): void
}
