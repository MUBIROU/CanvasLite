/***********************************************
 * Screen Class (ver.2017-10-30TXX:XX)
 * 
 *  <constructor>
 *      new Screen()
 * 
 *  <public method>
 *      Screen.addEventListener("close", _function)
 *      Screen.open()
 *
 *  <event>
 *      Screen.CLOSE
 * 
***********************************************/

class Screen {
    static get CLOSE() { return "close"; }

    constructor(_canvas, _bitmap, _size="standard") { //or "wide"
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

        //背景を暗転
        this.__bg = new toile.Rect(0, 0, this.__canvas.width, this.__canvas.height);
        this.__bg.isFill(true);
        this.__bg.fillColor = "0,0,0";
        this.__bg.lineColor = "0,0,0";
        this.__bg.alpha = 0.7;
        this.__canvas.addChild(this.__bg);

        //作品ボタンと同じサイズのスクリーンを表示
        this.__screen1 = new toile.Rect(this.__bitmap.x, this.__bitmap.y, this.__bitmap.x+140, this.__bitmap.y+200);
        this.__screen1.isFill(true);
        this.__screen1.fillColor = "254,254,254";
        this.__screen1.lineWidth = 2;
        this.__screen1.lineColor = "204,204,204";
        this.__screen1.alpha = 0.5;
        this.__canvas.addChild(this.__screen1);

        //スクリーンが拡大するアニメーションの開始
        var _sec = 2;
        this.__loopCount = 0;

        this.__timeOut1ID = setTimeout(this.__timeOut1, 700, this); //少し遅らせてScreenを拡大

        if (this.__size == "standard") {
            this.__disStartX = 440 - this.__screen1.startX;
            this.__disStartY = (204 - 12) - this.__screen1.startY;
            this.__disEndX = 920 - this.__screen1.endX;
            this.__disEndY = (564 - 12) - this.__screen1.endY;
        } else { //"wide"
            this.__disStartX = 360 - this.__screen1.startX;
            this.__disStartY = (204 - 12) - this.__screen1.startY;
            this.__disEndX = 1000 - this.__screen1.endX;
            this.__disEndY = (564 - 12) - this.__screen1.endY;
        }
        this.__originStartX = this.__screen1.startX;
        this.__originStartY = this.__screen1.startY;
        this.__originEndX = this.__screen1.endX;
        this.__originEndY = this.__screen1.endY;
    }

    //================================================
    // 作品ボタンをタッチ（TouchEnd）して0.7秒後の処理
    //================================================
    __timeOut1(_this) {
        clearTimeout(_this.__timeOut1ID);
        _this.__sreenInLoop1ID = setInterval(_this.__sreenInLoop1, 17, _this); //≒58.8fps
    }

    //=======================================================================
    // スクリーンを640x360（Wide）か480x360（Standard）のサイズに拡大していく
    //=======================================================================
    __sreenInLoop1(_this) {
        _this.__loopCount += 0.03; //値が大きいほど高速
        let _sin = Math.sin(_this.__loopCount);

        if (_sin < 0.998) {
            _this.__screen1.startX = _this.__originStartX + _this.__disStartX * _sin;
            _this.__screen1.startY = _this.__originStartY + _this.__disStartY * _sin;
            _this.__screen1.endX = _this.__originEndX + _this.__disEndX * _sin;
            _this.__screen1.endY = _this.__originEndY + _this.__disEndY * _sin;
        } else {

            if (_this.__size == "standard") {
                _this.__screen1.startX = 440;
                _this.__screen1.startY = 204 - 12;
                _this.__screen1.endX = 920;
                _this.__screen1.endY = 564 - 12;
            } else { //"wide"}
                _this.__screen1.startX = 360;
                _this.__screen1.startY = 204 - 12;
                _this.__screen1.endX = 1000;
                _this.__screen1.endY = 564 - 12;
            }

            clearInterval(_this.__sreenInLoop1ID);
            _this.__sreenInLoop1ID = undefined;

            //第二スクリーン登場準備
            _this.__screen2 = new toile.Rect(_this.__screen1.x, _this.__screen1.y, _this.__screen1.endX, _this.__screen1.startY);
            _this.__screen2.isFill(true);
            _this.__screen2.fillColor = "254,254,254";
            _this.__screen2.lineWidth = 2;
            _this.__screen2.lineColor = "204,204,204";
            _this.__screen2.alpha = 0;
            _this.__canvas.addChild(_this.__screen2);

            //少し遅らせて第二スクリーンを下ろす
            _this.__timeOut2ID = setTimeout(_this.__timeOut2, 350, _this);
        }
    }

