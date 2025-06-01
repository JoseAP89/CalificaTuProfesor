use std::collections::HashSet;
use std::sync::Arc;
use crate::content_filter::{
    word_loader::WordLoader,
    normalizer::WordNormalizer,  // Fixed import path
    matcher::WordMatcher,        // Fixed import path
    gibberish::GibberishDetector, // Fixed import path
    models::AnalysisResult,
};

pub struct ContentFilter {
    vulgar_words: HashSet<String>,
    gibberish_detector: GibberishDetector,
}

impl ContentFilter {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        //let vulgar_words = WordLoader::load_from_file(json_path)?;
        let vulgar_words = WordLoader::get_words();
        let thresold = 0.6;
        let min_word_length = 4;
        let gibberish_detector = GibberishDetector::new(thresold, min_word_length);
        
        match Arc::try_unwrap(vulgar_words) {
            Ok(set) => {
                // Now you have HashSet<String> with no allocation
                // This is a zero-cost conversion if the Arc had only one reference
                return Ok(Self {
                    vulgar_words : set,
                    gibberish_detector,
                });
            }
            Err(arc) => {
                // Clone the HashSet if there are multiple references
                let set = (*arc).clone();
                return Ok(Self {
                    vulgar_words : set,
                    gibberish_detector,
                });
            }
        }
    }

    pub fn analyze(&self, text: &str) -> AnalysisResult {
        let vulgar_words_found = self.contains_vulgar_words(text);
        let gibberish_detected = self.gibberish_detector.contains_gibberish(text);
        
        AnalysisResult::new(vulgar_words_found, gibberish_detected)
    }

    pub fn contains_vulgar_words(&self, text: &str) -> bool {
        let words = text.split_whitespace();
        for word in words {
            let normalized = WordNormalizer::normalize(word);
            for pattern in &self.vulgar_words {
                if WordMatcher::is_match(&normalized, pattern) {
                    return true;
                }
            }
        }
        false
    }
}