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
    static get END() { return "end"; }
    
    constructor(_canvas) {
        this.__canvas = _canvas;
        this.__endHandler = undefined;

        var _fadeInTime = 2000; //最初のフェードインに使う時間（ミリ秒）
        var _crossfadeTime = 5000; //クロスフェードに使う時間（ミリ秒）
        var _fadeOutTime = 2000; //最後のフェードアウトに使う時間（ミリ秒）
        this.__showTime = 5000; //写真を見せる時間（ミリ秒）

        //内部計算処理
        this.__fadeInMillTime = 17/_fadeInTime;
        this.__crossfadeMillTime = 17/_crossfadeTime;
        this.__fadeOutMillTime = 17/_fadeOutTime;

        this.__photoList = [
            "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg",
            "8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg",
            "15.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.jpg","21.jpg",
            "22.jpg","23.jpg","24.jpg","25.jpg","26.jpg","27.jpg","28.jpg"
        ]
        //console.log(this.__photoList.length); //28

        this.__count = 0;

        this.__currentPhoto = this.__createPhoto(this.__count);
        this.__nextPhoto = undefined;
    }

    //パブリックメソッド
    addEventListener(_event, _function) {
        if (_event == "end") {
            this.__endHandler = _function;
        } else {
            throw new Error(_event + " は対応していません");
        }
    }

    start() {
        this.__fadeInLoopID = setInterval(this.__fadeInLoop, 17, this);
    }

    end() {
        if (this.__fadeInLoopID != undefined) clearInterval(this.__fadeInLoopID);
        if (this.__crossfadeID != undefined) clearInterval(this.__crossfadeID);
        if (this.__showEndID != undefined) clearInterval(this.__showEnd);
        this.__fadeOutLoopID = setInterval(this.__fadeOutLoop, 17, this);
    }

    //パブリックプロパティ
    get interval() {
        return this.__showTime;
    }
    set interval(newValue) {
        this.__showTime = newValue;
    }

    //プライベートメソッド
    __createPhoto(_num) {
        let _photo = new toile.Bitmap("jpg/" + this.__photoList[_num]);
        _photo.alpha = 0;
        _photo.name = this.__photoList[_num];
        _canvas.addChild(_photo);
        _canvas.setDepthIndex(_photo, 0);
        return _photo;
    }

    __fadeInLoop(_this) { //this == Window
        if (_this.__currentPhoto.alpha < 1) {
            _this.__currentPhoto.alpha += _this.__fadeInMillTime;
        } else {
            clearInterval(_this.__fadeInLoopID);
            _this.__currentPhoto.alpha = 1;
            
            //xxxミリ秒見せる
            _this.__showEndID = setTimeout(_this.__showEnd, _this.__showTime, _this); //__showTimeミリ秒見せる
        }
    }

    __showEnd(_this) {
        clearTimeout(_this.__showEndID);
        _this.__crossfadeID = setInterval(_this.__crossfade, 17, _this);
        
        _this.__nextPhoto = _this.__createPhoto(++ _this.__count);
    }

    __crossfade(_this) {
        //console.log("__crossfade")
        if (0 < _this.__currentPhoto.alpha) {
            _this.__currentPhoto.alpha -= _this.__crossfadeMillTime;
            _this.__nextPhoto.alpha += _this.__crossfadeMillTime;
        } else {
            clearInterval(_this.__crossfadeID);
            _this.__nextPhoto.alpha = 1;
            _this.__currentPhoto = _this.__nextPhoto;

            //xxxミリ秒見せる
            _this.__showEndID = setTimeout(_this.__showEnd, _this.__showTime, _this); //__showTimeミリ秒見せる
        }
    }

    __fadeOutLoop(_this) { //this == Window
        if (0 < _this.__currentPhoto.alpha) {
            _this.__currentPhoto.alpha -= _this.__fadeInMillTime;
        } else {
            clearInterval(_this.__fadeOutLoopID);
            _this.__currentPhoto.alpha = 0;
            _this.__endHandler(_this); //"end"イベントの発生
        }
    }
}