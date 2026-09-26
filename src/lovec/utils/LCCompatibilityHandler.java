package lovec.utils;

import mindustry.core.Version;

public class LCCompatibilityHandler {


    public static boolean isV8 = Version.number < 9;

    public static Class<?> UnlockableContent;


    public static void load() {
        try {
            try {
                // Why is MindustryX marked as v7???
                var cls1 = Class.forName("mindustryX.VarsX");
                if(Version.number == 7) {
                    isV8 = true;
                };
            } catch(Exception err) {
                // Do nothing
            };

            UnlockableContent = Class.forName(isV8 ? "mindustry.ctype.UnlockableContent" : "mindustry.type.UnlockableContent");
        } catch(Exception err) {
            throw new RuntimeException(err);
        };
    };


}
