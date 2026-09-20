type RecipeDictionaryData = {
    /** If true, this recipe won't be displayed. */
    hidden?: boolean;
    /** Texture region used. */
    icon?: string;
    /** Contents displayed in icon tooltip. */
    iconCts?: Array<ContentGn>;
    /** Text following icon. */
    iconText?: string;
    /** An icon button of some content. */
    ct?: string;
    /** Tint color of the content button. */
    ctTint?: Color;
    /** Table builder for content button tooltip. */
    ctTableF?: C3Function<Table, Block, UnlockableContent>;
    /** Replaces content button icon with text. */
    ctText?: string;
    /** Overwrites craft time. */
    time?: number;
}


type RecipeDictionaryCustomFieldData = {
    /** This mod is required for the field to show up. */
    mod?: string;
    /** Texture region used. */
    icon?: string|Drawable;
    /** Whether this field is consumed/produced continuously. */
    isContinuous?: boolean;
    /** Whether this field uses amount instead of rate, like vanilla heat. */
    isStatic?: boolean;
}


/** `ROW`: blk, amt, data. */
type RecipeDictionaryIoArray = F3Array<Block, number, RecipeDictionaryData>
type RecipeDictionaryConsumeReader = (
    blk: Block,
    cons: Consume|null,
    data: RecipeDictionaryData|null,
    dictConsItem: Array<RecipeDictionaryIoArray>,
    dictConsFld: Array<RecipeDictionaryIoArray>,
    dictConsBlk: Array<RecipeDictionaryIoArray>,
    dictConsUtp: Array<RecipeDictionaryIoArray>,
) => void
type RecipeDictionaryProduceReader = (
    blk: Block,
    data: RecipeDictionaryData|null,
    dictProdItem: Array<RecipeDictionaryIoArray>,
    dictProdFld: Array<RecipeDictionaryIoArray>,
    dictProdBlk: Array<RecipeDictionaryIoArray>,
    dictProdUtp: Array<RecipeDictionaryIoArray>,
) => void
