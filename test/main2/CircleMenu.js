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
 *  <event>
 *      CircleMenu.IN
 *      CircleMenu.OUT
 *
***********************************************/

class CircleMenu { //五線譜の生成
    static get IN() { return "in"; }
    static get OUT() { return "out"; }
    
    constructor(_canvas) {
        this.__canvas = _canvas;

        this.__inHandler = undefined;
        this.__outHandler = undefined;

        this.init(); //初期値の設定

        this.__positionList = []; //CD型ボタンの固定ポジション（角度＝円を12分割）のリスト
        for (let i=0; i<12; i++) {
            this.__positionList.push(Math.PI/6 * i - Math.PI/2);
        }

        //12個のボタン（CD型）を作成
        this.__cdArray = [];
        for (let i=0; i<12; i++) {
            this.__theCD = new toile.Bitmap("btn" + (i+1) + ".png");
            this.__theCD.name = "CD" + (i+1);
            this.__theCD.__rotate = this.__positionList[i]; // = Math.PI/6 * i - Math.PI/2;
            this.__theCD.x = _canvas.width/2 - 50 + 270 * Math.cos(this.__theCD.__rotate); //半径270（幅）
            this.__theCD.y = _canvas.height/2 - 50 + 270 * Math.sin(this.__theCD.__rotate); //半径270（高さ）    
            //this.__theCD.alpha = 1;
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
        this.__animationDirection = "stop"; //"stop","right"（時計回り）,"left"（反時計回り）
        this.__distanceRadian = 0; //最上位（12時）のボタンの位置との「角度差」
        this.__selectCD = undefined; //選択したボタン（CD型）
        this.__animationCount = - Math.PI/2; //ボタンの三角関数アニメーションで利用するカウンター
        this.__finishCount = 0; //任意の処理が12個全て完了したかを調べるカウンター
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
                    }
                }
            }
        };
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

    //=======================================
    //各ボタンを押したとき（TouchOut）の処理
    //=======================================
    __mouseup_theCD(_theCD) { //this => Bitmap
        var _this = _theCD.__this;

        //一時的にボタン機能をOFF
        _this.__isMouseEvent(false);

        //選択CD型ボタンの角度
        _this.__selectCD = _theCD;
        _theCD.__originRotate = _theCD.__rotate; //選択した瞬間の角度X

        //選択CD型ボタンと他のCD型ボタンとの角度差
        for (let i=0; i<_this.__cdArray.length; i++) {
            let _tmpCD = _this.__cdArray[i];
            if (_tmpCD != _theCD) {
                //（どれかを選択した瞬間の）選択されたもの以外のCD型ボタンの角度X,Y
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
        if (_theCD.__rotate == -Math.PI/2) { //CD1の場合（12時）
            _this.__animationDirection = "stop"; //回転なし
            _this.__distanceRadian = _theCD.__rotate + Math.PI/2; //=0

        } else if (_theCD.__rotate < Math.PI/2) { //CD2～6の場合（1～5時）
            _this.__animationDirection = "left"; //反時計回り
            _this.__distanceRadian = _theCD.__rotate + Math.PI/2;

        } else { //CD7～12（6～11時）
            _this.__animationDirection = "right"; //時計回り
            _this.__distanceRadian = 3*Math.PI/2 - _theCD.__rotate;
        }

        _this.__circleAnimationID = setInterval(_this.__circleAnimation, 17, _this, _theCD); //≒59fps
    }
    
    //=============================================================
    // 各作品をランダムに登場させるためのタイマー（各作品１回実行）
    //=============================================================
    callback_start(_bitmap) {
        _bitmap.__count = 0;
        clearTimeout(_bitmap.__timerID);
    }

    //==================================
    //ボタンがぐるっと回るアニメーション
    //==================================
    __circleAnimation(_this, _theCD) { //this => Window, _this => CircleMenu
        //console.log(_this.__selectCD.name, _this.__animationDirection, _this.__distanceRadian);
        
        /******************** 12時の位置のボタンを選択した場合 ********************/
        if (_this.__animationDirection == "stop") {
            clearInterval(_this.__circleAnimationID); //ぐるっと回るアニメーション完了①
            _this.__circleAnimationID = undefined;
            _this.init();

            //一時的にOFFにしていたボタン機能をONに戻す
            _this.__isMouseEvent(true);

        /******************* 1～5時の位置のボタンを選択した場合 *******************/
        } else if (_this.__animationDirection == "left") {
            _this.__animationCount += 0.03;
            let _cos = Math.cos(_this.__animationCount); //-1 => 0 => 1（イーズイン・イーズアウト）

            if (_cos < 0.998) {
                //選択されたCD型ボタンの処理
                let _nextRotation = _theCD.__originRotate - _this.__distanceRadian * _cos;
                _theCD.x = 630 + 270 * Math.cos(_nextRotation); //半径270（幅）
                _theCD.y = 334 + 270 * Math.sin(_nextRotation); //半径270（高さ）
        
                //選択されたもの以外のCD型ボタンの処理
                for (let i=0; i<_this.__cdArray.length; i++) {
                    let _tmpCD = _this.__cdArray[i];
                    if (_tmpCD != _theCD) {
                        _tmpCD.x = 630 + 270 * Math.cos(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（幅）
                        _tmpCD.y = 334 + 270 * Math.sin(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（高さ）
                    }
                }

            } else { //選択されたCD型ボタンが最上部に到着（＝ぐるっと回るアニメーションの完了!!）
                //console.log(_cos); //0.998710143975583
                //選択されたCDボタンの処理
                _theCD.x = 630;
                _theCD.y = 334 - 270;
                _theCD.__rotate = - Math.PI/2;

                //選択されたもの以外のCD型ボタンの処理（＝ぐるっと回るアニメーションの完了）
                let _nextRotation = _theCD.__originRotate - _this.__distanceRadian;
                for (let i=0; i<_this.__cdArray.length; i++) {
                    let _tmpCD = _this.__cdArray[i];
                    if (_tmpCD != _theCD) {
                        _tmpCD.x = 630 + 270 * Math.cos(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（幅）
                        _tmpCD.y = 334 + 270 * Math.sin(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（高さ）
                        _this.__positionReset(_theCD, _tmpCD, i); //少し苦戦したところ
                    }
                }

                clearInterval(_this.__circleAnimationID); //ぐるっと回るアニメーション完了①
                _this.__circleAnimationID = undefined;
                _this.init();

                //一時的にOFFにしていたボタン機能をONに戻す
                _this.__isMouseEvent(true);
            }

        /******************* 6～11時の位置のボタンを選択した場合 *******************/
        } else if (_this.__animationDirection == "right") {
            _this.__animationCount += 0.03;
            let _cos = Math.cos(_this.__animationCount); //-1 => 0 => 1（イーズイン・イーズアウト）

            if (_cos < 0.998) {
                //選択されたCD型ボタンの処理
                let _nextRotation = _theCD.__originRotate + _this.__distanceRadian * _cos;
                _theCD.x = 630 + 270 * Math.cos(_nextRotation); //半径270（幅）
                _theCD.y = 334 + 270 * Math.sin(_nextRotation);

                //選択されたもの以外のCD型ボタンの処理
                for (let i=0; i<_this.__cdArray.length; i++) {
                    let _tmpCD = _this.__cdArray[i];
                    if (_tmpCD != _theCD) {
                        _tmpCD.x = 630 + 270 * Math.cos(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（幅）
                        _tmpCD.y = 334 + 270 * Math.sin(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（高さ）
                    }
                }

            } else { //選択されたCD型ボタンが最上部に到着（＝ぐるっと回るアニメーションの完了!!）
                //console.log(_cos); //0.998710143975583
                //選択されたCDボタンの処理
                _theCD.x = 630;
                _theCD.y = 334 - 270;
                _theCD.__rotate = - Math.PI/2;

                //選択されたもの以外のCD型ボタンの処理
                let _nextRotation = _theCD.__originRotate + _this.__distanceRadian;
                for (let i=0; i<_this.__cdArray.length; i++) {
                    let _tmpCD = _this.__cdArray[i];
                    if (_tmpCD != _theCD) {
                        _tmpCD.x = 630 + 270 * Math.cos(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（幅）
                        _tmpCD.y = 334 + 270 * Math.sin(_nextRotation + _tmpCD.__distanceSelectRadian); //半径270（高さ）
                        _this.__positionReset(_theCD, _tmpCD, i); //少し苦戦したところ
                    }
                }

                clearInterval(_this.__circleAnimationID); //ぐるっと回るアニメーション完了②
                _this.__circleAnimationID = undefined;
                _this.init();

                //一時的にOFFにしていたボタン機能をONに戻す
                _this.__isMouseEvent(true);
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
        for (let i=0; i<this.__cdArray.length; i++) {
            this.__cdArray[i].__springPower = 0.12;
            this.__cdArray[i].__springCount = 0;
        }
        //12個のボタンを消すアニメーション開始
        this.__outLoopID = setInterval(this.__outLoop, 17, this); //≒59fps
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
                if (_theCD.alpha > 0) _theCD.alpha -= 0.04;
                //Bitmap.scaleでは中心軸がずれるため
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