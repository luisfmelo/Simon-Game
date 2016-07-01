/**
 * Created by luism on 30/06/2016.
 */
$(document).ready(function(){
  $('.switchBtn').bootstrapSwitch('state', false);
});

var LEVEL_MAX = 20;
var level = 0;
var sequence = "";
var stateMachine = true;
var hardcoreMode = false;
var readyToReceive = false;
var received = 0;
var ended = false;
var s1 = new Audio('assets/musics/s1.mp3');
var s2 = new Audio('assets/musics/s2.mp3');
var s3 = new Audio('assets/musics/s3.mp3');
var s4 = new Audio('assets/musics/s4.mp3');

// Power Button Toogle
$('.switchBtn').on('switchChange.bootstrapSwitch', function(event, state) {
  stateMachine = !stateMachine;
  $('.counter').toggleClass('off');
  if(!stateMachine)
  {
    level = 0;
    sequence = "";
    readyToReceive = false;
    hardcoreMode = false;
    $('.level').html( "--" );
  }
});


//Start Button
$( ".startBtn" ).click( function(){start()} );


//Strict Mode
$( ".strictBtn" ).click(function() {
  if ( !stateMachine )       // if the machine is OFF
     return;
  hardcoreMode = !hardcoreMode;
  $('.led').toggleClass('led_off');
});




function start(){
  console.log("something");
  if ( !stateMachine )       // if the machine is OFF
     return;

  readyToReceive = false;
   level = 0;
   sequence = "";
   //Turn On machine
   newRound();
}

function newRound(){
  if ( level == LEVEL_MAX)
    win();
  if(ended)
    return;
  sequence += (Math.floor(Math.random() * 4) + 1 ).toString();
  level++;
  $('.level').html( twoDigits(level) ).removeClass('hidden');
  play();
}

function play(){
  var i = 0;
  //do this every 500ms
  var interval = setInterval(function() {
    blink(Number(sequence[i]));
    i++;
    if (i >= level)
    {
      clearInterval(interval);
      readyToReceive = true;
    }
  }, 800);
}


//User turn
$('.btn').on('click', function(){
  if ( !readyToReceive || !stateMachine )
    return;

  var n;

  if ( $(this).hasClass('green') )
    n = 1;
  if ( $(this).hasClass('red') )
    n = 2;
  if ( $(this).hasClass('yellow') )
    n = 3;
  if ( $(this).hasClass('blue') )
    n = 4;

  blink(n);

  //user failed -> play again same sequence
  if ( n.toString() !== sequence[received] )
  {
    $('.level').html( "!!" ).removeClass('hidden');
    readyToReceive = false;
    i = 0;
    var interval = setInterval(function() {
      //strict Mode
      if (hardcoreMode)
        start();
      i++;
      if ( i < 5)
        $('.level').toggleClass('hidden');
      else if (i == 5)
        $('.level').html( twoDigits(level) ).removeClass('hidden');
      else if (i == 9)
      {
        clearInterval(interval);
        received = 0;
        play();
      }
    }, 250);
  }
  else {
    received ++;

    if ( received == level )
    {
        setInterval(function() {
          if (received > level)
            clearInterval(interval);
        }, 1000);

        received = 0;
        readyToReceive = false;
        newRound();
    }
  }
});



function win(){
  ended = true;
  $('.level').html( "**" ).removeClass('hidden');
  i = 0;
  var interval = setInterval(function() {
    i++;
    if ( i < 9)
      $('.level').toggleClass('hidden');
    else if (i == 9)
    {
      $('.level').removeClass('hidden');
      clearInterval(interval);
      received = 0;
      readyToReceive = false;
      ended = false;
      start();
    }
  }, 250);
}

function blink(n) {
  console.log(n);
  switch(n)
  {
    case 1: s1.play(); break;
    case 2: s2.play(); break;
    case 3: s3.play(); break;
    case 4: s4.play(); break;
  }
  var btn = ".btn" + n.toString() ;
  $(btn).addClass('blinking');
  window.setTimeout(function() {
    $(btn).removeClass('blinking');
  }, 400);
}

function twoDigits(n){
    return n > 9 ? "" + n: "0" + n;
}
