package lovec;

import arc.util.*;
import lovec.audio.LCSoundControl;
import lovec.graphics.LCDrawf;
import lovec.utils.LCScript;
import mindustry.mod.*;

public class Lovec extends Mod{


    public Lovec() {
        LCSoundControl.load();
        LCClassMap.load();
        Log.info("[LOVEC] Loaded Java classes.");
    };


    @Override
    public void init() {
        LCScript.init();
        LCDrawf.init();
    };


};
