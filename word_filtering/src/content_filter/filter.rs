use std::collections::HashSet;
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
    pub fn new(json_path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let vulgar_words = WordLoader::load_from_file(json_path)?;
        let gibberish_detector = GibberishDetector::new(0.7, 4);
        
        Ok(Self {
            vulgar_words,
            gibberish_detector,
        })
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