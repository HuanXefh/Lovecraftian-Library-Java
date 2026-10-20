/** lovec.content.LCContentUpdater */
declare class LCContentUpdater<T> {
    constructor(target: T)
}
/** lovec.content.LCBuildUpdater */
declare class LCBuildUpdater<T, K> extends LCContentUpdater<T> {
    constructor(b: T)
}