    //===========================================================
    // スクリーンが640x360または480x360になってから0.35秒後の処理
    //===========================================================
    __timeOut2(_this) {
        clearTimeout(_this.__timeOut2ID);
        _this.__timeOut2ID = undefined;

        //第二スクリーンを上から下ろしていくための処理
        _this.__sreenInLoop2ID = setInterval(_this.__sreenInLoop2, 17, _this); //≒58.8fps
        _this.__loopCount = - Math.PI/2;
        _this.__screen2.alpha = 0.6;
    }

    //=======================================
    // 第二スクリーンを上から下ろしていく処理
    //=======================================
    __sreenInLoop2(_this) { //Rect.endX, Rect.endY用
        _this.__loopCount += 0.04; //値が大きいほど高速
        let _sin = (Math.sin(_this.__loopCount) + 1)/2; //イーズイン＆イーズアウト（POINT）

        if (_sin < 0.998) {
            _this.__screen2.endY = _this.__screen1.startY + 360 * _sin;
            _this.__bg.alpha += 0.002;
        } else {
            _this.__screen2.endY = _this.__screen1.startY + 360; //XXX_small.mp4の高さ（360px）
            
            clearInterval(_this.__sreenInLoop2ID);
            _this.__sreenInLoop2ID = undefined;

            //EXITボタンを表示するタイミング（映像のロード完了）を調べるための処理
            _this.__smallVideoLoadCheckLoopID = setInterval(_this.__smallVideoLoadCheckLoop, 200, _this); //=5fps

            //loadingアニメの表示までに少し待機（ロード済み映像の再生時は表示されないぐらい）
            _this.__loadingTimerID = setTimeout(_this.__loadingTimerID, 350, _this); //0でも意味あり
        }
    }

    //====================
    // loadingアニメの表示
    //====================
    __loadingTimerID(_this) {
        if (! _this.__smallVideo.isLoaded()) {
            //var _num = Math.floor(Math.random() * 4) + 1;
            //console.log(_num);
            //_this.__loading = new toile.SpriteSheet("../common/loading" + _num + ".png");
            _this.__loading = new toile.SpriteSheet("../common/loading.png");
            _this.__loading.fps = 15;
            _this.__loading.alpha = 0.8;
            _this.__loading.x = _this.__screen2.x + _this.__screen2.width / 2 - 24;
            _this.__loading.y = _this.__screen2.y + _this.__screen2.height / 2 - 24;
            _this.__canvas.addChild(_this.__loading);
        }
    }

    //============================================================
    // 小さい映像（XXX_small.mp4）がロードされたらEXITボタンを表示
    //============================================================
    __smallVideoLoadCheckLoop(_this) {
        if (_this.__smallVideo.isLoaded()) {
            _this.__canvas.deleteChild(_this.__loading); //loadingの削除

            clearInterval(_this.__smallVideoLoadCheckLoopID);
            _this.__smallVideoLoadCheckLoopID = undefined;

            //小さな映像再生
            _this.__canvas.addChild(_this.__smallVideo);
            _this.__smallVideo.x = _this.__screen2.x;
            _this.__smallVideo.y = _this.__screen2.y;
            _this.__smallVideo.play();

            //シークバーの表示
            _this.__seekBar = new SeekBar(
                _this.__canvas,
                _this.__smallVideo,
                _this.__smallVideo.x,
                _this.__smallVideo.y + 360 + 18,
                _this.__smallVideo.x + _this.__smallVideo.width,
                _this.__smallVideo.y + 360 + 18
            );

            //小映像を長時間再生すると大映像がメモリから消えるのを回避するための処理
            _this.__synchroLoopID = setInterval(_this.__synchroLoop, 5000, _this);

            //exitボタンの表示
            _this.__exitButton = new toile.Bitmap("exit.png");
            _this.__exitButton.__this = _this; //力技
            _this.__exitButton.addEventListener("mouseup", _this.mouseup_exitButton); //,true);
            _this.__exitButton.x = _this.__screen2.x + _this.__screen2.width - 48; //_this.__screen2.x;
            _this.__exitButton.y = _this.__screen2.y;
            _this.__canvas.addChild(_this.__exitButton);

            //大きな映像のロード開始
            let _videoName = _this.__bitmap.name;
            if (_this.__size == "standard") {
                _this.__bigVideo = new toile.Video("mp4/" + _videoName + ".mp4", 960, 720);
            } else { //"wide"
                _this.__bigVideo = new toile.Video("mp4/" + _videoName + ".mp4", 1280, 720);
            }
            _this.__bigVideo.stop();

            //拡大ボタンを表示するタイミング（大きな映像のロード完了）を調べるための処理
            _this.__bigVideoLoadCheckLoopID = setInterval(_this.__bigVideoLoadCheckLoop, 100, _this); //=10fps
        }
    }

