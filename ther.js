import { colortools } from "./colortools.js";
const A_REFERENCE = 440;
function waveToColor(frequency,intensity) {
  let pitch = 49+Math.log(frequency/A_REFERENCE)/Math.log(Math.pow(2,1/12));
  pitch = [Math.abs(pitch % 12),Math.floor(pitch/12)];
  let out_color = colortools.HSVtoRGB(pitch[0]/12,pitch[1]/4,intensity);
  document.querySelector("body").setAttribute(
    "style","background-color: "+colortools.toCSS(out_color)+";");
}
function toFreq(angle) { return A_REFERENCE*Math.exp(0.01*angle); }
function toIntensity(angle) { return 2*Math.sin(angle*(Math.PI/180)/2)+0.1; }
function handleOrientation(event) {
  let f = toFreq(event.gamma);
  let i = toIntensity(event.alpha);
  wa.audioSourceNode.frequency.setValueAtTime(f, wa.audioCtx.currentTime);
  gainNode.gain.setValueAtTime(i, wa.audioCtx.currentTime);
  waveToColor(f,i);
}
let wa = {
  type:"osc",
  audioCtx:new (window.AudioContext || window.webkitAudioContext)(),
  stream:{},
  audioSourceNode:{},
  analyserNode:{}
};
let gainNode = wa.audioCtx.createGain();
wa.audioSourceNode = wa.audioCtx.createOscillator();
wa.audioSourceNode.type = "sine";
wa.audioSourceNode.frequency.setValueAtTime(
  A_REFERENCE, wa.audioCtx.currentTime);
gainNode.gain.setValueAtTime(0.5, wa.audioCtx.currentTime);
wa.audioSourceNode.start();
wa.audioSourceNode.connect(gainNode);
gainNode.connect(wa.audioCtx.destination);
window.addEventListener("deviceorientation", handleOrientation, true);