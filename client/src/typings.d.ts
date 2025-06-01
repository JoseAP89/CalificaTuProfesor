declare interface Window {
  Module?: {
    wasmBinary?: ArrayBuffer;
    locateFile?: (path: string) => string;
    WasmFilter?: new () => {
      analyze(text: string): Promise<{
        is_inappropriate: boolean;
        vulgar_words_found: boolean;
        gibberish_detected: boolean;
      }>;
    };
    onRuntimeInitialized?: () => void;
  };
}