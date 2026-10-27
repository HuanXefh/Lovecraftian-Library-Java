package lovec;

import arc.util.*;
import lovec.audio.SLCSoundControl;
import lovec.content.SLCMultiBlockHandler;
import lovec.graphics.SLCDrawf;
import lovec.utils.SLCVersionResolver;
import lovec.utils.SLCScript;
import mindustry.mod.*;

public class Lovec extends Mod{


    public Lovec() {
        SLCVersionResolver.load();
        SLCSoundControl.load();
        SLCClassMap.load();
        Log.info("[LOVEC] Loaded Java classes.");
    };


    @Override
    public void init() {
        SLCScript.init();
        SLCDrawf.init();
    };


    @Override
    public void loadContent() {
        SLCMultiBlockHandler.loadBlock();
    };


};
