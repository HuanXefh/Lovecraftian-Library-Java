package lovec.utils;

import lovec.annotation.FromScript;
import mindustry.Vars;
import mindustry.ctype.UnlockableContent;
import mindustry.gen.Building;
import mindustry.type.Liquid;
import rhino.Context;
import rhino.NativeObject;

import static lovec.utils.LCScript.*;

/**
 * Utility methods directly related to Lovec modules.
 */
public class LCScriptUtil {


    @FromScript(source = "VARGEN")
    public static Liquid auxPres;
    @FromScript(source = "VARGEN")
    public static Liquid auxVac;
    @FromScript(source = "VARGEN")
    public static Liquid auxTor;
    @FromScript(source = "VARGEN")
    public static Liquid auxRpm;


    /* <-------------------- util --------------------> */


    /**
     * <code>checkTemplate(ct, tempName)</code>.
     */
    public static boolean checkTemplate(UnlockableContent ct, String tempName) {
        NativeObject scope = LCScript.toObject(LCScript.get("__javaInternal__"));
        scope.put("LCScriptUtil.checkTemplate.ct", scope, ct);
        scope.put("LCScriptUtil.checkTemplate.tempName", scope, tempName);

        return (boolean) Context.getContext().evaluateString(
            Vars.mods.getScripts().scope,
            "checkCreatedByTemp(__javaInternal__['LCScriptUtil.checkTemplate.ct'], __javaInternal__['LCScriptUtil.checkTemplate.tempName'])",
            "LCScriptUtil_checkTemplate.js",
            0
        );
    };


    /**
     * <code>syncChance(name, trueChance)</code>.
     */
    public static boolean syncChance(String name, float trueChance) {
        NativeObject scope = LCScript.toObject(LCScript.get("__javaInternal__"));
        scope.put("LCScriptUtil.syncChance.name", scope, name);
        scope.put("LCScriptUtil.syncChance.trueChance", scope, trueChance);

        return (boolean) Context.getContext().evaluateString(
            Vars.mods.getScripts().scope,
            "syncChance(__javaInternal__['LCScriptUtil.syncChance.name'], __javaInternal__['LCScriptUtil.syncChance.trueChance'])",
            "LCScriptUtil_syncChance.js",
            0
        );
    };


    /**
     * <code>syncChanceDelta(name, trueChance)</code>.
     */
    public static boolean syncChanceDelta(String name, float trueChance) {
        NativeObject scope = LCScript.toObject(LCScript.get("__javaInternal__"));
        scope.put("LCScriptUtil.syncChanceDelta.name", scope, name);
        scope.put("LCScriptUtil.syncChanceDelta.trueChance", scope, trueChance);

        return (boolean) Context.getContext().evaluateString(
                Vars.mods.getScripts().scope,
                "syncChanceDelta(__javaInternal__['LCScriptUtil.syncChanceDelta.name'], __javaInternal__['LCScriptUtil.syncChanceDelta.trueChance'])",
                "LCScriptUtil_syncChanceDelta.js",
                0
        );
    };


    /* <-------------------- PARAM --------------------> */


    /**
     * Gets a condition in <code>PARAM</code>.
     */
    @SuppressWarnings("ConstantConditions")
    public static boolean getParamCond(String name) {
        return (boolean) LCScript.get(name, PARAM);
    };


    /**
     * Gets a number in <code>PARAM</code>.
     */
    public static float getParamNum(String name) {
        return LCScript.toFloat(LCScript.get(name, PARAM));
    };


    /**
     * Gets a string in <code>PARAM</code>.
     */
    public static String getParamStr(String name) {
        return LCScript.toString(LCScript.get(name, PARAM));
    };


    /* <-------------------- TIMER --------------------> */


    /**
     * Gets timer state in <code>TIMER</code>.
     */
    @SuppressWarnings("ConstantConditions")
    public static boolean checkTimer(String name) {
        return (boolean) LCScript.get(name, TIMER);
    };


    /* <-------------------- PARAM --------------------> */


    /**
     * Fires a trigger defined in <code>TRIGGER</code>.
     * The first argument should be trigger name.
     */
    public static void fireTrigger(Object... args) {
        LCScript.invoke("fire", TRIGGER, args);
    };


    /* <-------------------- MDL_cond --------------------> */


    /**
     * Applies condition check base off <code>MDL_cond</code>.
     */
    public static boolean checkCond(String nameFun, Object... args) {
        return (boolean) LCScript.invoke(nameFun, MDL_cond, args);
    };


    /* <-------------------- MDL_reaction --------------------> */


    /**
     * Simply calls <code>MDL_reaction.handleReaction</code>.
     */
    public static void handleReaction(Object reac1, Object reac2, float pMtp, Object t0e) {
        LCScript.invoke("handleReaction", MDL_reaction, LCScript.wrap(reac1), LCScript.wrap(reac2), pMtp, LCScript.wrap(t0e));
    };
    // Overload
    public static void handleReaction(Object reac1, Object reac2, float pMtp) {
        handleReaction(reac1, reac2, pMtp, null);
    };


    /* <-------------------- MDL_recipeDict --------------------> */


    /**
     * Gets consumption amount from recipe dictionary.
     */
    public static float getConsAmt(String ctName, String blkName) {
        return LCScript.toFloat(LCScript.invoke("getConsAmt", MDL_recipeDict, ctName, blkName));
    };
    // Overload
    public static float getConsAmt(String ctName, Building b) {
        return LCScript.toFloat(LCScript.invoke("getConsAmtByBuild", MDL_recipeDict, ctName, b));
    };


    /**
     * Gets production amount from recipe dictionary.
     */
    public static float getProdAmt(String ctName, String blkName) {
        return LCScript.toFloat(LCScript.invoke("getProdAmt", MDL_recipeDict, ctName, blkName));
    };
    // Overload
    public static float getProdAmt(String ctName, Building b) {
        return LCScript.toFloat(LCScript.invoke("getProdAmtByBuild", MDL_recipeDict, ctName, b));
    };


};
