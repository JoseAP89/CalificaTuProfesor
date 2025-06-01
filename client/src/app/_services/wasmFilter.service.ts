import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WasmFilterService {
  private initializationPromise: Promise<void>;
  private wasmInitialized = false;

  constructor(private http: HttpClient) {
    this.initializationPromise = this.initializeWasm();
  }

  private async initializeWasm(): Promise<void> {
    if (this.wasmInitialized) return;

    try {
      // 1. Configure WASM paths
      window.Module = window.Module || {
        locateFile: (path) => `assets/wasm/${path}`
      };

      // 2. Load WASM binary
      const wasmBinary = await this.http.get(
        'assets/wasm/word-filtering_bg.wasm',
        { responseType: 'arraybuffer' }
      ).toPromise();

      // 3. Initialize with binary
      window.Module.wasmBinary = wasmBinary;

      // 4. Load JS wrapper
      await this.loadScript('assets/wasm/word-filtering.js');
      
      // 5. Verify initialization
      if (!window.Module?.WasmFilter) {
        throw new Error('WasmFilter class not found');
      }

      this.wasmInitialized = true;
    } catch (error) {
      console.error('WASM initialization failed:', error);
      throw new Error('Failed to initialize WASM module');
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (err) => reject(new Error(`Failed to load script ${src}`));
      document.body.appendChild(script);
    });
  }

  async analyzeText(text: string) {
    try {
      await this.initializationPromise;
      
      if (!window.Module?.WasmFilter) {
        throw new Error('WASM filter not available');
      }

      const filter = new window.Module.WasmFilter();
      return await filter.analyze(text);
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  }
}