    //小映像を長時間再生すると大映像がメモリから消えるのを回避するための処理
    __synchroLoop(_this) {
        _this.__bigVideo.currentTime = _this.__smallVideo.currentTime;
    }

    //======================================================
    // 大きな映像（XXX.mp4）がロードされたら拡大ボタンを表示
    //======================================================
    __bigVideoLoadCheckLoop(_this) {
        if (_this.__bigVideo.isLoaded()) {
            clearInterval(_this.__bigVideoLoadCheckLoopID);
            _this.__bigVideoLoadCheckLoopID = undefined;

            _this.__bigButtonFadeinLoopID = setInterval(_this.__bigButtonFadeinLoop, 50, _this); //≒20fps

            //拡大ボタンを表示
            _this.__bigButton = new toile.Bitmap("big.png");
            _this.__bigButton.__this = _this; //力技
            if (_this.__size == "standard") {
                var _theWidth = 480;
            } else { //"wide"
                _theWidth = 640;
            }
            _this.__bigButton.x = _this.__screen2.x + _theWidth - 48;
            _this.__bigButton.y = _this.__screen2.y + 360 - 48;
            _this.__bigButton.alpha = 0;
            _this.__canvas.addChild(_this.__bigButton);
        }
    }

    //=======================================
    // 拡大ボタンをフェードインで表示する処理
    //======================================
    __bigButtonFadeinLoop(_this) {
        if (_this.__bigButton.alpha < 1) {
            _this.__bigButton.alpha += 0.07;
        } else { //拡大ボタンが完全に表示されたら...
            clearInterval(_this.__bigButtonFadeinLoopID);
            _this.__bigButtonFadeinLoopID = undefined;
            _this.__bigButton.alpha = 1;
            _this.__bigButton.addEventListener("mouseup", _this.mouseup_bigButton); //, true);
        }
    }

    //================================================
    // EXIT（×）ボタンをタッチ（TouchEnd）した時の処理
    //================================================
    mouseup_exitButton(_bitmap) {
        var _this = _bitmap.__this; //力技

        //シークバーを消す
        _this.__seekBar.delete();
        _this.__seekBar = undefined;

        //小映像を長時間再生すると大映像がメモリから消えるのを回避するための処理
        clearInterval(_this.__synchroLoopID);
        _this.__synchroLoopID = undefined;
        
        _this.__canvas.deleteChild(_this.__smallVideo); //映像を消す
        _this.__smallVideo.stop(); //映像･音を止める
        _this.__smallVideo = undefined;

        _this.__canvas.deleteChild(_this.__bigButton); //拡大ボタンを消す
        _this.__canvas.deleteChild(_this.__exitButton); //exitボタンを消す

        //拡大ボタンを消す
        _this.__canvas.deleteChild(_this.__bigButton);
        if (_this.__bigVideoLoadCheckLoopID != undefined) {
            clearInterval(_this.__bigVideoLoadCheckLoopID);
            _this.__bigVideoLoadCheckLoopID = undefined;
        } 

        _this.__canvas.deleteChild(_this.__screen2); //スクリーン2は消す
        _this.__screen1.alpha = 0.8; //スクリーン1のアルファ値を0.5→0.8へ

        _this.__timeOut3ID = setTimeout(_this.__timeOut3, 350, _this); //少し遅らせて第二スクリーンを下ろす
    }

    //===========================================
    // 拡大ボタンをタッチ（TouchEnd）した時の処理
    //===========================================
    mouseup_bigButton(_bitmap) {
        var _this = _bitmap.__this; //力技

        //シークバーを消す
        _this.__seekBar.delete();
        _this.__seekBar = undefined;

        //小映像を長時間再生すると大映像がメモリから消えるのを回避するための処理
        clearInterval(_this.__synchroLoopID);
        _this.__synchroLoopID = undefined;

        _this.__canvas.deleteChild(_this.__exitButton); //exitボタンを消す
        _this.__canvas.deleteChild(_this.__bigButton); //拡大ボタンを消す

         //大きな映像の枠を作成
        _this.__screenBig = new toile.Rect(_this.__screen1.x, _this.__screen1.y, _this.__screen1.endX, _this.__screen1.endY);
        _this.__screenBig.lineWidth = 2;
        _this.__screenBig.lineColor = "204,204,204";
        _this.__screenBig.alpha = 0.8;
        _this.__canvas.addChild(_this.__screenBig);

        _this.__timeInBigScreenID = setTimeout(_this.__timeInBigScreen, 350, _this); //0.35秒遅らせて大画面用スクリーンを広げる
    }

