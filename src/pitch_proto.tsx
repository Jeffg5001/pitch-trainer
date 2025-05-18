import { useState } from 'react'
import './App.css'
function button_test () {
    const [disp, setDisp] = useState("play random note")
    return (
        <button onClick={() =>{ 
          // setCount((count) => count + 1); 
          var note = limitLower + Math.floor(Math.random() * (limitUpper - limitLower))
          setDisp(name(note))
          play_note(note)}}>
          {disp}
        </button>
    )
}
export default button_test


const limitLower = 24
const limitUpper = 120
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
function name(note: number){
    return (noteNames[note % 12] + String(Math.floor(note / 12) - 1))
}

for (var i = 24; i < 120; i++){
  console.log(name(i))
}

function options_octave(note: number) {
  var opts = []
  for (var shift = -10; shift < 10; shift++){
    var opt_note = note + shift * 12
    if (opt_note >= limitLower && opt_note < limitUpper){
      opts.push(opt_note)
    }
  }
  return opts
}

function options_half_octave(note: number) {
  var opts = []
  for (var shift = -20; shift < 20; shift++){
    var opt_note = note + shift * 6
    if (opt_note >= limitLower && opt_note < limitUpper){
      opts.push(opt_note)
    }
  }
  return opts
}

function options_semi(_: number){
  var opts = []
  for (var opt_note=limitLower; opt_note<limitUpper; opt_note++){
    opts.push(opt_note)
  }
  return opts
}

console.log(options_octave(12))
console.log(options_octave(13))
console.log(options_octave(120))
console.log(options_semi(0))
console.log(options_half_octave(12))


// from stack overflow
// var context = new AudioContext();

// function playSound(arr) {
//   var buf = new Float32Array(arr.length)
//   for (var i = 0; i < arr.length; i++) buf[i] = arr[i]
//   var buffer = context.createBuffer(1, buf.length, context.sampleRate)
//   buffer.copyToChannel(buf, 0)
//   var source = context.createBufferSource();
//   source.buffer = buffer;
//   source.connect(context.destination);
//   source.start(0);
// }

// function sineWaveAt(sampleNumber: int, tone) {
//   var sampleFreq = context.sampleRate / tone
//   return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
// }

// var arr = [],
//   volume = 0.2,
//   seconds = 0.5,
//   tone = 441

// for (var i = 0; i < context.sampleRate * seconds; i++) {
//   arr[i] = sineWaveAt(i, tone) * volume
// }

// playSound(arr)
// const sample_rate = 44100
// const freq = 440.0
var audioCtx = new AudioContext()


export function play_note(note: number) {
  // var note_arr = new Float32Array(sample_rate)
  // for (var i = 0; i < note_arr.length; i++) {
  //   note_arr[i] = Math.sin(2 * Math.PI * freq * i / sample_rate)
  // }
  // console.log(note_arr[200])
  // var buffer = context.createBuffer(1, note_arr.length, sample_rate)
  // buffer.copyToChannel(note_arr, 0)
  // var source = context.createBufferSource()
  // source.connect(context.destination)
  // source.start(0)
  const oscillator = audioCtx.createOscillator();
  
  var freq = 440. * Math.pow(2.0, (note - 69) / 12.0)

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => {oscillator.stop()}, 1000)
}

// export function sound_test;exp