/***********************************************
 * CircleMenu Class (ver.2017-11-13T19:03)
 * 
 *  <constructor>
 *      new CircleMenu(_canvas)
 * 
 *  <public method>
 *      CircleMenu.addEventListener(_event, _function)   "in" or "out"
 *      CircleMenu.out()
 * 
 *  <public property>
 *      CircleMenu.loopMode   "none", "one", "all", "random"
 *      
 *  <event>
 *      CircleMenu.IN
 *      CircleMenu.OUT
 *
***********************************************/

class CircleMenu {
    static get IN() { return "in"; }
    static get OUT() { return "out"; }
    
    constructor(_canvas) {
        this.__canvas = _canvas;

        this.__adjustY = -23;

        //this.__soundList = ["tmp","tmp","tmp","tmp","tmp","tmp","tmp","tmp","tmp","tmp","tmp","tmp"];
        
        // this.__soundList = ["tmp","tmp","tmp","tmp","tmp","tmp","tmp","tmp","tmp",
        // "10_namida no imi",
        // "11_odayakana zikan",
        // "12_Pieces of a Dream"];
        
        this.__soundList = [
            "01_gomenne",
            "02_hokkori tea time",
            "03_In That Mood",
            "04_inaka no daisougen",
            "05_kanasimi ni sakuhana",
            "06_kuuhaku to seizyaku",
            "07_Let It Happen",
            "08_Lovely Day",
            "09_mizu no mati",
            "10_namida no imi",
            "11_odayakana zikan",
            "12_Pieces of a Dream"
        ]; 

        //"anata wo siritakute"（オルゴール）
        //console.log(this.__soundList.length); //12

        this.__playSound = undefined;
        this.__soundVolume = 0.2;
        this.__inHandler = undefined;
        this.__outHandler = undefined;
        this.__oldSelectCD = undefined; //2017-11-19T17:30
        this.__loopMode = "all"; //"none", "one",  "all", "random"

        this.init(); //初期値の設定

        this.__positionList = []; //CD型ボタンの固定ポジション（角度＝円を12分割）のリスト
        for (let i=0; i<12; i++) {
            this.__positionList.push(2*Math.PI - Math.PI/6 * i - Math.PI/2); //反時計回りに配列
            //this.__positionList.push(Math.PI/6 * i - Math.PI/2); //時計回りに配列
        }

        //12個のボタン（CD型）を作成
        this.__cdArray = [];
        for (let i=0; i<12; i++) {
            this.__theCD = new toile.Bitmap("btn" + (i+1) + ".png");
            this.__theCD.name = "CD" + (i+1);
            this.__theCD.__rotate = this.__positionList[i]; // = Math.PI/6 * i - Math.PI/2;

            this.__theCD.x = _canvas.width/2 - 50 + 270 * Math.cos(this.__theCD.__rotate); //半径270（幅）
            this.__theCD.y = _canvas.height/2 - 50 + 270 * Math.sin(this.__theCD.__rotate) + this.__adjustY; //半径270（高さ）    

            this.__theCD.__springPower = 0.15; //弾力（1.3倍の場合） 0.2
            this.__theCD.__springMinusPower = 0.0002 + Math.random * 0.0001;
            this.__theCD.__springCount = 0; //- Math.PI/2; //弾力用カウント
            this.__theCD.__originX = this.__theCD.x;
            this.__theCD.__originY = this.__theCD.y;
            this.__changeScale(this.__theCD, 0, this.__theCD.x, this.__theCD.y); //Bitmap.scaleでは中心軸がずれるため
            this.__cdArray.push(this.__theCD);
            this.__canvas.addChild(this.__theCD);
        }

        //12個のボタンの登場アニメーション開始
        this.__inLoopID = setInterval(this.__inLoop, 17, this); //≒59fp
    }

    init() { //初期値の設定
        if (this.__circleAnimationID != undefined) {
            clearInterval(this.__circleAnimationID); //ぐるっと回るアニメーション完了②
            this.__circleAnimationID = undefined;
        }
        this.__animationDirection = "stop"; //"stop","right"（時計回り）,"left"（反時計回り）
        this.__distanceRadian = 0; //最上位（12時）のボタンの位置との「角度差」
        //this.__selectCD = undefined; //選択したボタン（CD型）
        this.__animationCount = - Math.PI/2; //ボタンの三角関数アニメーションで利用するカウンター
        this.__finishCount = 0; //任意の処理が12個全て完了したかを調べるカウンター

        if (this.__oldSelectCD != undefined) {
            this.__oldSelectCD.rotate = 0;
            //console.log(this.__oldSelectCD.name, this.__oldSelectCD.rotate); //DEBUG
        }
    }

