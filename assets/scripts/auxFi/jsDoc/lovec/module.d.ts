type TableParamObject = {
    size?: number;
    sizeW?: number;
    sizeH?: number;
    w?: number;
    h?: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    color?: Color;

    margin?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    pad?: number;
    padLeft?: number;
    padRight?: number;
    padTop?: number;
    padBottom?: number;

    align?: number;
    labelAlign?: number;
    grow?: boolean;
    growX?: boolean;
    growY?: boolean;
    fill?: boolean;
    fillX?: boolean;
    fillY?: boolean;
    expand?: boolean;
    expandX?: boolean;
    expandY?: boolean;

    hasRow?: boolean;
    padOrd?: number;
    colAmt?: number;
    rowAmt?: number;
    closeSelect?: boolean;
    useAutoSelection?: boolean;
    maxSelected?: number;
    breakBools?: Array<boolean>;
    ttArg?: TooltipArgument;

    colorLine?: Color;
    colorTitle?: Color;
    colorBase?: Color;
    stroke?: number;
    dialToHide?: Dialog;
    ctDial?: ContentInfoDialog;
}
