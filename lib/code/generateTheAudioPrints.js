"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTheAudioFingerPrint = void 0;
//  ref = https://github.com/rickmacgillis/audio-fingerprint/blob/master/audio-fingerprinting.js
// @ts-nocheck
exports.generateTheAudioFingerPrint = (function () {
    var context = null;
    var currentTime = null;
    var oscillator = null;
    var compressor = null;
    var fingerprint = null;
    var callback = null;
    function run(cb, debug = false) {
        callback = cb;
        try {
            setup();
            oscillator.connect(compressor);
            compressor.connect(context.destination);
            oscillator.start(0);
            context.startRendering();
            context.oncomplete = onComplete;
        }
        catch (e) {
            if (debug) {
                throw e;
            }
        }
    }
    function setup() {
        setContext();
        currentTime = context.currentTime;
        setOscillator();
        setCompressor();
    }
    function setContext() {
        var audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        context = new audioContext(1, 44100, 44100);
    }
    function setOscillator() {
        oscillator = context.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, currentTime);
    }
    function setCompressor() {
        compressor = context.createDynamicsCompressor();
        setCompressorValueIfDefined('threshold', -50);
        setCompressorValueIfDefined('knee', 40);
        setCompressorValueIfDefined('ratio', 12);
        setCompressorValueIfDefined('reduction', -20);
        setCompressorValueIfDefined('attack', 0);
        setCompressorValueIfDefined('release', .25);
    }
    function setCompressorValueIfDefined(item, value) {
        if (compressor[item] !== undefined && typeof compressor[item].setValueAtTime === 'function') {
            compressor[item].setValueAtTime(value, context.currentTime);
        }
    }
    function onComplete(event) {
        generateFingerprints(event);
        compressor.disconnect();
    }
    function generateFingerprints(event) {
        var output = null;
        for (var i = 4500; 5e3 > i; i++) {
            var channelData = event.renderedBuffer.getChannelData(0)[i];
            output += Math.abs(channelData);
        }
        fingerprint = output.toString();
        if (typeof callback === 'function') {
            return callback(fingerprint);
        }
    }
    return {
        run: run
    };
})();