    //=====================================================
    // 拡大ボタンをタッチ（TouchEnd）してから0.35秒後の処理
    //=====================================================
    __timeInBigScreen(_this) {
        clearTimeout(_this.__timeInBigScreenID);
        _this.__timeInBigScreenID = undefined;

        //大きな映像用のスクリーンを拡大していく処理開始
        _this.__sreenBigInLoopID = setInterval(_this.__sreenBigInLoop, 17, _this); //≒58.8fps
        _this.__loopCount = - Math.PI/2;
        //_this.__screen2.alpha = 0.6;

        if (_this.__size == "standard") {
            _this.__disStartX = 200 - _this.__screen1.startX;
            _this.__disStartY = (24 - 12) - _this.__screen1.startY;
            _this.__disEndX = 1160 - _this.__screen1.endX;
            _this.__disEndY = (744 - 12) - _this.__screen1.endY;
        } else { //"wide"
            _this.__disStartX = 40 - _this.__screen1.startX;
            _this.__disStartY = (24 - 12) - _this.__screen1.startY;
            _this.__disEndX = 1320 - _this.__screen1.endX;
            _this.__disEndY = (744 - 12) - _this.__screen1.endY;
        }
        _this.__originStartX = _this.__screen1.startX;
        _this.__originStartY = _this.__screen1.startY;
        _this.__originEndX = _this.__screen1.endX;
        _this.__originEndY = _this.__screen1.endY;

        //小さな映像を停止
        _this.__smallVideo.pause();
    }

    //========================================================================
    // スクリーンを1280x720（Wide）か960x720（Standard）のサイズに拡大していく
    //========================================================================
    __sreenBigInLoop(_this) {
        _this.__loopCount += 0.03; //値が大きいほど高速
        let _sin = Math.cos(_this.__loopCount);

        if (_sin < 0.998) {
            _this.__bg.alpha += 0.0037; //DEBUG
        
            _this.__screenBig.startX = _this.__originStartX + _this.__disStartX * _sin;
            _this.__screenBig.startY = _this.__originStartY + _this.__disStartY * _sin;
            _this.__screenBig.endX = _this.__originEndX + _this.__disEndX * _sin;
            _this.__screenBig.endY = _this.__originEndY + _this.__disEndY * _sin;

        } else {
            _this.__bg.alpha = 0.98; //背景を真っ黒にする
            //_this.__screenBig.lineColor = "96,96,96";

            if (_this.__size == "standard") {
                _this.__screenBig.startX = 200;
                _this.__screenBig.startY = 24 - 12;
                _this.__screenBig.endX = 1160;
                _this.__screenBig.endY = 744 - 12;
            } else { //"wide"}
                _this.__screenBig.startX = 40;
                _this.__screenBig.startY = 24 - 12;
                _this.__screenBig.endX = 1320;
                _this.__screenBig.endY = 744 - 12;
            }

            //===============================================
            //大きな映像再生（再生中の XXX.mp4 の情報を取得）
            //===============================================
            _this.__bigVideo.currentTime = _this.__smallVideo.currentTime;
            _this.__canvas.addChild(_this.__bigVideo);
            _this.__bigVideo.x = _this.__screenBig.startX;
            _this.__bigVideo.y = _this.__screenBig.startY;
            _this.__bigVideo.play();

            //シークバーの表示
            _this.__seekBar = new SeekBar(
                _this.__canvas,
                _this.__bigVideo,
                _this.__bigVideo.x,
                _this.__bigVideo.y + 720 + 18,
                _this.__bigVideo.x + _this.__bigVideo.width,
                _this.__bigVideo.y + 720 + 18
            );

            _this.__smallVideoUI(false); //小さな映像は見えなくしておく

            //exitボタンの表示
            _this.__exitButton2 = new toile.Bitmap("exit.png");
            _this.__exitButton2.__this = _this; //力技
            _this.__exitButton2.addEventListener("mouseup", _this.__mouseup__exitButton2);
            _this.__exitButton2.x = _this.__screenBig.x + _this.__screenBig.width - 48;
            _this.__exitButton2.y = _this.__screenBig.y;
            _this.__canvas.addChild(_this.__exitButton2);

            clearInterval(_this.__sreenBigInLoopID);
            _this.__sreenBigInLoopID = undefined;
        }
    }

