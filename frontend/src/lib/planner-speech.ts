/** AI 답변 음성 안내 — 브라우저 Web Speech API (www usePlannerApp 와 동일) */

let voiceEnabled = true;

export function isVoiceGuideEnabled(): boolean {
  return voiceEnabled;
}

export function setVoiceGuideEnabled(enabled: boolean): void {
  voiceEnabled = enabled;
  if (!enabled) cancelSpeech();
}

export function toggleVoiceGuide(): boolean {
  setVoiceGuideEnabled(!voiceEnabled);
  return voiceEnabled;
}

export function cancelSpeech(): void {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* noop */
  }
}

export function speakText(text: string): void {
  if (!voiceEnabled || typeof window === "undefined") return;
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(
      String(text).replace(/[^가-힣a-zA-Z0-9 .,!?~·]/g, ""),
    );
    utter.lang = "ko-KR";
    utter.pitch = 1.05;
    utter.rate = 1.02;
    const koVoice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith("ko"));
    if (koVoice) utter.voice = koVoice;
    synth.speak(utter);
  } catch {
    /* noop */
  }
}
