package lovec.math.struct;

import lovec.utils.SLCScript;
import lovec.utils.extend.SLCNativeArray;
import rhino.NativeArray;

/**
 * Used to calculate mean value.
 */
public class LCMeanArray {


    protected int cap;
    protected NativeArray dataArr;
    protected float mean = 0f;


    public LCMeanArray(int cap) {
        this.cap = cap;
        dataArr = SLCScript.newArray("LCMeanArray#newArr");
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


    /* <------------------------------ property ------------------------------> */


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


    /* <------------------------------ modification ------------------------------> */


    /**
     * Adds a new number.
     * @return Data length.
     */
    public long push(float num) {
        if(cap <= 0) return 0;
        while(dataArr.getLength() >= cap) {
            SLCNativeArray.shift(dataArr);
        };
        SLCNativeArray.push(dataArr, num);
        mean = SLCScript.toFloat(SLCNativeArray.mean(dataArr));
        return dataArr.getLength();
    };


    /**
     * Clears all stored numbers.
     */
    public LCMeanArray clear() {
        SLCNativeArray.clear(dataArr);
        mean = 0f;
        return this;
    };


    /* <------------------------------ util ------------------------------> */


    @Override
    public String toString() {
        return dataArr.toString();
    };


};
