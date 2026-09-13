/** mindustry.ctype.Content */
declare class Content implements java.lang.Comparable<Content> {}
/** mindustry.type.ErrorContent */
declare class ErrorContent extends Content {}
/** mindustry.ctype.ContentType */
declare class ContentType {
    static item: ContentType;
    static block: ContentType;
    static bullet: ContentType;
    static liquid: ContentType;
    static status: ContentType;
    static unit: ContentType;
    static weather: ContentType;
    static sector: ContentType;
    static error: ContentType;
    static planet: ContentType;
    static team: ContentType;
    static unitCommand: ContentType;
    static unitStance: ContentType;
}
/** mindustry.ctype.MappableContent */
declare class MappableContent extends Content {}
/** mindustry.ctype.UnlockableContent */
declare class UnlockableContent extends MappableContent {}
