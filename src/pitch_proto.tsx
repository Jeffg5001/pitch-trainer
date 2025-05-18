import { useState } from 'react'
import './App.css'
function button_test () {
    const [count, setCount] = useState(0)
    return (
        <button onClick={() =>{ 
          setCount((count) => count + 1); 
          sound_test()}}>
          count is {count}
        </button>
    )
}
export default button_test

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

export function sound_test() {
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

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => {oscillator.stop()}, 1000)
}

// export function sound_test;exp