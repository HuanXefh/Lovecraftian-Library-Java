/** mindustry.mod.Mod */
declare class Mod {}
/** mindustry.mod.Mods */
declare class Mods {}
declare namespace Mods {
    class LoadedMod implements Publishable, Disposable {
        readonly file: Fi;
        readonly root: Fi;
        readonly main: Mod|null;
        readonly name: string;
        readonly meta: ModMeta;
        dependencies: Seq<LoadedMod>;
        softDependencies: Seq<LoadedMod>;
        missingDependencies: Seq<LoadedMod>;
        missingSoftDependencies: Seq<LoadedMod>;
        erroredContent: ObjectSet<Content>;
        state: ModState;
        iconTexture: Texture|null;
        loader: java.lang.ClassLoader|null;
    }
    class ModMeta {
        name: string;
        internalName: string;
        minGameVersion: string;
        displayName: string|null;
        author: string|null;
        description: string|null;
        subtitle: string|null;
        version: string|null;
        main: string|null;
        repo: string|null;
        dependencies: Seq<string>;
        softDependencies: Seq<string>;
        hidden: boolean;
        java: boolean;
        iosCompatible: boolean;
        texturescale: number;
        pregenerated: boolean;
        contentOrder: Array<string>;
        legacyCompatible: boolean;
    }
    class ModState {
        static enabled: Mods.ModState;
        static contentErrors: Mods.ModState;
        static missingDependencies: Mods.ModState;
        static incompleteDependencies: Mods.ModState;
        static circularDependencies: Mods.ModState;
        static unsupported: Mods.ModState;
        static disabled: Mods.ModState;
    }
    class ModDependency {}
}


/** mindustry.mod.ClassMap */
declare class ClassMap {
    static readonly classes: ObjectMap<string, Class<Object>>
}


/** mindustry.mod.ContentParser */
declare class ContentParser {}


/** mindustry.mod.DataAssetCache */
declare class DataAssetCache {}
