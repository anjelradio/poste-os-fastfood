export type SpeechRecognitionResultItem = {
  transcript: string;
};

export type SpeechRecognitionEventLike = {
  resultIndex?: number;
  results: {
    [resultIndex: number]: {
      isFinal?: boolean;
      [alternativeIndex: number]: SpeechRecognitionResultItem;
    };
  };
};

export type SpeechRecognitionErrorEventLike = {
  error: string;
};

export type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onnomatch: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export type SpeechRecognitionWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
