// Synthesized Web Audio API sound effects for interactive UI (Zero external mp3 files needed)
class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = false; // Muted by default for polite UX
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.init();
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.playSuccess();
        }
        return this.enabled;
    }

    playClick() {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
        } catch (e) {}
    }

    playKeypress() {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320 + Math.random() * 80, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.03);
        } catch (e) {}
    }

    playSuccess() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + index * 0.06);
                gain.gain.setValueAtTime(0.06, now + index * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + index * 0.06);
                osc.stop(now + index * 0.06 + 0.15);
            });
        } catch (e) {}
    }

    playTestPass() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }
}

window.soundManager = new SoundManager();
