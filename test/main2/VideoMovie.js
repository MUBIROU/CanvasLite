/***********************************************
 * VideoMovie Class (ver.2017-12-XXTXX:XX)
 * 
 *  <constructor>
 *      new VideoMovie(_canvas)
 * 
 *  <public method>
 *      VideoMovie.addEventListener(_event, _function)   "end"
 *      VideoMovie.start()
 * 
 *  <public property>
 *      Video.interval
 *      
 *  <event>
 *      VideoMovie.END
 *
***********************************************/

class VideoMovie {
    static get END() { return "end"; }
    
    constructor(_canvas) {
        this.__canvas = _canvas;
        this.__endHandler = undefined;

        var _fadeInTime = 2000; //2000; //最初のフェードインに使う時間（ミリ秒）
        var _crossfadeTime = 2000; //クロスフェードに使う時間（ミリ秒）
        var _fadeOutTime = 2000; //最後のフェードアウトに使う時間（ミリ秒）
        this.__showTime = 10000; //写真を見せる時間（ミリ秒）

        //内部計算処理
        this.__fadeInMillTime = 17/_fadeInTime;
        this.__crossfadeMillTime = 17/_crossfadeTime;
        this.__fadeOutMillTime = 17/_fadeOutTime;

        this.__videoList = [
            "fuji1.mp4","fuji2.mp4","fuji3.mp4","fuji4.mp4","fuji5.mp4",
            "fuji6.mp4","fuji7.mp4","fuji8.mp4","fuji9.mp4","fuji10.mp4"
        ]
        //console.log(this.__videoList.length); //10

        this.__count = 0;

        this.__nextVideo = undefined;
        this.__oldVideo = undefined;
        this.__currentVideo = undefined;
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
        //currentVideo
        this.__currentVideo = new toile.Video("mp4/" + this.__videoList[this.__count], 1360, 768);
        this.__currentVideo.stop();
        this.__currentVideo.alpha = 0;
        this.__currentVideo.name = this.__videoList[this.__count];
        this.__firstLoadVideoTimerID = setInterval(this.__firstLoadVideoTimer, 50, this);

        //nextVideo
        this.__count += 1;
        if (this.__videoList.length <= this.__count) {
            this.__count = 0;
        }
        this.__nextVideo = new toile.Video("mp4/" + this.__videoList[this.__count], 1360, 768);
        this.__nextVideo.stop();
        this.__nextVideo.alpha = 0;
        this.__nextVideo.name = this.__videoList[this.__count];
    }

    __firstLoadVideoTimer(_this) {
        if (_this.__currentVideo.duration != NaN) {
            clearInterval(_this.__firstLoadVideoTimerID);

            //currentVideo
            _this.__currentVideo.play();
            _this.__canvas.addChild(_this.__currentVideo);
            _this.__canvas.setDepthIndex(_this.__currentVideo, 0);

            //nextVideo
            //_this.__nextVideo.play();
            _this.__canvas.addChild(_this.__nextVideo);
            _this.__canvas.setDepthIndex(_this.__nextVideo, 0);

            //最初のフェードイン
            _this.__firstFadeInLoopID = setInterval(_this.__firstFadeInLoop, 17, _this);
            //_this.__firstFadeInLoop(_this);
        }
    }

    __firstFadeInLoop(_this) { //this == Window
        //console.log(_this.__currentVideo.alpha);
        if (_this.__currentVideo.alpha < 1) {
            _this.__currentVideo.alpha += _this.__fadeInMillTime;
        } else {
            clearInterval(_this.__firstFadeInLoopID);
            _this.__currentVideo.alpha = 1;
            
            //xxxミリ秒見せる
            _this.__showEndID = setTimeout(_this.__showEnd, _this.__showTime, _this); //__showTimeミリ秒見せる
        }
    }

    __showEnd(_this) {
        clearTimeout(_this.__showEndID);
        _this.__crossfadeID = setInterval(_this.__crossfade, 17, _this);

        _this.__oldVideo = _this.__currentVideo;
        _this.__newVideo = _this.__nextVideo;

        //console.log("OLD: " + _this.__oldVideo.name);
        //console.log("NEW: " + _this.__newVideo.name);

        _this.__newVideo.play();
    }

    __crossfade(_this) {
        //console.log("__crossfade")
        if (0 < _this.__oldVideo.alpha) {
            _this.__oldVideo.alpha -= _this.__crossfadeMillTime;
            _this.__newVideo.alpha += _this.__crossfadeMillTime;
        } else {
            clearInterval(_this.__crossfadeID);
            _this.__canvas.deleteChild(_this.__oldVideo); //.alpha = 0;
            _this.__newVideo.alpha = 1;
            _this.__currentVideo = _this.__newVideo;

            //nextVideo
            _this.__count += 1;
            if (_this.__videoList.length <= _this.__count) {
                _this.__count = 0;
            }
            _this.__nextVideo = new toile.Video("mp4/" + _this.__videoList[_this.__count], 1360, 768);
            _this.__nextVideo.stop();
            _this.__nextVideo.alpha = 0;
            _this.__nextVideo.name = _this.__videoList[_this.__count];
            _this.__canvas.addChild(_this.__newVideo);
            _this.__canvas.setDepthIndex(_this.__nextVideo, 0);

            //xxxミリ秒見せる
            _this.__showEndID = setTimeout(_this.__showEnd, _this.__showTime, _this); //__showTimeミリ秒見せる
        }
    }

    end() {
        if (this.__firstFadeInLoopID != undefined) clearInterval(this.__firstFadeInLoopID);
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

    __fadeOutLoop(_this) { //this == Window 
        if (0 < _this.__currentVideo.alpha) {
            _this.__currentVideo.alpha -= _this.__fadeInMillTime;
            if (_this.__newVideo != undefined) {
                _this.__newVideo.alpha -= _this.__fadeInMillTime;
            }
            if (_this.__nextVideo != undefined) {
                _this.__nextVideo.alpha -= _this.__fadeInMillTime;
            }
        } else {
            clearInterval(_this.__fadeOutLoopID);
            _this.__currentVideo.alpha = 0;
            _this.__endHandler(_this); //"end"イベントの発生
        }
    }
}