    //======================
    //イベントリスナーの定義
    //======================
    addEventListener(_event, _function) {
        if (_event == "in") {
            this.__inHandler = _function;
        } else if (_event == "out") {
            this.__outHandler = _function;
        }
    }

    //===============================
    // CircleMenu.loopMode プロパティ
    //===============================
    get loopMode() {
        return this.__loopMode;
    }
    set loopMode(newValue) {
        if ((newValue == "none") || (newValue == "one") || (newValue == "all") || (newValue == "random")) {
            this.__loopMode = newValue;
            //console.log(this.__loopMode);
        } else {
            throw new Error(newValue + " は対応していません");
        }
    }

    //================================
    //12個のボタンの登場アニメーション
    //================================
    __inLoop(_this) { //this == Window
        //console.log("B")
        for (let i=0; i<_this.__cdArray.length; i++) {
            var _theCD = _this.__cdArray[i];

            _theCD.__springCount += 0.4; //値が小さい程... 0.03
            let _theScale = 1 + _theCD.__springPower * Math.cos(_theCD.__springCount);

            if (_theCD.__springPower > 0) {
                _theCD.__springPower -= 0.003; //値が大きい程... 0.0003
                //Bitmap.scaleでは中心軸がずれるため
                _this.__changeScale(_theCD, _theScale, _theCD.__originX, _theCD.__originY);
            
            } else {
                _theCD.__springPower = 0;
                if (++ _this.__finishCount == 12) {
                    clearInterval(_this.__inLoopID);
                    _this.__inLoopID = undefined;
                    _this.__finishCount = 0;
                    _this.__isMouseEvent(true); //12個のボタン機能を有効にする
                    if (_this.__inHandler != undefined) {
                        //=============================================
                        // INイベント（12個のボタンの表示完了）発生!!!
                        //=============================================
                        _this.__inHandler(_this);

                        _this.__startTimeoutID = setTimeout(_this.__startTimeout, 1000, _this);
                    }
                }
            }
        };
    }

    __startTimeout(_this) {
        var _randomNum = Math.floor(Math.random()*12) + 1;
        _this.__mouseup_theCD(_this.__cdArray[_randomNum-1]);
    }

    //=========================================================================
    // 汎用関数：画像の中心を軸にスケール（Bitmap.scaleでは中心軸がずれるため）
    //=========================================================================
    __changeScale(_bitmap, _scale, _originX, _originY, _bitmapWidth=100, _bitmapHeight=100) {
        _bitmap.scale = _scale;
        var _bitmapWidth = 100;
        var _bitmapHeight = 100;
        _bitmap.x = _originX + (_bitmapWidth - _bitmapWidth * _scale) / 2;
        _bitmap.y = _originY + (_bitmapHeight - _bitmapHeight * _scale) / 2;
    }

    __isMouseEvent(_boolean) { //this => CircleMenu
        for (let i=0; i<this.__cdArray.length; i++) {
            var _theCD = this.__cdArray[i];
            _theCD.__this = this;
            if (_boolean) {
                _theCD.addEventListener("mouseup", this.__mouseup_theCD);
            } else {
                _theCD.removeEventListener("mouseup");
            }
        }
    }