    //==========================================================================
    // 大きな映像の再生時は 小さな映像を見えなくする（縮小時に見えてしまうので）
    //==========================================================================
    __smallVideoUI(_boolean) {
        if (_boolean) {
            this.__smallVideo.alpha = 1;
            this.__exitButton.alpha = 1;
            this.__bigButton.alpha = 1;
            this.__exitButton.addEventListener("mouseup", this.mouseup___exitButton);
            this.__bigButton.addEventListener("mouseup", this.mouseup_bigButton);
        } else {
            this.__smallVideo.alpha = 0;
            this.__exitButton.alpha = 0;
            this.__bigButton.alpha = 0;
            this.__exitButton.removeEventListener("mouseup");
            this.__bigButton.removeEventListener("mouseup");
            if (this.__screen1 != undefined) {
                this.__canvas.deleteChild(this.__screen1);
                this.__canvas.deleteChild(this.__screen2);
            }
        }
    }

    //==================================================================
    // 大きな映像再生時のEXIT（×）ボタンをタッチ（TouchEnd）した時の処理
    //==================================================================
    __mouseup__exitButton2(_bitmap) {
        var _this = _bitmap.__this; //力技

        //シークバーを消す
        _this.__seekBar.delete();
        _this.__seekBar = undefined;
        
        //カード（作品ボタン）に戻す枠
        _this.__bigvideoToCardRect = new toile.Rect(_this.__screenBig.x, _this.__screenBig.y, _this.__screenBig.endX, _this.__screenBig.endY);
        _this.__bigvideoToCardRect.lineWidth = 2;
        _this.__bigvideoToCardRect.lineColor = "204,204,204";
        _this.__bigvideoToCardRect.alpha = 0.8;
        _this.__canvas.addChild(_this.__bigvideoToCardRect);
        _this.__canvas.deleteChild(_this.__exitButton2);
        _this.__canvas.deleteChild(_this.__screenBig);
        _this.__exitButton2.removeEventListener("mouseup");

        //0.35秒遅らせて大画面用スクリーンを広げる
        _this.__bigToCardTimeOutID = setTimeout(_this.__timeInBigScreenTimeOut, 350, _this);
    
        _this.__disStartX = _this.__bitmap.x - _this.__bigvideoToCardRect.startX;
        _this.__disStartY = _this.__bitmap.y - _this.__bigvideoToCardRect.startY;
        _this.__disEndX = (_this.__bitmap.x + 140) - _this.__bigvideoToCardRect.endX;
        _this.__disEndY = (_this.__bitmap.y + 200) - _this.__bigvideoToCardRect.endY;

        _this.__originStartX = _this.__bigvideoToCardRect.startX;
        _this.__originStartY = _this.__bigvideoToCardRect.startY;
        _this.__originEndX = _this.__bigvideoToCardRect.endX;
        _this.__originEndY = _this.__bigvideoToCardRect.endY;

        _this.__bg.alpha = 0.95;
    }

    //======================================================
    // EXIT2ボタンをタッチ（TouchEnd）してから0.35秒後の処理
    //======================================================
    __timeInBigScreenTimeOut(_this) {
        _this.__bigVideo.stop();
        _this.__canvas.deleteChild(_this.__bigVideo);
        _this.__bigVideo = undefined;

        _this.__bigvideoToCardRectLoopID = setInterval(_this.__bigvideoToCardRectLoop, 17, _this); //≒58.8fps
        _this.__loopCount = - Math.PI/2;
    }

