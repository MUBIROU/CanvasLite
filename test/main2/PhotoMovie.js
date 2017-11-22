/***********************************************
 * PhotoMovie Class (ver.2017-11-XXTXX:XX)
 * 
 *  <constructor>
 *      new PhotoMovie(_canvas)
 * 
 *  <public method>
 *      PhotoMovie.addEventListener(_event, _function)   "in" or "out"
 *      ScoreLine.in()
 *      ScoreLine.out()
 *      
 *  <event>
 *      ScoreLine.IN
 *      ScoreLine.OUT
 *
***********************************************/

class PhotoMovie {
    //static get IN() { return "in"; }
    
    constructor(_canvas) {
        this.__canvas = _canvas;

        this.__photoList = [
            "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg",
            "8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg",
            "15.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.jpg","21.jpg",
            "22.jpg","23.jpg","24.jpg","25.jpg","26.jpg","27.jpg","28.jpg"
        ]
        //console.log(this.__photoList.length); //28

        this.__interval = undefined;

        this.__currentPhoto = new toile.Bitmap("jpg/" + this.__photoList[1]);
        this.__canvas.addChild(this.__currentPhoto);
    }

    //パブリックメソッド
    start(_millsec = 1000) {
        this.__interval = _millsec;
        this.__photoLoopID = setInterval(this.__photoLoop, this.__interval, this);
    }

    //パブリックプロパティ
    get interval() {
        return this.__interval;
    }
    set interval(newValue) {
        this.__interval = newValue;
    }

    //プライベートメソッド
    __photoLoop(_this) { //this == Window
        console.log(_this);
    }

}