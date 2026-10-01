package lovec.utils;

import lovec.annotation.FromScript;
import mindustry.ai.BlockIndexer;
import mindustry.core.Version;
import mindustry.core.World;
import mindustry.entities.EntityGroup;
import mindustry.gen.Bullet;
import mindustry.gen.Player;

public class LCVersionResolver {


    public static boolean isV8 = Version.number < 9;

    public static Class<?> MappableContent;
    public static Class<?> UnlockableContent;

    @FromScript(source = "GLB_var")
    public static World world;
    @FromScript(source = "GLB_var")
    public static BlockIndexer indexer;

    @FromScript(source = "GLB_var", name = "bulletEntities")
    public static EntityGroup<Bullet> bulletGroup;
    @FromScript(source = "GLB_var", name = "playerEntities")
    public static EntityGroup<Player> playerGroup;


    public static void load() {
        try {
            try {
                // Why is MindustryX marked as v7???
                var cls = Class.forName("mindustryX.VarsX");
                if(Version.number == 7) {
                    isV8 = true;
                };
            } catch(Exception err) {
                // Do nothing
            };

            MappableContent = Class.forName(isV8 ? "mindustry.ctype.MappableContent" : "mindustry.type.MappableContent");
            UnlockableContent = Class.forName(isV8 ? "mindustry.ctype.UnlockableContent" : "mindustry.type.UnlockableContent");
        } catch(Exception err) {
            throw new RuntimeException(err);
        };
    };


}
