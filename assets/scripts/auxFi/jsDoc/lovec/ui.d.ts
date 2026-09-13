/** `ROW`: name, icon, isToggle, clickScr, updateScr. */
type DragButtonData = F5Array<string|null, Drawable, boolean, C0Function, C0Function>
type DragButtonParamObject = {
    rowInd: number;
    icon: string;
    isToggle?: boolean;
    clickScr?: C0Function;
    /** @this {Button} */
    updateScr?: C0Function;
}


type DialogActor = Table
/** `TUPLE`: nameMod, nameDial, ind. */
type DialogTextTuple = [string, string, number]
/** `TUPLE`: nameMod, nameChara. */
type DialogCharaTuple = [string, string]
type DialogAnimParamObject = {
    transTimeS?: number;
    fracXFrom?: number;
    fracXTo?: number;
}
type DialogCharaParamObject = {
    nameMod: string;
    nameChara: string;
    fracX?: number;
    isDark?: boolean;
    color?: Color;
    anim?: string;
    animParam?: DialogAnimParamObject;
    customActs?: Array<Action>;
    customActTimeS?: number;
}
/** `ROW`: delay, nameMod, nameChara, fracX, charaColorArg, anim, animParamObj, customActs. */
type DialogCharaParamArray = F8Array<number, string, string, number|unset, boolean|Color|unset, string|unset, DialogAnimParamObject|unset, Array<Action>|unset>
/** `ROW`: nameMod, nameDial, selInd. */
type DialogSelectionData = F3Array<string, string, number>
type DialogFlowParamObject = {
    haltTimeS?: number;
    autoClick?: boolean;
    isTail?: boolean;
    sound?: SoundGn;

    /** @internal */
    selectionScr?: C0Function;
}
/** `ROW`: dialTup, charaTup, paramObj, charaParamArr. */
type DialogFlowData = F4Array<DialogTextTuple|unset, DialogCharaTuple|unset, DialogFlowParamObject|unset, DialogCharaParamArray|unset>
type DialogLogObject = {
    chara?: string;
    text?: string;
}