    //====================================================
    // EXIT2ボタンをタッチ後、作品ボタンへ縮小していく処理
    //====================================================
    __bigvideoToCardRectLoop(_this) {
        _this.__loopCount += 0.03; //値が大きいほど高速
        let _sin = Math.cos(_this.__loopCount); //-1 => 0 => 1（イーズイン・イーズアウト）

        if (_sin < 0.998) {
            _this.__bigvideoToCardRect.startX = _this.__originStartX + _this.__disStartX * _sin;
            _this.__bigvideoToCardRect.startY = _this.__originStartY + _this.__disStartY * _sin;
            _this.__bigvideoToCardRect.endX = _this.__originEndX + _this.__disEndX * _sin;
            _this.__bigvideoToCardRect.endY = _this.__originEndY + _this.__disEndY * _sin;
            _this.__bg.alpha -= 0.005;
        } else {
            _this.__bigvideoToCardRect.startX = _this.__originStartX + _this.__disStartX;
            _this.__bigvideoToCardRect.startY = _this.__originStartY + _this.__disStartY;
            _this.__bigvideoToCardRect.endX = _this.__originEndX + _this.__disEndX;
            _this.__bigvideoToCardRect.endY = _this.__originEndY + _this.__disEndY;

            clearInterval(_this.__bigvideoToCardRectLoopID);
            _this.__bigvideoToCardRectLoopID = undefined;

            _this.__timeOut5ID = setTimeout(_this.__timeOut5, 350, _this); //少し遅らせて初期状態に戻す
        }
    }

    //============================================================================================
    // EXIT2ボタン（大映像再生時のEXITボタン）を押して、作品ボタンサイズに戻ってから0.35秒後の処理
    //============================================================================================
    __timeOut5(_this) {
        clearTimeout(_this.__timeOut5ID);
        _this.__timeOut5ID = undefined;
        _this.__canvas.deleteChild(_this.__bigvideoToCardRect); //Rectを消す
        _this.__canvas.deleteChild(_this.__bg); //背景（暗転用）を消す
        _this.__canvas.deleteChild(_this.__smallVideo);
        _this.__canvas.deleteChild(_this.__bigVideo);
        _this.__bigvideoToCardRect = undefined;
        _this.__bg = undefined;
        _this.__smallVideo = undefined;
        _this.__bigVideo = undefined;

        //==============================
        // Screen.CLOSEイベントの発生!!!
        //==============================
        _this.__closeHandler(_this);
    }

    //======================================================
    // EXIT（×）ボタンをタッチ（TouchEnd）して0.35秒後の処理
    //======================================================
    __timeOut3(_this) {
        clearTimeout(_this.__timeOut3ID);
        _this.__timeOut3ID = undefined;
        
        _this.__sreenOutLoopID = setInterval(_this.__sreenOutLoop, 17, _this); //≒58.8fps
        _this.__loopCount = - Math.PI/2;

        _this.__originStartX = _this.__screen1.startX;
        _this.__originStartY = _this.__screen1.startY;
        _this.__originEndX = _this.__screen1.endX;
        _this.__originEndY = _this.__screen1.endY;
    }

    //===================================================
    // スクリーンを元の作品ボタンのサイズに戻していく処理
    //===================================================
    __sreenOutLoop(_this) {
        _this.__loopCount += 0.03; //値が大きいほど高速
        let _sin = Math.cos(_this.__loopCount); //-1 => 0 => 1（イーズイン・イーズアウト）

        if (_sin < 0.998) {
            _this.__screen1.startX = _this.__originStartX - _this.__disStartX * _sin;
            _this.__screen1.startY = _this.__originStartY - _this.__disStartY * _sin;
            _this.__screen1.endX = _this.__originEndX - _this.__disEndX * _sin;
            _this.__screen1.endY = _this.__originEndY - _this.__disEndY * _sin;
            _this.__screen1.alpha -= 0.006;
            _this.__bg.alpha -= 0.003;
        } else {
            _this.__screen1.startX = _this.__originStartX - _this.__disStartX;
            _this.__screen1.startY = _this.__originStartY - _this.__disStartY;
            _this.__screen1.endX = _this.__originEndX - _this.__disEndX;
            _this.__screen1.endY = _this.__originEndY - _this.__disEndY;

            clearInterval(_this.__sreenOutLoopID);
            _this.__sreenOutLoopID = undefined;

            //少し遅らせて初期状態に戻す
            _this.__timeOut4ID = setTimeout(_this.__timeOut4, 350, _this);
        }
    }

    //=============================================================
    // スクリーンが元の作品ボタンのサイズに戻ってから0.35秒後の処理
    //=============================================================
    __timeOut4(_this) {
        clearTimeout(_this.__timeOut4ID);
        _this.__timeOut4ID = undefined;

        _this.__canvas.deleteChild(_this.__screen1); //スクリーン2を消す
        _this.__canvas.deleteChild(_this.__bg); //背景（暗転用）を消す

        _this.__closeHandler(_this); //Screen.CLOSEイベントの発生!!!
    }
}