    //============================================
    //各ボタンを押したとき（TouchOut）の最初の処理
    //============================================
    __mouseup_theCD(_theCD) { //this => Bitmap
        var _this = _theCD.__this;

        //再生中の曲があればフェードアウトする
        if (_this.__playSound != undefined) {
            _this.__playSound.fadeOut(1.5); //曲のフェードアウトと再生開始のタイミングの調整（秒）
        }

        //曲の再生準備
        let _selectNum = Number(_theCD.name.substr(2)); //"CDXX"の2文字以降を取得
        _this.__playSound = new toile.Sound("mp3/" + _this.__soundList[_selectNum-1] + ".mp3");
        _this.__playSound.volume = _this.__soundVolume;
        //_this.__playSound.play();

        //一時的にボタン機能をOFF
        _this.__isMouseEvent(false);

        if (_this.__selectCD != undefined) {
            clearInterval(_this.__playSoundTimerID);
            _this.__playSoundTimerID = undefined;
            _this.__oldSelectCD = _this.__selectCD;
        }

        //選択した瞬間の角度を調べる
        _this.__selectCD = _theCD;
        _theCD.__originRotate = _theCD.__rotate;

        //選択CD型ボタンと他のCD型ボタンとの角度差
        for (let i=0; i<_this.__cdArray.length; i++) {
            let _tmpCD = _this.__cdArray[i];
            if (_tmpCD != _theCD) {
                //選択されたもの以外の各CD型ボタンの角度
                _tmpCD.__distanceSelectRadian = _tmpCD.__rotate - _theCD.__rotate;
            }
        }

        //マウスダウン（TouchOut）のXXXミリ秒後にCD型ボタンをアニメーションさせる
        _this.__mouseupTimeoutID = setTimeout(_this.__mouseupTimeout, 0, _theCD); //→ ★
    }

    //===================================================================
    //マウスダウン（TouchOut）XXXミリ秒後のCD型ボタンのアニメーション処理
    //===================================================================
    __mouseupTimeout(_theCD) { //this == Window ← ★
        var _this = _theCD.__this;

        /******************************************************************
        /* 角度を調べて回転方向を確定（12時の位置の場合は回転なし）
        /* 12時（-Math.PI/2）、3時（0）、6時（Math.PI/2）、9時（Math.PI）
        ******************************************************************/
        if (_theCD.__rotate == 3*Math.PI/2) { //-Math.PI/2) { //CD1の場合（12時）
            //console.log("A");
            _this.__animationDirection = "stop"; //回転なし
            _this.__distanceRadian = _theCD.__rotate + Math.PI/2; //=0

        } else if (_theCD.__rotate < Math.PI/2) { //CD2～6の場合（1～5時）
            //console.log("B");
            _this.__animationDirection = "left"; //反時計回り
            _this.__distanceRadian = _theCD.__rotate + Math.PI/2;

        } else { //CD7～12（6～11時）
            //console.log("C");
            _this.__animationDirection = "right"; //時計回り
            _this.__distanceRadian = 3*Math.PI/2 - _theCD.__rotate;
        }

        _this.__circleAnimationID = setInterval(_this.__circleAnimation, 17, _this, _theCD); //≒59fps
        
        if (_this.__oldSelectCD != undefined) {
            _this.__oldRotateToZero = 360 - _this.__oldSelectCD.rotate % 360;
        }
        _this.____count = 0;
    }
    
    //=============================================================
    // 各作品をランダムに登場させるためのタイマー（各作品１回実行）
    //=============================================================
    callback_start(_bitmap) {
        _bitmap.__count = 0;
        clearTimeout(_bitmap.__timerID);
    }

