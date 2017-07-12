$(function(){
  console.log("iPhone");　
  window.addEventListener("load",function(){
    start_preload();
  });

  // 描画用キャンバスの設定
 var movie = document.getElementById("movie"),   //描画領域
     canvasMovie = document.getElementById("myCanvas"),  //動画用canvas
     ratio = 2,
     oldWidth = canvasMovie.width,
     oldHeight = canvasMovie.height,
     ctx = canvasMovie.getContext("2d"),
     canvasBitmap = document.getElementById("canvas");

  //  retina用のコンテクストの設定
  canvasMovie.width = oldWidth * ratio;
  canvasMovie.height = oldHeight * ratio;
  ctx = canvasMovie.getContext("2d");
  ctx.save();


//    動画用canvasの場所・サイズ指定
 canvasMovie.style.position = "fixed";
 canvasMovie.style.top = 0;
 canvasMovie.style.left = 0;
 canvasMovie.style.width = 100 + "%";
 canvasMovie.style.height = 9*window.innerWidth/16 + "px";
 canvasMovie.parentNode.style.background = "black";

 //    再生ボタン用canvasの場所・サイズ指定
  canvasBitmap.style.position = "absolute";
  canvasBitmap.style.top = 0;
  canvasBitmap.style.left = 0;
  canvasBitmap.style.width = 100 + "%";
  canvasBitmap.style.height = 9*window.innerWidth/16+ 0.5 + "px";

  var area = document.getElementById("Area");
  area.style.top = 0;
  area.style.left = 0;
  area.style.width = 100 + "%";
  area.style.height = 10 + "vh";
  area.style.padding = 0;


 var stage = new createjs.Stage(canvasBitmap),   // 再生ボタン・サムネイルを載せるステージ
      playButton = new createjs.Bitmap("img/playicon.png"),   // 再生ボタン
      thumbnail = new createjs.Bitmap("img/thumbnail2.png");   // サムネイル
      playButton.scaleX = 0.8;
      playButton.scaleY = 0.75;
      playButton.x = 100;
      playButton.y = 30;
      thumbnail.scaleX = 0.47;
      thumbnail.scaleY = 0.418;

      stage.addChild(thumbnail);
      stage.update();
      createjs.Touch.enable(playButton);

  // 動画切り替えのための選択領域
  var meat  = document.getElementById("meat"),
      onion = document.getElementById("onion"),
      sausage = document.getElementById("sausage"),
      flyer = document.getElementById("flyer"),
      yukihira = document.getElementById("yukihira"),
      mixer = document.getElementById("mixer"),
      oben = document.getElementById("oben"),
      pot = document.getElementById("pot"),
      pan = document.getElementById("pan");

  meat.style.display = "none";
  onion.style.display = "none";
  sausage.style.display = "none";
  flyer.style.display = "none";
  yukihira.style.display = "none";
  mixer.style.display = "none";
  oben.style.display = "none";
  pot.style.display = "none";
  pan.style.display = "none";

//    ローディング画面設定
  var progress_of_loading,
  FPS = 60;

  function ProgressArc(x,y,color,radius,thickness){
    createjs.Container.call(this);


    this.x = x/2;
    this.y = y/2;
    this.scaleX = 1.05;
    this.scaleY = 1;
    this.color = color || "#666666";
    this.radius = radius || 40;
    this.thickness = thickness || 6;
    this.shape = new createjs.Shape();
    this.addChild(this.shape);
    this.text = new createjs.Text("  0%", "15px Consolas",this.color);
    this.text.textAlign = "center";
    this.text.textBaseline = "middle";
    this.addChild(this.text);
  }
  ProgressArc.prototype = Object.create(createjs.Container.prototype);
  ProgressArc.prototype.constructor = ProgressArc;

  function slideEntry() {
    stage.removeChild(progress_of_loading);
    progress_of_loading = null;
  }

  var p = ProgressArc.prototype;
  p.shape = null;
  p.text = null;
  p.color;
  p.thickness;
  p.radius;
  p.startAngle = -90*createjs.Matrix2D.DEG_TO_RAD;

  p.update = function(ratio){
    var endAngle = ((-90 + ratio * 360) >> 0)*createjs.Matrix2D.DEG_TO_RAD;
    var g = this.shape.graphics;
    g.c().ss(this.thickness, 0, 0, 10, true).s(this.color).a(0, 0, this.radius, this.startAngle,endAngle).es();
    var percent = (ratio*100)>>0;
    var percent_txt;
    if(percent < 100){
      percent_txt = (percent<10) ? "  " + percent : " " + percent;
    }else{
      percent_txt = "100";
    }
    this.text.text = percent_txt + "%";
  };

  p.exit = function(){
    createjs.Tween.get(this.text)
    .wait(350)
    .to({alpha:0},1000,createjs.Ease.linear);
    createjs.Tween.get(this.shape)
    .wait(350)
    .to({alpha:0, scaleX:1.75,scaleY:1.75},1000,createjs.Ease.cubicOut)
    .call(slideEntry);
  };

//    preloadの設定
  function start_preload(){
    video1_1.loadVideo("video1_1");

    var queue = new createjs.LoadQueue(true);
    queue.setMaxConnections(4);
    progress_of_loading = new ProgressArc(canvasMovie.width >> 1, canvasMovie.height >> 1);
    stage.addChild(progress_of_loading);
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener("tick",stage);
    function handleProgress(evt) {
      progress_of_loading.update(evt.progress);
    }
    function handleFileLoad(event){
      var result = event.result;
    }
    function handleComplete(event){
      queue.removeAllEventListeners();
      progress_of_loading.exit();
      console.log("LOAD COMPLETE");
      setTimeout(function(){
        stage.addChild(playButton);
        stage.update();
        playButton.addEventListener("mousedown",playVideo1_1);
      }, 1000);
    }

    var manifest = [
        {src: "video/10min.mp3"},
        { src: "video/sequence_modified7.mp3"}
    ]
    queue.loadManifest(manifest,true)
    queue.addEventListener("progress",handleProgress);
    queue.addEventListener("fileload",handleFileLoad);
    queue.addEventListener("complete",handleComplete);
  }

//    ロード後の画面リサイズ
  function Resize(){
      canvasMovie.style.width = 100 + "%";
      canvasMovie.style.height = 9*window.innerWidth/16 + "px";
      canvasBitmap.style.width = 100 + "%";
      canvasBitmap.style.height = 9*window.innerWidth/16 + "px";
      canvasMovie.style.webkitTransform = "translateZ(0)";
      canvasMovie.style.display = "none";
      canvasMovie.style.display = "block";
  }

 $(window).bind("resize", Resize);
  $(window).bind("scroll", function(e){
   canvasMovie.style.width = 90 + "%";
   canvasMovie.style.height = 8*window.innerWidth/16 + "px";
 });


function success(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude
  console.log(latitude, longitude);
}

function error() {
 alert("unable to receive your location");
}

//Audio


var Sound2 = new Howl({
  src: ["video/sequence_modified7.mp3"],
  autoplay: false,
  loop: true
 });

 var Sound_video4 = new Howl({
  src: ["video/sound4_1.mp3"],
  autoplay: false,
  loop: false
 });
//   ビデオ再生に必要な機能の設定

// videoの設定
  var Video = function(url) {
    var thisObj = this;
    this.video = $('<video>');
    this.video.attr("playsInline", "playsInline");
    this.video.attr("src",url);
  };

  Video.prototype.loadVideo = function(e){
    this.video.get(0).load();
    this.video.get(0).oncanplaythrough = function(){
      console.log('canplaythrough '+ e);
    }
  };
  Video.prototype.playVideo = function() {
    this.video.get(0).play();
  };

  Video.prototype.pauseVideo = function(){
    this.video.get(0).pause();
  };

  Video.prototype.zIndex = function(e){
    this.video.get(0).style.zIndex = e;
    console.log('zIndex: ' + e);
  };

  var video1_1 = new Video('video/0208_Sequence_Final_1_1_iphone.mp4'); // introduction
  var video2_1 = new Video('video/0208_Sequence_Final_2_1_iphone.mp4'); // meat
  var video2_2 = new Video('video/0208_Sequence_Final_2_2_iphone.mp4'); // onion
  var video2_3 = new Video('video/0208_Sequence_Final_2_3_iphone.mp4'); // sausage
  var video3_1 = new Video('video/0208_Sequence_Final_3_1_iphone.mp4'); // yukihira
  var video3_2 = new Video('video/0208_Sequence_Final_3_2_iphone.mp4'); // flyer
  var video3_3 = new Video('video/0208_Sequence_Final_3_3_iphone.mp4'); // oben
  var video3_4 = new Video('video/0208_Sequence_Final_3_4_iphone.mp4'); // mixer
  var video3_5 = new Video('video/0208_Sequence_Final_3_5_iphone.mp4'); // enamel pot
  var video3_6 = new Video('video/0208_Sequence_Final_3_6_iphone.mp4'); // frying pan
  var video4_1 = new Video('video/1218_Sequence_Final_4_1.mp4'); // 肉じゃが
  var video4_2 = new Video('video/1218_Sequence_Final_4_2.mp4'); // コロッケ
  var video4_3 = new Video('video/1218_Sequence_Final_4_3.mp4'); // キッシュ風オムレツ
  var video4_4 = new Video('video/1218_Sequence_Final_4_4.mp4'); // ヴィシソワーズ
  var video4_5 = new Video('video/1218_Sequence_Final_4_5.mp4'); // ポトフ
  var video4_6 = new Video('video/1218_Sequence_Final_4_6.mp4'); // ジャーマンポテト

//  領域の表示、非表示
function objDisplay(d1,d2){
  console.log("objDisplay");
  d1.style.display = "block";
  d2.style.display = "block";
  // クリックイベントの追加
  if(d1 === meat){
    console.log(d1.id + ", " + d2.id +" and sausage display!");
    sausage.style.display = "block";
    d1.addEventListener("click",playVideo2_1);
    d2.addEventListener("click",playVideo2_2);
    sausage.addEventListener("click", playVideo2_3);
  }else if(d1 === yukihira){
    console.log(d1.id + " and " + d2.id +" display!");
    d1.addEventListener("click",playVideo3_1);
    d2.addEventListener("click",playVideo3_2);
  }else if(d1 === oben){
    console.log(d1.id + " and " + d2.id +" display!");
    d1.addEventListener("click",playVideo3_3);
    d2.addEventListener("click",playVideo3_4);
  }else if(d1 === pot){
    console.log(d1.id + " and " + d2.id +" display!");
    d1.addEventListener("click",playVideo3_5);
    d2.addEventListener("click",playVideo3_6);
  }
};


function objHide(){
  console.log("Hide all regions.");
  meat.style.display = "none";
  onion.style.display = "none";
  sausage.style.display = "none";
  flyer.style.display = "none";
  yukihira.style.display = "none";
  mixer.style.display = "none";
  oben.style.display = "none";
  pot.style.display = "none";
  pan.style.display = "none";
};

canvasMovie.parentNode.insertBefore(video1_1.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video2_1.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video2_2.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video2_3.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video3_1.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video3_2.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video3_3.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video3_4.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video3_5.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video3_6.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video4_1.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video4_2.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video4_3.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video4_4.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video4_5.video.get(0),canvas);
canvasMovie.parentNode.insertBefore(video4_6.video.get(0),canvas);


  ctx.scale(0.5,0.5);

  function shake(v){
    var meter_id = setTimeout(function(){
      var sum_of_shake = 0;
      var shakeHandler = function(event){
        console.log(sum_of_shake)

        // 加速度
        // X軸
        var x = event.accelerationIncludingGravity.x;
        // Y軸
        var y = event.accelerationIncludingGravity.y;
        // Z軸
        var z = event.accelerationIncludingGravity.z;

        if(Math.abs(x) > 10 || Math.abs(y) > 10 || Math.abs(z) > 10){
          sum_of_shake += Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
        }else{
          sum_of_shake += 0;
        }
        if(sum_of_shake > 3000){
          console.log("shake is enough");
          clearTimeout(meter_id);
          window.removeEventListener("devicemotion", shakeHandler);
          if(v === 1){
            console.log("video4_1");
            playVideo4_1();
          }else if(v === 2){
            console.log("video4_2");
            playVideo4_2();
          }else if(v === 3){
            console.log("video4_3");
            playVideo4_3();
          }else if(v === 4){
            console.log("video4_4");
            playVideo4_4();
          }else if(v === 5){
            console.log("video4_5");
            playVideo4_5();
          }else if(v === 6){
            console.log("video4_6");
            playVideo4_6();
          }
        }
      }
      window.addEventListener("devicemotion", shakeHandler);
    }, 10);
 }

  function triggerEvent(element){
    var evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click',true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    return element.dispatchEvent(evt);
  }

   // ロゴを表示させる関数
  var collage_Logo = function(){
    var ctx = canvasMovie.getContext("2d");
    ctx.save();
    canvasMovie.style.zIndex = 1000;
    var logo = new Image();
    logo.src ="img/collage-logo3.png";
    logo.onload = function(){
      ctx.drawImage(logo, 0, 0, 1200, 640);
      console.log("Logo showed");
    };
  };
  // closeボタンを表示させる関数
  var show_Close_Button = function(){
    var closeButton = new createjs.Bitmap("img/closeButton.png");
    closeButton.x = 272;
    closeButton.y = -12;
    closeButton.scaleX = 0.3;
    closeButton.scaleY = 0.3;
    stage.removeChild(playButton);
    stage.removeChild(thumbnail);
    stage.addChild(closeButton);
    canvasBitmap.style.zIndex = 1000;
    stage.update();
    closeButton.addEventListener("click", function(){
      parent.$.magnificPopup.close();
    });
    console.log("close button showed");
  };


var playVideo1_1 = function(){
  var promise1_1 = Promise.resolve();
  promise1_1.then(function(){
    console.log("playVideo1_1");
    objHide();
    ga('send', 'event', 'initial', 'click', 'video1-1play'); 
  }).then(function(){
    canvasBitmap.style.zIndex = 10;
    video1_1.zIndex(100);
  }).then(function(){
    video1_1.playVideo();
    Sound2.play();
    console.log(Date.now());
  }).then(function(){
    video2_1.loadVideo("video2_1");
    video2_2.loadVideo("video2_2");
    video2_3.loadVideo("video2_3");
    var showArea = window.setTimeout(function(){
      objDisplay(meat,onion);
      window.clearTimeout(showArea);
    }, 30000);
  }).then(function(){
    var randn = Math.floor(Math.random()*(4-1)+1);
    console.log(randn);
    var randomPlay = [playVideo2_1,playVideo2_2,playVideo2_3];
    video1_1.video.get(0).addEventListener('ended',function(){
      console.log('video1_1 ended');
      randomPlay[randn-1]();
    });
  });
};


// video2_1
  var  playVideo2_1 = function(){
    var promise2_1 = Promise.resolve();
    promise2_1.then(function(){
      console.log("playVideo2_1");
      objHide();
      ga('send', 'event', 'meat', 'click', 'video2-1play')
    }).then(function(){
      video1_1.pauseVideo();
    }).then(function(){
      video2_1.playVideo();
      video2_1.zIndex(200);
      console.log("currentTime : " + video2_1.video.get(0).currentTime);
    }).then(function(){
      video3_1.loadVideo("video3_1");
      video3_2.loadVideo("video3_2");
      var showArea = window.setTimeout(function(){
        objDisplay(yukihira,flyer);
        window.clearTimeout(showArea);
      }, 31000);
    }).then(function(){
      var randn = Math.floor(Math.random()*(3-1)+1);
      console.log(randn);
      var randomPlay = [playVideo3_1,playVideo3_2];
      video2_1.video.get(0).addEventListener('ended',function(){
        randomPlay[randn-1]();
      });
    });
  };


// video2_2
  var  playVideo2_2 = function(){
   var promise2_2 = Promise.resolve();
    promise2_2.then(function(){
      console.log("playVideo2_2");
      objHide();
      ga('send', 'event', 'onion', 'click', 'video2-2play')
    }).then(function(){
      video1_1.pauseVideo();
     }).then(function(){
      video2_2.playVideo();
      video2_2.zIndex(200);
    }).then(function(){
      video3_3.loadVideo("video3_3");
      video3_4.loadVideo("video3_4");
      var showArea = window.setTimeout(function(){
        objDisplay(oben,mixer);
        window.clearTimeout(showArea);
      }, 40000);
    }).then(function(){
      var randn = Math.floor(Math.random()*(3-1)+1);
      console.log(randn);
      var randomPlay = [playVideo3_3,playVideo3_4];
      video2_2.video.get(0).addEventListener('ended',function(){
        randomPlay[randn-1]();
      });
    });
  };

// video2_3
  var  playVideo2_3 = function(){
    var promise2_3 = Promise.resolve();
    promise2_3.then(function(){
      console.log("playVideo2_3");
      objHide();
      ga('send', 'event', 'sausage', 'click', 'video2-3play')
    }).then(function(){
      video1_1.pauseVideo();
    }).then(function(){
      video2_3.playVideo();
      video2_3.zIndex(200);
    }).then(function(){
      video3_5.loadVideo("video3_5");
      video3_6.loadVideo("video3_6");
      var showArea = window.setTimeout(function(){
        objDisplay(pot,pan);
        window.clearTimeout(showArea);
      }, 27000);
    }).then(function(){
      var randn = Math.floor(Math.random()*(3-1)+1);
      console.log(randn);
      var randomPlay = [playVideo3_5,playVideo3_6];
      video2_3.video.get(0).addEventListener('ended',function(){
        randomPlay[randn-1]();
      });
    });
  };


 // video3_1
   var  playVideo3_1 = function(){
    var promise3_1 = Promise.resolve();
    promise3_1.then(function(){
     console.log("playVideo3_1");
     objHide();
     ga('send', 'event', 'yukihira', 'click', 'video3-1play');
   }).then(function(){
     video2_1.pauseVideo();
   }).then(function(){
     video3_1.playVideo();
     video3_1.zIndex(300);
   }).then(function(){
     video4_1.loadVideo("video4_1");
     var shakeOn = window.setTimeout(function(){
       shake(1);
       window.clearTimeout(shakeOn);
     }, 34000);
   });
 };

 // video3_2
  var  playVideo3_2 = function(){
    var promise3_2 = Promise.resolve();
    promise3_2.then(function(){
      console.log("playVideo3_2");
      objHide();
      ga('send', 'event', 'flyer', 'click', 'video3-2play')
    }).then(function(){
      video2_1.pauseVideo();
    }).then(function(){
      video3_2.playVideo();
      video3_2.zIndex(300);
    }).then(function(){
      video4_2.loadVideo("video4_2");
      var shakeOn = window.setTimeout(function(){
        shake(2);
        window.clearTimeout(shakeOn);
      }, 26000);
   })
 };

 // video3_3
  var  playVideo3_3 = function(){
    var promise3_3 = Promise.resolve();
    promise3_3.then(function(){
      console.log("playVideo3_3");
      objHide();
      ga('send', 'event', 'oben', 'click', 'video3-3play')
    }).then(function(){
      video2_2.pauseVideo();
    }).then(function(){
       video3_3.playVideo();
       video3_3.zIndex(300);
    }).then(function(){
      video4_3.loadVideo("video4_3");
      var shakeOn = window.setTimeout(function(){
        shake(3);
        window.clearTimeout(shakeOn);
      }, 36000);
   })
  };

// video3_4
  var  playVideo3_4 = function(){
    var promise3_4 = Promise.resolve();
    promise3_4.then(function(){
      console.log("playVideo3_4");
      objHide();
      ga('send', 'event', 'mixer', 'click', 'video3-4play');
    }).then(function(){
      video2_2.pauseVideo();
    }).then(function(){
      video3_4.playVideo();
      video3_4.zIndex(300);
    }).then(function(){
      video4_4.loadVideo("video4_4");
      var shakeOn = window.setTimeout(function(){
        shake(4);
        window.clearTimeout(shakeOn);
      }, 41000);
   })
  };

// video3_5
  var  playVideo3_5 = function(){
    var promise3_5 = Promise.resolve();
    promise3_5.then(function(){
      console.log("playVideo3_5");
      objHide();
      ga('send', 'event', 'pot', 'click', 'video3-5play'); 
    }).then(function(){
      video2_3.pauseVideo();
     }).then(function(){
      video3_5.playVideo();
      video3_5.zIndex(300);
    }).then(function(){
      video4_5.loadVideo("video4_5");
      var shakeOn = window.setTimeout(function(){
        shake(5);
        window.clearTimeout(shakeOn);
      }, 37000);
   })
 };

  // video3_6
  var  playVideo3_6 = function(){
    var promise3_6 =Promise.resolve();
    promise3_6.then(function(){
      console.log("playVideo3_6");
      objHide();
      ga('send', 'event', 'pan', 'click', 'video3-6play');
    }).then(function(){
      video2_3.pauseVideo();
    }).then(function(){
      video3_6.playVideo();
      video3_6.zIndex(300);
    }).then(function(){
      video4_6.loadVideo("video4_6");
      var shakeOn = window.setTimeout(function(){
        shake(6);
        window.clearTimeout(shakeOn);
      }, 36000);
   })
 };

  var playVideo4_1 = function(){
    var promise4_1 = Promise.resolve();
    promise4_1.then(function(){
      console.log("playVideo4_1");
      objHide();
      ga("send", "event", 'complete4-1',"click", "video4-1play"); 
    }).then(function(){
      video3_1.pauseVideo();
      Sound2.pause();
    }).then(function(){
      Sound_video4.play();
      video4_1.playVideo();
      video4_1.zIndex(400);
    }).then(function(){
      video4_1.video.get(0).addEventListener("ended", function(){
        video4_1.video.get(0).currentTime = 0;
        collage_Logo();
        show_Close_Button();
      });
    });
  };


  var playVideo4_2 = function(){
    var promise4_2 = Promise.resolve();
    promise4_2.then(function(){
      console.log("playVideo4_2");
      objHide();
      ga("send", "event", 'complete4-2',"click", "video4-2play");
    }).then(function(){
      video3_2.pauseVideo();
      Sound2.pause();
    }).then(function(){
      Sound_video4.play();
      video4_2.playVideo();
      video4_2.zIndex(400);
    }).then(function(){
      video4_2.video.get(0).addEventListener("ended", function(){
        video4_2.video.get(0).currentTime = 0;
        collage_Logo();
        show_Close_Button();
      });
    });
  };


  var playVideo4_3 = function(){
    var promise4_3 = Promise.resolve();
    promise4_3.then(function(){
      console.log("playVideo4_3");
      objHide();
      ga("send", "event", 'complete4-3',"click", "video4-3play");
    }).then(function(){
      video3_3.pauseVideo();
        Sound2.pause();
    }).then(function(){
      Sound_video4.play();
      video4_3.playVideo();
      video4_3.zIndex(400);
    }).then(function(){
      video4_3.video.get(0).addEventListener("ended", function(){
        video4_3.video.get(0).currentTime = 0;
        collage_Logo();
        show_Close_Button();
      });
    });
  };


  var playVideo4_4 = function(){
    var promise4_4 = Promise.resolve();
    promise4_4.then(function(){
      console.log("playVideo4_4");
      objHide();
      ga("send", "event", 'complete4-4',"click", "video4-4play"); 
    }).then(function(){
      video3_4.pauseVideo();
      Sound2.pause();
    }).then(function(){
      Sound_video4.play();
      video4_4.playVideo();
      video4_4.zIndex(400);
    }).then(function(){
      video4_4.video.get(0).addEventListener("ended", function(){
        video4_4.video.get(0).currentTime = 0;
        collage_Logo();
        show_Close_Button();
      });
    });
  };


  var playVideo4_5 = function(){
    var promise4_5 = Promise.resolve();
    promise4_5.then(function(){
      console.log("playVideo4_5");
      objHide();
      ga("send", "event", 'complete4-5',"click", "video4-5play"); 
    }).then(function(){
      video3_5.pauseVideo();
      Sound2.pause();
    }).then(function(){
      Sound_video4.play();
      video4_5.playVideo();
      video4_5.zIndex(400);
    }).then(function(){
      video4_5.video.get(0).addEventListener("ended", function(){
        video4_5.video.get(0).currentTime = 0;
        collage_Logo();
        show_Close_Button();
      });
    });
  };


  var playVideo4_6 = function(){
    var promise4_6 = Promise.resolve();
    promise4_6.then(function(){
      console.log("playVideo4_6");
      objHide();
      ga("send", "event", 'complete4-6',"click", "video4-6play");
    }).then(function(){
      video3_6.pauseVideo();
      Sound2.pause();
    }).then(function(){
      Sound_video4.play();
      video4_6.playVideo();
      video4_6.zIndex(400);
    }).then(function(){
      video4_6.video.get(0).addEventListener("ended", function(){
        video4_6.video.get(0).currentTime = 0;
        collage_Logo();
        show_Close_Button();
      });
    });
  };
});
