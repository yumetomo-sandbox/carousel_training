(function(){

  'use strict';

  $(function(){

    var slideInterval,cursorPosition;
    var isTouch = false;
    var carouselArea = $('.carousel-list li')

    // liの数を取得
    var liLen = $('.carousel-list li').length;

    // liの数に応じてulの横幅を設定
    $('.carousel-list').css("width",liLen * 500);

    // 各liにclass設定 + liの数分ナビゲーション用li生成
    for(var i = 1; i <= liLen; i++){
      $('.carousel-list li:nth-child('+ i +')').addClass('item-' + i );
      $('<li class="item-'+ i +'"></li>').appendTo('.carousel-nav');
    }

    // 最初のナビゲーションにクラスを追加
    $('.carousel-nav li:first').addClass('now-show');

    // 末尾liを先頭liの前に移動させる
    $('.carousel-list li:first').before($('.carousel-list li:last'));

    // 自動スライドを開始
    autoSlide();

    // ">"ボタンがクリックされたらスライドを1つ進める
    $('.btn-next').on('click',function(){

      clearInterval(slideInterval);
      slideAnimation();
      autoSlide();

    });

    // "<"ボタンがクリックされたらスライドを1つ戻す
    $('.btn-prev').on('click',function(){

      clearInterval(slideInterval);
      slideAnimationReverse();
      autoSlide();

    });

    // ナビゲーションがクリックされたら対象のスライドまで移動する
    $('.carousel-nav li').on('click',function(){

      // 現在表示されているスライドか
      if(!$(this).hasClass('now-show')){
        clearInterval(slideInterval);
        var targetClass = $(this).attr('class');

        // 対象のスライドが要素上で何番目のliか
        var targetIndex = $('.carousel-list li').index($('.carousel-list li.'+ targetClass));
        var navIndex = $('.carousel-nav li').index($(this));

        selectAnimationType(targetIndex,navIndex);
        autoSlide();
      }

    });

    // スライドエリアがタッチされたら自動スライドを停止し、カーソル位置を取得
    carouselArea.on('touchstart mousedown',function(){

      clearInterval(slideInterval);
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
        autoSlide();

      }

    });

    /**
     * 4秒ごとに自動でスライドさせる
     */
    function autoSlide(){

      slideInterval = setInterval(function(){

        slideAnimation();

      },4000);

    }

    /**
     * スライドを1つ次に進める
     */
    function slideAnimation(){

      var liFirst = $('.carousel-list li:first');

      // 先頭のliをクローンしておく
      var liClone = liFirst.clone(true);

      // アニメーション中か
      if(!liFirst.is(':animated')){

        changeNavigation("next");

        // 先頭のliをスライドさせて範囲外へ
        liFirst.stop().animate({
          marginLeft: '-500px'
        },{

          duration: 500,
          complete: function(){

            // 先頭liを削除し、クローンしておいたものを末尾に挿入
            liFirst.remove();
            $('.carousel-list li:last').after(liClone);

          }

        });

      }

    }

    /**
     * スライドを1つ前に戻す
     */
    function slideAnimationReverse(){

      var liLast = $('.carousel-list li:last');
      var liFirst = $('.carousel-list li:first');

      // 末尾のliをクローンしておく
      var liClone = liLast.clone(true);

      // アニメーション中か
      if(!liFirst.is(':animated')){

        changeNavigation("prev");

        // 先頭のliをスライドさせる
        liFirst.stop().animate({
          marginLeft: '500px'
        },{

          duration: 500,
          complete: function(){

            // 末尾のliを削除し、先頭liのmarginを0にしてからクローンしておいたものを先頭に挿入
            liLast.remove();
            liFirst.css('marginLeft','0');
            liFirst.before(liClone);

          }

        });

      }

    }

    /**
     * 対象のスライドまで移動する
     */
     function slideAnimationToTarget(targetIndex,navIndex){

       targetIndex = targetIndex - 1;

       var liFirst = $('.carousel-list li:first');

       // アニメーション中か
       if(!liFirst.is(':animated')){

         changeNavigation("target",navIndex);

         // 対象より前のliをスライドさせて範囲外へ
         liFirst.stop().animate({
           marginLeft: -500 * targetIndex + 'px'
         },{

           duration: 500,
           complete: function(){

             for(var i = 0; i < targetIndex - 2; i++){
               var liRemove = $('.carousel-list li:first');
               var liClone = liRemove.clone(true);

               // 先頭liを削除し、クローンしておいたものを末尾に挿入
               liRemove.remove();
               $('.carousel-list li:last').after(liClone);
             }

           }

         });
       }
     }

    /**
     * 対象スライドの位置に応じたアニメーションを行う
     *
     * @param {number} targetIndex
     * @param {number} navIndex
     */
    function selectAnimationType(targetIndex,navIndex){

      // 先頭ならスライドを1つ戻す
      if(targetIndex === 0){
        slideAnimationReverse();
      }
      // 3番目ならスライドを1つ進める
      else if(targetIndex === 2){
        slideAnimation();
      }
      else if(targetIndex >= 3){
        slideAnimationToTarget(targetIndex,navIndex);
      }

    }

    /**
     * 現在表示されているスライドに合わせてナビゲーションを変更
     *
     * @param {string} toChangeNavigation
     * @param {number} navIndex
     */
    function changeNavigation(toChangeNavigation,navIndex){

      var liTarget;

      // 表示されるのはどのスライドか
      if(toChangeNavigation === 'next'){

        // 次のliをターゲットに設定
        liTarget = $('.now-show').next();

        // 次が無ければ先頭のliをターゲットに設定
        if(liTarget.length === 0){
          liTarget = $('.carousel-nav li:first');
        }

      }
      else if(toChangeNavigation === 'prev'){

        // 前のliをターゲットに設定
        liTarget = $('.now-show').prev();

        // 前が無ければ末尾のliをターゲットに設定
        if(liTarget.length === 0){
          liTarget = $('.carousel-nav li:last');
        }

      }
      else{

        // クリックされたliをターゲットに設定
        liTarget = $('.carousel-nav li').eq(navIndex);

      }

      // 今のliからclassを消し、ターゲットのliに付与
      $('.now-show').removeClass('now-show');
      liTarget.addClass('now-show');

    }

  });

})();
