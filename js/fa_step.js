(function(){

  'use strict';

  $(function(){

    var cursorPosition;
    var isTouch = false;
    var carouselArea = $('.fa-step-carousel-list li');

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
      cursorPosition = event.pageX;

    });

    // タッチ状態が解除されたら、カーソル移動量に応じてスライドアニメーション
    carouselArea.on('touchend mouseup mouseleave',function(){

      // タッチ状態か
      if(isTouch){

        var moveDistance = cursorPosition - event.pageX;

        // カーソル移動量100px以下はスワイプとして認識しない
        if(moveDistance > 100){
          slideAnimation();
        }
        else if(moveDistance < -100){
          slideAnimationReverse();
        }

        isTouch = false;

      }

    });

    /**
     * スライドを1つ次に進める
     */
    function slideAnimation(){

      var slideContent = $('.fa-step-carousel-list');

      // アニメーション中か
      if(!slideContent.is(':animated')){

        // 先頭のliをスライドさせて範囲外へ
        slideContent.stop().animate({
          left: '-=500px'
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
     */
    function slideAnimationReverse(){

      var slideContent = $('.fa-step-carousel-list');

      // アニメーション中か
      if(!slideContent.is(':animated')){

        // 先頭のliをスライドさせる
        slideContent.stop().animate({
          left: '+=500px'
        },{
          duration: 500,
          complete: function(){
            toggleBtnShow();
          }
        });

      }

    }

    // ボタンの表示・非表示切り替え
    function toggleBtnShow(){

      var leftParam = parseInt($('.fa-step-carousel-list').css('left'));
      console.log(leftParam);

      if(leftParam === 0){
        $('.fa-step-btn-prev').css('display','none');
      }
      else if(leftParam === -1500){
        $('.fa-step-btn-next').css('display','none');
      }
      else{
        $('.fa-step-btn-prev').css('display','block');
        $('.fa-step-btn-next').css('display','block');
      }

    }

  });

})();
