declare namespace mindustry {
    namespace maps {
        /** mindustry.maps.Map */
        class Map {
            readonly custom: boolean;
            readonly tags: StringMap;
            readonly file: Fi;
            readonly version: number;
            workshop: boolean;
            width: number;
            height: number;
            texture: Texture|null;
            build: number;
            teams: IntSet;
            spawns: number;
            mod: Mods.LoadedMod;
        }
    }
}
/** mindustry.maps.Maps */
declare class Maps {}
