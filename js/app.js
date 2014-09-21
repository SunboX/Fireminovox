window.addEventListener('DOMContentLoaded', function() {

    'use strict';

    var start = document.getElementById('start');
    var stop = document.getElementById('stop');

    var audioContext = new(window.AudioContext || window.webkitAudioContext)(); // define audio context
    // Webkit/blink browsers need prefix, Safari won't work without window.
    
    var SlapbackDelay = function(){
        this.input = audioContext.createGain();
        
        var output = audioContext.createGain(),
            delay = audioContext.createDelay(),
            feedback = audioContext.createGain(),
            wetLevel = audioContext.createGain();

        delay.delayTime.value = 0.2; //150 ms delay
        feedback.gain.value = 0.3;
        wetLevel.gain.value = 0.5;

        //set up the routing
        this.input.connect(delay);
        this.input.connect(output);
        delay.connect(feedback);
        delay.connect(wetLevel);
        feedback.connect(delay);
        wetLevel.connect(output);

        this.connect = function(target){
           output.connect(target);
        };
    };

    var oscillator;
    
    var slapbackDelay = new SlapbackDelay();
    slapbackDelay.connect(audioContext.destination);

    // Add a listener for the devicemotion event
    window.ondevicemotion = function (deviceMotionEvent) {

        if(oscillator == null) return;

        // Get acceleration on x, y and z axis
        var x = deviceMotionEvent.accelerationIncludingGravity.x;
        var y = deviceMotionEvent.accelerationIncludingGravity.y;
        var z = deviceMotionEvent.accelerationIncludingGravity.z;

        var value = -(x + y + z) * 10 + 400;
        if(value < 100) value = 100;
        if(value > 1000) value = 1000;

        oscillator.frequency.value = value;
    };
    
    start.addEventListener('touchstart', function(){
        oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.value = 100;
        oscillator.connect(slapbackDelay.input);
        oscillator.start(0);
        
        start.hidden = true;
        stop.hidden = false;
    }, false);

    stop.addEventListener('touchstart', function(){
        oscillator.stop(0);
        oscillator = null;
        
        start.hidden = false;
        stop.hidden = true;
    }, false);

});