    //======================================================
    //ボタンがぐるっと回るアニメーション（51回繰り返される）
    //======================================================
    __circleAnimation(_this, _theCD) { //this => Window, _this => CircleMenu
        //console.log(_this.__selectCD.name, _this.__animationDirection, _this.__distanceRadian);

        //直前まで回転していたCD型ボタンを角度0まで戻す
        if (_this.__oldSelectCD != undefined) {
            let _nextRotate = _this.__oldSelectCD.rotate + _this.__oldRotateToZero/51;
            _this.__oldSelectCD.rotate = _nextRotate;
        }

        /************************************
         * 12時の位置のボタンを選択した場合
         ***********************************/
        if (_this.__animationDirection == "stop") {
            clearInterval(_this.__circleAnimationID); //ぐるっと回る（ここは回らないけれど）アニメーション完了①
            _this.__circleAnimationID = undefined;
            _this.init();
            //console.log(_theCD.name, _theCD.rotate);

            //シークサークルが表示されている場合は消す（2017-11-20T10:31）
            if (_this.__seekCircle != undefined) {
                _this.__canvas.deleteChild(_this.__seekCircle);
                _this.__seekCircle = undefined;
            }

            //シークスタートポイントが表示されている場合は消す（2017-11-20T10:31）
            if (_this.__seekStartPoint != undefined) {
                _this.__canvas.deleteChild(_this.__seekStartPoint);
                _this.__seekStartPoint = undefined;
            }

            //選択したボタンをビヨヨンとアニメーション開始①
            _this.__startSelectButtonAnimation(_theCD);

        /**************************************
         * 1～5時の位置のボタンを選択した場合
         *************************************/
        } else if (_this.__animationDirection == "left") {
            _this.__animationCount += 0.03;
            let _cos = Math.cos(_this.__animationCount); //-1 => 0 => 1（イーズイン・イーズアウト）

            if (_cos < 0.998) {
                //選択されたCD型ボタンの処理
                let _nextRotation = _theCD.__originRotate - _this.__distanceRadian * _cos;
                _theCD.x = 630 + 270 * Math.cos(_nextRotation); //半径270（幅）
                _theCD.y = 334 + 270 * Math.sin(_nextRotation) + _this.__adjustY; //半径270（高さ）
        
                //選択されたもの以外のCD型ボタンの処理
                for (let i=0; i<_this.__cdArray.length; i++) {
                    let _tmpCD = _this.__cdArray[i];
                    if (_tmpCD != _theCD) {
                        _tmpCD.x = 630 + 270 * Math.cos(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（幅）
                        _tmpCD.y = 334 + 270 * Math.sin(_nextRotation + _tmpCD.__distanceSelectRadian) + _this.__adjustY; //半径270（高さ）
                    }
                }

                //シークサークルが表示されている場合は回転しながら徐々に消す（2017-11-20T10:31）
                if (_this.__seekCircle != undefined) {
                    _this.__seekCircle.alpha -= 1/51;
                    _this.__seekCircle.x = _this.__oldSelectCD.x - 10;
                    _this.__seekCircle.y = _this.__oldSelectCD.y - 10;
                }

                //シークスタートポイントが表示されている場合は回転しながら徐々に消す（2017-11-20T10:31）
                if (_this.__seekStartPoint != undefined) {
                    _this.__seekStartPoint.alpha -= 1/51;
                    _this.__seekStartPoint.x = _this.__oldSelectCD.x + 40; // + 45
                    _this.__seekStartPoint.y = _this.__oldSelectCD.y - 10;
                }

            } else { //選択されたCD型ボタンが最上部に到着（＝ぐるっと回るアニメーションの完了!!）
                //console.log(_cos); //0.998710143975583
                //選択されたCDボタンの処理
                _theCD.x = 630;
                _theCD.y = 334 - 270 + _this.__adjustY;
                _theCD.__rotate = - Math.PI/2;

                //選択されたもの以外のCD型ボタンの処理（＝ぐるっと回るアニメーションの完了）
                let _nextRotation = _theCD.__originRotate - _this.__distanceRadian;
                for (let i=0; i<_this.__cdArray.length; i++) {
                    let _tmpCD = _this.__cdArray[i];
                    if (_tmpCD != _theCD) {
                        _tmpCD.x = 630 + 270 * Math.cos(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（幅）
                        _tmpCD.y = 334 + 270 * Math.sin(_nextRotation + _tmpCD.__distanceSelectRadian) + _this.__adjustY; //半径270（高さ）
                        _this.__positionReset(_theCD, _tmpCD, i); //少し苦戦したところ
                    }
                }

                //シークサークルが表示されている場合は（完全に）消す（2017-11-20T10:31）
                if (_this.__seekCircle != undefined) {
                    _this.__canvas.deleteChild(_this.__seekCircle);
                    _this.__seekCircle = undefined;
                }

                //シークスタートポイントが表示されている場合は（完全に）消す（2017-11-20T10:31）
                if (_this.__seekStartPoint != undefined) {
                    _this.__canvas.deleteChild(_this.__seekStartPoint);
                    _this.__seekStartPoint = undefined;
                }

                _this.init();

                //選択したボタンをビヨヨンとアニメーション開始②
                _this.__startSelectButtonAnimation(_theCD);
            }

        /***************************************
         * 6～11時の位置のボタンを選択した場合
         **************************************/
        } else if (_this.__animationDirection == "right") {
            _this.__animationCount += 0.03;
            let _cos = Math.cos(_this.__animationCount); //-1 => 0 => 1（イーズイン・イーズアウト）

            if (_cos < 0.998) {
                //選択されたCD型ボタンの処理
                let _nextRotation = _theCD.__originRotate + _this.__distanceRadian * _cos;
                _theCD.x = 630 + 270 * Math.cos(_nextRotation); //半径270（幅）
                _theCD.y = 334 + 270 * Math.sin(_nextRotation) + _this.__adjustY;

                //選択されたもの以外のCD型ボタンの処理
                for (let i=0; i<_this.__cdArray.length; i++) {
                    let _tmpCD = _this.__cdArray[i];
                    if (_tmpCD != _theCD) {
                        _tmpCD.x = 630 + 270 * Math.cos(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（幅）
                        _tmpCD.y = 334 + 270 * Math.sin(_nextRotation + _tmpCD.__distanceSelectRadian) + _this.__adjustY; //半径270（高さ）
                    }
                }

                //シークサークルが表示されている場合は回転しながら徐々に消す（2017-11-20T10:31）
                if (_this.__seekCircle != undefined) {
                    _this.__seekCircle.alpha -= 1/51;
                    _this.__seekCircle.x = _this.__oldSelectCD.x - 10;
                    _this.__seekCircle.y = _this.__oldSelectCD.y - 10;
                }

                //シークスタートポイントが表示されている場合は回転しながら徐々に消す（2017-11-20T10:31）
                if (_this.__seekStartPoint != undefined) {
                    _this.__seekStartPoint.alpha -= 1/51;
                    _this.__seekStartPoint.x = _this.__oldSelectCD.x + 45; //_this.__oldSelectCD.width/2 - 5;
                    _this.__seekStartPoint.y = _this.__oldSelectCD.y - 10;
                }

            } else { //選択されたCD型ボタンが最上部に到着（＝ぐるっと回るアニメーションの完了!!）
                //console.log(_cos); //0.998710143975583
                //選択されたCDボタンの処理
                _theCD.x = 630;
                _theCD.y = 334 - 270 + _this.__adjustY;
                _theCD.__rotate = - Math.PI/2;

                //選択されたもの以外のCD型ボタンの処理
                let _nextRotation = _theCD.__originRotate + _this.__distanceRadian;
                for (let i=0; i<_this.__cdArray.length; i++) {
                    let _tmpCD = _this.__cdArray[i];
                    if (_tmpCD != _theCD) {
                        _tmpCD.x = 630 + 270 * Math.cos(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（幅）
                        _tmpCD.y = 334 + 270 * Math.sin(_nextRotation + _tmpCD.__distanceSelectRadian) + _this.__adjustY; //半径270（高さ）
                        _this.__positionReset(_theCD, _tmpCD, i); //少し苦戦したところ
                    }
                }

                //シークサークルが表示されている場合は（完全に）消す（2017-11-20T10:31）
                if (_this.__seekCircle != undefined) {
                    _this.__canvas.deleteChild(_this.__seekCircle);
                    _this.__seekCircle = undefined;
                }

                //シークスタートポイントが表示されている場合は（完全に）消す（2017-11-20T10:31）
                if (_this.__seekStartPoint != undefined) {
                    _this.__canvas.deleteChild(_this.__seekStartPoint);
                    _this.__seekStartPoint = undefined;
                }

                _this.init();

                //選択したボタンをビヨヨンとアニメーション開始③
                _this.__startSelectButtonAnimation(_theCD);
            }
        }
    }


    //======================================================
    //汎用関数：選択したボタンをビヨヨンとアニメーション開始
    //======================================================
    __startSelectButtonAnimation(_selectCD) {
        //アニメーション準備
        _selectCD.__originX = _selectCD.x;
        _selectCD.__originY = _selectCD.y;
        _selectCD.__springPower = 0.12;
        _selectCD.__springCount = 0;

        //シークサークルを表示
        this.__seekCircle = new toile.Bitmap("seekCircle.png");
        this.__seekCircle.x = _selectCD.x - 10;
        this.__seekCircle.y = _selectCD.y - 10;
        this.__seekCircle.alpha = 0;
        this.__canvas.addChild(this.__seekCircle);

        //アニメーション開始
        this.__selectButtonAnimLoopID = setInterval(this.__selectButtonAnimLoop, 17, this, _selectCD); //≒59fp
    }
    
    //========================================
    //選択したボタンをビヨヨンとアニメーション
    //========================================
    __selectButtonAnimLoop(_this, _selectCD) { //this == Window
        _selectCD.__springCount += 0.4; //値が小さい程... 0.03
        let _theScale = 1 + _selectCD.__springPower * Math.cos(_selectCD.__springCount);

        if (_selectCD.__springPower > 0) {
            _selectCD.__springPower -= 0.003; //値が大きい程... 0.0003
            //Bitmap.scaleでは中心軸がずれるため
            _this.__changeScale(_selectCD, _theScale, _selectCD.__originX, _selectCD.__originY);
            _this.__changeScale(_this.__seekCircle, _theScale, _selectCD.__originX-10, _selectCD.__originY-10);
            _this.__seekCircle.alpha += 0.024;

        } else {
            _selectCD.__springPower = 0;
            clearInterval(_this.__selectButtonAnimLoopID);
            _this.__selectButtonAnimLoopID = undefined;

            //スケールを1にする
            _this.__changeScale(_selectCD, 1, _selectCD.__originX, _selectCD.__originY);
            _this.__changeScale(_this.__seekCircle, 1, _selectCD.__originX-10, _selectCD.__originY-10);

            //一時的にOFFにしていたボタン機能をONに戻す
            _this.__isMouseEvent(true);

            //シークサークルを表示
            //console.log(_this.__seekCircle.alpha); //0.96000...
            _this.__seekCircle.alpha = 1;

            
            //曲の再生開始
            //console.log(_selectCD.name + ": 音楽再生開始"); //←ここまできた!（2017-11-18T15:15）
            _this.__playSound.play();
            _this.__playSoundTimerID = setInterval(_this.__playSoundTimer, 40, _this, _selectCD); //25fps

            //回転軸の調整
            _selectCD.regX = _selectCD.regY = 50;
            _this.__seekCircle.regX = _this.__seekCircle.regY = _this.__seekCircle.width / 2; 

            //シークスタートポイントを表示
            _this.__seekStartPoint = new toile.Bitmap("seekStartPoint.png");
            _this.__seekStartPoint.x = _selectCD.x + _selectCD.width/2 - 5;
            _this.__seekStartPoint.y = _selectCD.y - 10;
            _this.__seekStartPoint.alpha = 0.5;
            _this.__canvas.addChild(_this.__seekStartPoint);
            _this.__canvas.setDepthIndex(_this.__seekCircle, _this.__canvas.getDepthIndex(_this.__seekStartPoint));
        }
    }

    //================================
    //曲の再生が完了したかのチェック用
    //================================
    __playSoundTimer(_this, _selectCD) {
        _selectCD.rotate += 8; //33.3..回転/分（この関数が25fpsで実行される場合）

        let _sound = _this.__playSound;
        let _percent = _sound.currentTime/_sound.duration; //実際はパーセットではなく（0.0～1）
        _this.__seekCircle.rotate = 360 * _percent;

        //再生が完了したら...
        if (_percent == 1) {
            clearInterval(_this.__playSoundTimerID);
            _this.__playSoundTimerID = undefined;
            _sound.stop();

            //再生モードボタンの選択内容により処理
            //var _loopMode = "one"; //DEBUG（後で削除）←……………ボタンを作成しないと!!!!
            switch (_this.__loopMode) {
                case "none": //何もしない
                    _selectCD.rotate = 3*Math.PI/2;
                    _sound.stop(); //不要
                    break;

                case "one": //もう一度再生
                    _sound.play();
                    _sound.volume = _this.__soundVolume;
                    _this.__playSoundTimerID = setInterval(_this.__playSoundTimer, 40, _this, _selectCD); //25fps
                    break;

                case "all": //順々に全て再生
                    let _currentNum = Number(_this.__selectCD.name.substr(2));
                    let _nextNum = (_currentNum) % 12 + 1; //2017-11-23T18:51
                    let _nextCD = _this.__cdArray[_nextNum-1];
                    _this.__mouseup_theCD(_nextCD);
                    break;

                case "random": //ランダム再生
                    let _nowNum = Number(_this.__selectCD.name.substr(2));
                    var _randomNum = Math.floor(Math.random()*12) + 1;
                    while (_randomNum == _nowNum) { //同曲を連続再生させないようにする
                        _randomNum = Math.floor(Math.random()*12) + 1;
                    }
                    _this.__mouseup_theCD(_this.__cdArray[_randomNum-1]);
                    break;
                
                dafault:
                    console.log("ERROR: CircleMenu.__playSoundTimer");
                    brea;
            }
        }
    }

    //==============================================
    //汎用関数：CD型ボタンの__rotation値のリセット化
    //==============================================
    __positionReset(_selectCD, _targetCD, _i) {
        let _selectNum = Number(_selectCD.name.substr(2)); //"CDXX"の2文字以降を取得
        let _positionNum = (12 - (_selectNum - 1 - _i)) % 12;
        _targetCD.__rotate = this.__positionList[_positionNum];
    }

    //=======================================
    //パブリックメソッド：12個のボタンを消す
    //=======================================
    out() {
        if (this.__playSound != undefined) {
            this.__playSound.fadeOut(1);
        }

        for (let i=0; i<this.__cdArray.length; i++) {
            this.__cdArray[i].__springPower = 0.12;
            this.__cdArray[i].__springCount = 0;
        }

        //シークスタートポイントの削除
        this.__canvas.deleteChild(this.__seekStartPoint);
        this.__canvas.deleteChild(this.__seekCircle);

        //ひとつずれてしまうので...
        for (let i=0; i<this.__cdArray.length; i++) {
            var _theCD = this.__cdArray[i];
            _theCD.__originX = _theCD.x;
            _theCD.__originY = _theCD.y;
        }

        if (this.__playSoundTimerID != undefined) clearInterval(this.__playSoundTimerID); //回転を止める

        if (this.__selectCD != undefined) {
            this.__oldRotateToZero = 360 - this.__selectCD.rotate % 360;
        }
        this.__returnZeroLoopID = setInterval(this.__returnZeroLoop, 17, this); //≒59fps
    }

    //===================================================
    //回転しているCD型ボタンの角度を0にするアニメーション
    //===================================================
    __returnZeroLoop(_this) {
        //直前まで回転していたCD型ボタンを角度0まで戻す
        if (_this.__selectCD != undefined) {

            let _nextRotate = _this.__selectCD.rotate % 360 + (360 - _this.__selectCD.rotate % 360) / 10;
            //let _nextRotate = _this.__selectCD.rotate % 360 + _this.__oldRotateToZero;
            if (_nextRotate < 355) {
                _this.__selectCD.rotate = _nextRotate;
            } else {
                _this.__selectCD.rotate = 0;
                //12個のボタンを消すアニメーション開始
                _this.__outLoopID = setInterval(_this.__outLoop, 17, _this); //≒59fps
                clearInterval(_this.__returnZeroLoopID);
                _this.__returnZeroLoopID = undefined;
            }
        } else { //どれも選択していない場合...
            //12個のボタンを消すアニメーション開始
            _this.__outLoopID = setInterval(_this.__outLoop, 17, _this); //≒59fps
            clearInterval(_this.__returnZeroLoopID);
            _this.__returnZeroLoopID = undefined;
        }
    }

    //================================
    //12個のボタンを消すアニメーション
    //================================
    __outLoop(_this) {
        for (let i=0; i<_this.__cdArray.length; i++) {
            var _theCD = _this.__cdArray[i];

            _theCD.__springCount += 0.4; //値が小さい程...
            let _theScale = 1 + _theCD.__springPower * Math.cos(_theCD.__springCount);

            if (_theCD.__springPower > 0) {
                _theCD.__springPower -= 0.003; //値が大きい程..
                if (_theCD.alpha > 0) {
                    _theCD.alpha -= 0.04;
                    if (_this.__seekCircle != undefined) _this.__seekCircle.alpha -= 0.04;
                }
                _this.__changeScale(_theCD, _theScale, _theCD.__originX, _theCD.__originY);
                
            } else {
                _theCD.__springPower = 0;
                if (++ _this.__finishCount == 12) {
                    clearInterval(_this.__outLoopID);
                    _this.__outLoopID = undefined;
                    _this.__finishCount = 0;
                    if (_this.__outHandler != undefined) {
                        //===========================================
                        // OUTイベント（12個のボタンが消えた）発生!!!
                        //===========================================
                        _this.__outHandler(_this);
                    }
                }
            }
        }
    }
}