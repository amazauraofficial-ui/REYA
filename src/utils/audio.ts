/**
 * Ambient spa sound generator using Web Audio API
 * Generates relaxing flowing water pink noise and gentle harmonic singing bowl chime.
 * Completely self-contained, no external audio files required.
 */

let audioCtx: AudioContext | null = null;
let waterNode: AudioNode | null = null;
let gainNode: GainNode | null = null;
let isPlaying = false;
let bowlInterval: number | null = null;

export function toggleAmbientSound(): boolean {
  if (isPlaying) {
    stopAmbientSound();
    return false;
  } else {
    startAmbientSound();
    return true;
  }
}

export function isAmbientPlaying(): boolean {
  return isPlaying;
}

export function startAmbientSound() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Master gain
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 2);
    gainNode.connect(audioCtx.destination);

    // Filtered pink noise for gentle water brook / spa fountain
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like soft soothing water ripples
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    whiteNoise.start();
    waterNode = whiteNoise;
    isPlaying = true;

    // Play a gentle singing bowl chime on start and periodically
    playSingingBowlChime(audioCtx, gainNode);
    bowlInterval = window.setInterval(() => {
      if (isPlaying && audioCtx && gainNode) {
        playSingingBowlChime(audioCtx, gainNode);
      }
    }, 18000);

  } catch {
    isPlaying = false;
  }
}

function playSingingBowlChime(ctx: AudioContext, master: GainNode) {
  try {
    const freqs = [216, 432, 648]; // 432Hz harmonic series
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const amp = (0.04 / (idx + 1));
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(amp, ctx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.5 + idx);

      osc.connect(noteGain);
      noteGain.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 6 + idx);
    });
  } catch {
    // ignore
  }
}

export function stopAmbientSound() {
  if (bowlInterval) {
    clearInterval(bowlInterval);
    bowlInterval = null;
  }
  if (gainNode && audioCtx) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
    setTimeout(() => {
      if (waterNode && 'stop' in waterNode) {
        try {
          (waterNode as AudioBufferSourceNode).stop();
        } catch {
          // ignore
        }
      }
      isPlaying = false;
    }, 1000);
  } else {
    isPlaying = false;
  }
}
