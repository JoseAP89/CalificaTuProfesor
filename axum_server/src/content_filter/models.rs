use std::collections::HashMap; 
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BadWords {
    #[serde(flatten)]
    pub words: HashMap<String, u32>,
}

pub struct AnalysisResult {
    pub is_inappropriate: bool,
    pub vulgar_words_found: bool,
    pub gibberish_detected: bool,
}

impl AnalysisResult {
    pub fn new(vulgar_words_found: bool, gibberish_detected: bool) -> Self {
        Self {
            is_inappropriate: vulgar_words_found || gibberish_detected,
            vulgar_words_found,
            gibberish_detected,
        }
    }
}