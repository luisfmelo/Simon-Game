/**
 * Created by luism on 29/06/2016.
 */
$(document).ready(function(){
  $('.switchBtn').bootstrapSwitch('state', false);
});

var level = 0;
var sequence = "";
var stateMachine = true;
var hardcoreMode = false;
var readyToReceive = false;
var received = 0;
var time;

// Power Button Toogle
$('.switchBtn').on('switchChange.bootstrapSwitch', function(event, state) {
  stateMachine = !stateMachine;
  $('.counter').toggleClass('off');
  if(!stateMachine)
  {
    level = 0;
    sequence = "";
    hardcoreMode = false;
    $('.level').html( "--" );
  }
});


//Start Button
$( ".startBtn" ).click(function() {
 if ( !stateMachine )       // if the machine is OFF
    return;

  level = 0;
  sequence = "";
  //Turn On machine
  $('.level').html( twoDigits(level) )
  newRound();
});


//Strict Mode
$( ".strictBtn" ).click(function() {
  if ( !stateMachine )       // if the machine is OFF
     return;
  hardcoreMode = !hardcoreMode;
  $('.led').toggleClass('led_off');
});




function newRound(){
  if ( level == 4)
    win();
  sequence += (Math.floor(Math.random() * 4) + 1 ).toString();
  level++;
  $('.level').html( twoDigits(level) )
  blinkSequence();
}

function blinkSequence(){
  console.log(sequence);
  for (var i = 0; i < level; i++)
  {



    window.setTimeout(blink(sequence[i]), 1000);
  }
  readyToReceive=true;
  //time = data.
  //$('.level').html( twoDigits(level) );
  //newRound();
}


//USer play
$('.btn').on('click', function(){
  if ( ! readyToReceive || !stateMachine )
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

  if ( n.toString() !== sequence[received] )
  {
    received = 0;
    readyToReceive = false;
    //strictBt
    //TODO
    blinkSequence();
  }
  received ++;

  if ( received == level )
  {
      received = 0;
      readyToReceive = false;
      window.setTimeout(function() {
        newRound();
      }, 1000);

  }
  else {
    sequence += (Math.floor(Math.random() * 4) + 1 ).toString();
    blinkSequence();
  }
});



function blink(n){
  var btn = ".btn" + n.toString() ;
  $(btn).addClass('blinking');
  window.setTimeout(function() {
    $(btn).removeClass('blinking');
  }, 500);
};




function win(){
  level = 0;
  alert("win");
}

function twoDigits(n){
    return n > 9 ? "" + n: "0" + n;
}
