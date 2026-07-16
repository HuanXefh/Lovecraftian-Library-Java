package lovec;

import arc.util.*;
import lovec.graphics.LCDrawf;
import lovec.utils.LCScript;
import mindustry.mod.*;

public class Lovec extends Mod{


    public Lovec() {
        Log.info("[LOVEC] Loaded Java classes.");
    };


    @Override
    public void init() {
        LCScript.init();
        LCDrawf.init();
    };


};
