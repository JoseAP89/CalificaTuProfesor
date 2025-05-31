use wasm_bindgen::prelude::*;
use crate::content_filter::ContentFilter;

#[wasm_bindgen]
pub struct WasmFilter {
    inner: ContentFilter,
}

#[wasm_bindgen]
impl WasmFilter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<WasmFilter, JsValue> {
        ContentFilter::new()
            .map(|filter| WasmFilter { inner: filter })
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
    }

    #[wasm_bindgen]
    pub fn analyze(&self, text: &str) -> JsValue {
        let result = self.inner.analyze(text);
        serde_wasm_bindgen::to_value(&result).unwrap()
    }

    #[wasm_bindgen(js_name = containsVulgarWords)]
    pub fn contains_vulgar_words(&self, text: &str) -> bool {
        self.inner.contains_vulgar_words(text)
    }
}