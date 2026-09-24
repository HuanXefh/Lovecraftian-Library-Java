/** lovec.content.ContentUpdater */
declare class ContentUpdater<T> {
    constructor(target: T)
}
/** lovec.content.BuildUpdater */
declare class BuildUpdater<T, K> extends ContentUpdater<T> {
    constructor(b: T)
}
