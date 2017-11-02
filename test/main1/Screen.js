/***********************************************
 * Screen Class (ver.2017-10-30TXX:XX)
 * 
 *  <constructor>
 *      new SpriteSheetPlus(_path, _isAnimate=false, _rectFillColor="255,255,255", _rectLineColor="0,0,0", _rectLineWidth=4)
 * 
 *  <public method>
 *      SpriteSheetPlus.in(_sec=1)
 *      SpriteSheetPlus.out(_sec=1)
 *
 *  <event>
 *      SpriteSheetPlus.DELETE
 * 
***********************************************/

class Screen {
    static get CLOSE() { return "close"; }

    constructor(_canvas, _bitmap, _size="standard") {
        this.__canvas = _canvas;
        this.__bitmap = _bitmap;
        this.__size = _size; //"standard" or "wide"
        this.__closeHandler = undefined;
    }

    //=======================================
    // (2) ユーザによるイベントリスナーの定義
    //=======================================
    addEventListener(_event, _function) {
        if (_event == "close") {
            this.__closeHandler = _function;
        }
    }

    //======================
    // Screen.open()メソッド
    //======================
    open() {
        //Smallビデオのロード開始
        let _videoName = this.__bitmap.name;
        if (this.__size == "standard") {
            this.__smallVideo = new toile.Video("mp4/" + _videoName + "_small.mp4", 480, 360);
        } else { //"wide"
            this.__smallVideo = new toile.Video("mp4/" + _videoName + "_small.mp4", 640, 360);
        }
        this.__smallVideo.stop();
        //console.log(this.__smallVideo.autoPlay);

        //背景を暗転
        this.__bg = new toile.Rect(0, 0, this.__canvas.width, this.__canvas.height);
        this.__bg.isFill(true);
        this.__bg.fillColor = "0,0,0";
        this.__bg.lineColor = "0,0,0";
        this.__bg.alpha = 0.7; //0.7; //0.85;
        this.__canvas.addChild(this.__bg);

        //ボタンと同じサイズのスクリーンを表示
        this.__screen = new toile.Rect(this.__bitmap.x, this.__bitmap.y, this.__bitmap.x+140, this.__bitmap.y+200);
        this.__screen.isFill(true);
        this.__screen.fillColor = "254,254,254";
        this.__screen.lineWidth = 2;
        this.__screen.lineColor = "204,204,204";
        this.__screen.alpha = 0.5;
        this.__canvas.addChild(this.__screen);

        //スクリーンが拡大するアニメーションの開始
        var _sec = 2;
        this.__loopCount = 0;

        this.__timeOut1ID = setTimeout(this.__timeOut1, 700, this); //少し遅らせてScreenを拡大

        if (this.__size == "standard") {
            this.__disStartX = 440 - this.__screen.startX;
            this.__disStartY = 204 - this.__screen.startY;
            this.__disEndX = 920 - this.__screen.endX;
            this.__disEndY = 564 - this.__screen.endY;
        } else { //"wide"
            this.__disStartX = 360 - this.__screen.startX;
            this.__disStartY = 204 - this.__screen.startY;
            this.__disEndX = 1000 - this.__screen.endX;
            this.__disEndY = 564 - this.__screen.endY;
        }
        this.__originStartX = this.__screen.startX;
        this.__originStartY = this.__screen.startY;
        this.__originEndX = this.__screen.endX;
        this.__originEndY = this.__screen.endY;

        // //_hoge = new toile.Rect(440,204,920,564); //4:3 small
        // //_hoge = new toile.Rect(360,204,1000,564); //16:9 small
        // //_hoge = new toile.Rect(200,24,1160,744); //4:3 Big
        // //_hoge = new toile.Rect(40,24,1320,744); //16:9 Big
    }

    __timeOut1(_this) {
        clearTimeout(_this.__timeOut1ID);
        _this.__sreenInLoop1ID = setInterval(_this.__sreenInLoop1, 17, _this); //≒58.8fps
    }

    __sreenInLoop1(_this) {//Rect.startX, Rect.startY用
        console.log(_this.__smallVideo.currentTime); //DEBUG

        _this.__loopCount += 0.03; //値が大きいほど高速
        let _sin = Math.sin(_this.__loopCount);

        if (_sin < 0.998) {
            _this.__screen.startX = _this.__originStartX + _this.__disStartX * _sin;
            _this.__screen.startY = _this.__originStartY + _this.__disStartY * _sin;
            _this.__screen.endX = _this.__originEndX + _this.__disEndX * _sin;
            _this.__screen.endY = _this.__originEndY + _this.__disEndY * _sin;
        } else {
            _this.__screen.startX = 440;
            _this.__screen.startY = 204;
            _this.__screen.endX = 920;
            _this.__screen.endY = 564;

            clearInterval(_this.__sreenInLoop1ID);
            _this.__sreenInLoop1ID = undefined;

            //第二スクリーン登場
            _this.__screen2 = new toile.Rect(_this.__screen.x, _this.__screen.y, _this.__screen.endX, _this.__screen.startY);
            _this.__screen2.isFill(true);
            _this.__screen2.fillColor = "254,254,254";
            _this.__screen2.lineWidth = 2;
            _this.__screen2.lineColor = "204,204,204";
            _this.__screen2.alpha = 0;
            _this.__canvas.addChild(_this.__screen2);
            _this.__timeOut2ID = setTimeout(_this.__timeOut2, 350, _this); //少し遅らせて第二スクリーンを下ろす
        }
    }

    __timeOut2(_this) {
        clearTimeout(_this.__timeOut2ID);
        _this.__timeOut2ID = undefined;

        _this.__sreenInLoop2(_this);
        _this.__sreenInLoop2ID = setInterval(_this.__sreenInLoop2, 17, _this); //≒58.8fps
        _this.__loopCount = - Math.PI/2;
        _this.__screen2.alpha = 0.6;
    }

    __sreenInLoop2(_this) { //Rect.endX, Rect.endY用
        console.log(_this.__smallVideo.currentTime); //DEBUG
        
        _this.__loopCount += 0.04; //値が大きいほど高速
        let _sin = (Math.sin(_this.__loopCount) + 1)/2; //イーズイン＆イーズアウト（POINT）

        if (_sin < 0.998) {
            _this.__screen2.endY = _this.__screen.startY + 360 * _sin;
            _this.__bg.alpha += 0.002;
        } else {
            _this.__screen2.endY = _this.__screen.startY + 360;
            clearInterval(_this.__sreenInLoop2ID);
            _this.__sreenInLoop2ID = undefined;

            //映像再生
            _this.__canvas.addChild(_this.__smallVideo);
            _this.__smallVideo.x = _this.__screen2.x;
            _this.__smallVideo.y = _this.__screen2.y;
            _this.__smallVideo.play();
        }
    }
}