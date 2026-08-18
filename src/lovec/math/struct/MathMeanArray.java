package lovec.math.struct;

import lovec.utils.LCScript;
import lovec.utils.extend.LCNativeArray;
import rhino.NativeArray;

/**
 * Used to calculate mean value.
 */
public class MathMeanArray {


    protected int cap;
    protected NativeArray dataArr;
    protected float mean = 0f;


    public MathMeanArray(int cap) {
        this.cap = cap;
        dataArr = LCScript.newArray("MathMeanArray#newArr");
    };


    /*
      ========================================
      Section: Definition (Static)
      ========================================
    */


    /*
      ========================================
      Section: Definition (Instance)
      ========================================
    */


    /* <-------------------- property --------------------> */


    /**
     * Gets mean value.
     */
    public float getMean() {
        return mean;
    };


    /**
     * Gets the data array.
     */
    public NativeArray getData() {
        return dataArr;
    };


    /* <-------------------- modification --------------------> */


    /**
     * Adds a new number.
     * @return Data length.
     */
    public long push(float num) {
        if(cap <= 0) return 0;
        while(dataArr.getLength() >= cap) {
            LCNativeArray.shift(dataArr);
        };
        LCNativeArray.push(dataArr, num);
        mean = LCScript.toFloat(LCNativeArray.mean(dataArr));
        return dataArr.getLength();
    };


    /**
     * Clears all stored numbers.
     */
    public MathMeanArray clear() {
        LCNativeArray.clear(dataArr);
        mean = 0f;
        return this;
    };


    /* <-------------------- util --------------------> */


    @Override
    public String toString() {
        return dataArr.toString();
    };


};
