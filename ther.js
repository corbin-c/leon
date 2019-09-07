navigator.serviceWorker.register("service_worker.js", { scope: "/" });
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
function handleOrientation(event,webaudio) {
  let f = toFreq(event.gamma);
  let i = toIntensity(event.alpha);
  webaudio.audioSourceNode.frequency.setValueAtTime(f,
    webaudio.audioCtx.currentTime);
  webaudio.gainNode.gain.setValueAtTime(i, webaudio.audioCtx.currentTime);
  waveToColor(f,i);
}
function leon() {
  document.querySelector("body").removeEventListener("click",leon,true);
  let wa = {
    type:"osc",
    audioCtx:new (window.AudioContext || window.webkitAudioContext)(),
    stream:{},
    audioSourceNode:{},
    analyserNode:{},
    gainNode:{}
  };
  wa.gainNode = wa.audioCtx.createGain();
  wa.audioSourceNode = wa.audioCtx.createOscillator();
  wa.audioSourceNode.type = "sine";
  wa.audioSourceNode.frequency.setValueAtTime(
    A_REFERENCE, wa.audioCtx.currentTime);
  wa.gainNode.gain.setValueAtTime(0.5, wa.audioCtx.currentTime);
  wa.audioSourceNode.start();
  wa.audioSourceNode.connect(wa.gainNode);
  wa.gainNode.connect(wa.audioCtx.destination);
  window.addEventListener("deviceorientation", function(e) {
    handleOrientation(e,wa)
    }, true);
}
document.querySelector("body").addEventListener("click",leon,true);