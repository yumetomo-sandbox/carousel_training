(function(){

  'use strict';

  $(function(){

    /**
     * isTouch：現在タッチされている状態かどうか
     * lastDistance：カーソルが動くたびに座標を格納しておく
     * sumMove：カーソルの総移動量が入る
     * moveParam：加速度の値が入る
     */
    var isTouch = false;
    var lastDistance = 0;
    var sumMove = 0;
    var moveParam = 0;

    var carouselArea = $('.fa-step-carousel-list li');
    var slideContent = $('.fa-step-carousel-list');

    toggleBtnShow();

    // ">"ボタンがクリックされたらスライドを1つ進める
    $('.fa-step-btn-next').on('click',function(){

      slideAnimation();

    });

    // "<"ボタンがクリックされたらスライドを1つ戻す
    $('.fa-step-btn-prev').on('click',function(){

      slideAnimationReverse();

    });

    // スライドエリアがタッチされたら自動スライドを停止し、カーソル位置を取得
    carouselArea.on('touchstart mousedown',function(){

      isTouch = true;

    });

    // タッチ状態が解除されたら、カーソル移動量と加速度に応じてスライドアニメーション
    carouselArea.on('touchend mouseup mouseleave',function(){


      // タッチ状態か
      if(isTouch){

        checkAnimationType();

        // 総移動量などを初期化
        sumMove = 0;
        lastDistance = 0;
        moveParam = 0;
        isTouch = false;

      }

    });

    // タッチしたままマウスが動いた時
    carouselArea.on('touchmove mousemove',function(){

      if(isTouch){

        // 前回の位置が無ければ今の位置を設定
        if(lastDistance === 0){
          lastDistance = event.pageX;
        }

        // 前回の位置と現在の位置との差分（＝加速度）
        moveParam = lastDistance - event.pageX;
        lastDistance = event.pageX;

        // マウスが動いた分コンテンツも移動
        slideContent.css("left",'-='+moveParam);

        // 総移動量を保存しておく
        sumMove += moveParam;

      }

    });

    /**
     * スライドを1つ次に進める
     *
     * @param {number} sumMove
     */
    function slideAnimation(){

      // アニメーション中か
      if(!slideContent.is(':animated')){

        // 左にスライドさせる
        slideContent.stop().animate({
          left: '-=' + (500 - sumMove)
        },{
          duration: 500,
          complete: function(){
            toggleBtnShow();
          }
        });
      }

    }

    /**
     * スライドを1つ前に戻す
     *
     * @param {number} sumMove
     */
    function slideAnimationReverse(){

      // アニメーション中か
      if(!slideContent.is(':animated')){

        // 右にスライドさせる
        slideContent.stop().animate({
          left: '+=' + (500 + sumMove)
        },{
          duration: 500,
          complete: function(){
            toggleBtnShow();
          }
        });

      }

    }

    /**
     * どのアニメーションを実行するか判別する
     */
    function checkAnimationType(){

      var prevBtnParam = $('.fa-step-btn-prev').css('display');
      var nextBtnParam = $('.fa-step-btn-next').css('display');

      // 左方向へのカーソル移動量100px以上、もしくは加速度20以上の場合
      if((moveParam >= 20 || sumMove > 100) && nextBtnParam == "block"){
        slideAnimation();
      }
      // 右方向へのカーソル移動量100px以上、もしくは加速度20以上の場合
      else if((moveParam <= -20 || sumMove < -100) && prevBtnParam == "block"){
        slideAnimationReverse();
      }
      // 移動量も加速度も一定以下の場合、スライドを元の位置に戻す
      else{
        slideContent.stop().animate({
          left: '+='+sumMove
        },200);
      }

    }

    // ボタンの表示・非表示切り替え
    function toggleBtnShow(){

      // 現在のleft値を取得
      var leftParam = parseInt($('.fa-step-carousel-list').css('left'));

      // leftが0なら先頭が表示されているので、戻るボタンを非表示に
      if(leftParam === 0){
        $('.fa-step-btn-prev').css('display','none');
      }
      // leftが-1500なら末尾が表示されているので、次へボタンを非表示に
      else if(leftParam === -1500){
        $('.fa-step-btn-next').css('display','none');
      }
      // 先頭でも末尾でもない場合はボタンをどちらも表示
      else{
        $('.fa-step-btn-prev').css('display','block');
        $('.fa-step-btn-next').css('display','block');
      }

    }

  });

})();
