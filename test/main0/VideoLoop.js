class VideoLoop {        
    constructor(_canvas) {
        this.__canvas = _canvas;

        var _fadeInTime = 2000; //2000; //最初のフェードインに使う時間（ミリ秒）
        var _crossfadeTime = 5000; //クロスフェードに使う時間（ミリ秒）
        var _fadeOutTime = 11000; //最後のフェードアウトに使う時間（ミリ秒）
        this.__showTime = 7000; //写真を見せる時間（ミリ秒）

        //内部計算処理
        this.__fadeInMillTime = 17/_fadeInTime;
        this.__crossfadeMillTime = 17/_crossfadeTime;
        this.__fadeOutMillTime = 17/_fadeOutTime;

        this.__count = 0;

        //Video11
        this.__video1 = new toile.Video("../common/bgVideo.mp4", 1360, 768);
        this.__video1.stop();
        this.__video1.alpha = 0;
        this.__currentVideo = this.__video1;

        //Video2
        this.__video2 = new toile.Video("../common/bgVideo.mp4", 1360, 768);
        this.__video2.stop();
        this.__video2.alpha = 0;
        this.__nextVideo = this.__video2;

        this.__firstLoadVideoTimerID = setInterval(this.__firstLoadVideoTimer, 50, this);
    }

    //=====================================================
    // 最初のフェードイン
    //=====================================================
    __firstLoadVideoTimer(_this) {
        if (_this.__video1.duration != NaN) {
            clearInterval(_this.__firstLoadVideoTimerID);

            //Video1
            _this.__video1.play();
            _this.__canvas.addChild(_this.__video1);
            _this.__canvas.setDepthIndex(_this.__video1, 0);

            //nextVideo
            _this.__canvas.addChild(_this.__video2);
            _this.__canvas.setDepthIndex(_this.__video2, 0);

            //最初のフェードイン
            _this.__firstFadeInLoopID = setInterval(_this.__firstFadeInLoop, 17, _this);
        }
    }

    __firstFadeInLoop(_this) { //this == Window
        if (_this.__video1.alpha < 0.4) {
            _this.__video1.alpha += _this.__fadeInMillTime;
        } else {
            clearInterval(_this.__firstFadeInLoopID);
            _this.__video1.alpha = 0.4;
            
            //xxxミリ秒見せる
            _this.__showEndID = setTimeout(_this.__showEnd, _this.__showTime, _this); //__showTimeミリ秒見せる
        }
    }

    //==================================================
    // ミリ秒見せたら...
    //==================================================
    __showEnd(_this) {
        clearTimeout(_this.__showEndID);
        _this.__crossfadeID = setInterval(_this.__crossfade, 17, _this);
        _this.__nextVideo.play();
    }

    //==================================================
    // クロスフェード
    //==================================================
    __crossfade(_this) {
        //console.log(_this.__currentVideo.alpha, _this.__nextVideo.alpha)

        if (0 < _this.__currentVideo.alpha) {
            _this.__currentVideo.alpha -= _this.__crossfadeMillTime;
            _this.__nextVideo.alpha += _this.__crossfadeMillTime;
        } else {
            clearInterval(_this.__crossfadeID);
            _this.__currentVideo.alpha = 0;
            _this.__currentVideo.stop();
            _this.__nextVideo.alpha = 0.4;
            
            if (_this.__currentVideo == _this.__video1) {
                _this.__currentVideo = _this.__video2;
                _this.__nextVideo = _this.__video1;
            } else if (_this.__currentVideo == _this.__video2) {
                _this.__currentVideo = _this.__video1;
                _this.__nextVideo = _this.__video2;
            }

            //xxxミリ秒見せる
            _this.__showEndID = setTimeout(_this.__showEnd, _this.__showTime, _this); //__showTimeミリ秒見せる
        }
    }

    end() {
        //console.log("VideoLoop.end()")
        if (this.__firstFadeInLoopID != undefined) clearInterval(this.__firstFadeInLoopID);
        if (this.__crossfadeID != undefined) clearInterval(this.__crossfadeID);
        if (this.__showEndID != undefined) clearInterval(this.__showEnd);
    
        this.__fadeOutLoopID = setInterval(this.__fadeOutLoop, 17, this);
    }

    __fadeOutLoop(_this) { //this == Window 
        if (0 < _this.__currentVideo.alpha) {
            _this.__currentVideo.alpha -= _this.__fadeOutMillTime;
            _this.__nextVideo.alpha -= 0.05;
        } else {
            clearInterval(_this.__fadeOutLoopID);
            _this.__video1.alpha = 0;
            _this.__video2.alpha = 0;
            _this.__canvas.deleteChild(_this.__video1);
            _this.__canvas.deleteChild(_this.__video2);
        }
    }
}