export const isCanvasSupported = () => {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

// this working code snippet is taken from - https://github.com/artem0/canvas-fingerprinting/blob/master/fingerprinting/fingerprint.js

export const getCanvasFingerprint = () => {
    // If canvas is not supported simply return a static string
    if(!isCanvasSupported()) return "broprint.js"


    // draw a canvas of given text and return its data uri
    // different browser generates different dataUri based on their hardware configs
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    // https://www.browserleaks.com/canvas#how-does-it-work
    var txt = 'BroPrint.65@345876';
    ctx!.textBaseline = "top";
    ctx!.font = "14px 'Arial'";
    ctx!.textBaseline = "alphabetic";
    ctx!.fillStyle = "#f60";
    ctx!.fillRect(125, 1, 62, 20);
    ctx!.fillStyle = "#069";
    ctx!.fillText(txt, 2, 15);
    ctx!.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx!.fillText(txt, 4, 17);
    return canvas.toDataURL();
}