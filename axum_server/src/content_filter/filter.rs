use phf::Set;

use crate::content_filter::{
    normalizer::WordNormalizer,  // Fixed import path
    matcher::WordMatcher,        // Fixed import path
    gibberish::GibberishDetector, // Fixed import path
    models::AnalysisResult,
};
use crate::constants::{WHITE_LIST_WORDS, BLACK_LIST_WORDS};

pub struct ContentFilter {
    vulgar_words: Set<&'static str>,
    gibberish_detector: GibberishDetector,
}

impl ContentFilter {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        //let vulgar_words = WordLoader::load_from_file(json_path)?;
        let vulgar_words  = BLACK_LIST_WORDS;
        let thresold = 0.6;
        let min_word_length = 4;
        let gibberish_detector = GibberishDetector::new(thresold, min_word_length);
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
        let white_list = WHITE_LIST_WORDS;
        let black_list = &self.vulgar_words;
        for word in words {
            let normalized = WordNormalizer::normalize(word);
            // Check blacklist first
            if black_list.contains(&normalized) {
                return true;
            }
            // Check whitelist 
            if white_list.contains(&normalized) {
                continue;
            }
            // if passed the previous tests, then check for more advanced patterns
            for pattern in &self.vulgar_words {
                if WordMatcher::is_match(&normalized, pattern) {
                    return true;
                }
            }
        }
        false
    }
}