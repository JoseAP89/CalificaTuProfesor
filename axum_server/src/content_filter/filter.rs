use std::cell::RefCell;
use std::collections::HashSet;
use std::time::Instant;

use phf::Set;

use crate::content_filter::{
    normalizer::WordNormalizer,  // Fixed import path
    gibberish::GibberishDetector, // Fixed import path
    models::AnalysisResult,
};
use crate::constants::{WHITE_LIST_WORDS, BLACK_LIST_WORDS};

pub struct ContentFilter {
    vulgar_words: Set<&'static str>,
    gibberish_detector: GibberishDetector,
    positive_cache: RefCell<HashSet<String>>
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
            positive_cache: RefCell::new(HashSet::new())
        })
    }

    pub fn analyze(&self, text: &str) -> AnalysisResult {
        let start = Instant::now();
        let vulgar_words_found = self.contains_vulgar_words(text);
        let duration = start.elapsed();
        println!("\n*** Vulgar Execution time: {:?}\n", duration);
        let start = Instant::now();
        let gibberish_detected = self.gibberish_detector.contains_gibberish(text);
        let duration = start.elapsed();
        println!("\n*** Gibberish Execution time: {:?}\n", duration);
        
        AnalysisResult::new(vulgar_words_found, gibberish_detected)
    }

    pub fn contains_vulgar_words(&self, text: &str) -> bool {
        let words = text.split_whitespace();
        let white_list = &WHITE_LIST_WORDS;
        let black_list = &self.vulgar_words;
        for word in words {
            if word.len() < 3 { continue;}
            let normalized = WordNormalizer::normalize(word, false);
            // Check whitelist 
            if  ContentFilter::contains_plural_singular_spanish(white_list, &normalized) {
                continue;
            }
            // Check blacklist
            if ContentFilter::contains_plural_singular_spanish(black_list, &normalized) {
                return true;
            }
            if self.positive_cache.borrow().contains(&normalized) {
                continue;
            }
            // if passed the previous tests, then check for more advanced patterns
            for bad_word in &self.vulgar_words {
                if normalized.contains(bad_word) {
                    return true;
                } 
            }
            self.positive_cache.borrow_mut().insert(normalized);
        }
        false
    }

    pub fn contains_plural_singular_spanish(list: &Set<&'static str>, word: &str) -> bool {
        // Early return if exact match exists
        if list.contains(word) {
            return true;
        }

        // Avoid allocation when possible by working with string slices
        if word.len() >= 2 {
            let last_char = word.chars().last().unwrap();
            
            let base = match last_char {
                'a' | 'o' => { // it is singular
                    if word.contains("ito") || word.contains("ita"){
                        &word[..word.len() - 3] // it contains a diminutive
                    } else {
                        &word[..word.len() - 1]
                    }
                    
                },
                's' if word.len() >= 3 => { // it is plural
                    if word.contains("itos") || word.contains("itas"){
                        &word[..word.len() - 4] // it contains a diminutive
                    } else {
                        &word[..word.len() - 2]
                    }
                },
                _ => &"",
            };
            if base.len() == 0 { return false;}
            list.contains(&format!("{}o", base).as_str()) || 
                list.contains(&format!("{}a", base).as_str()) ||
                list.contains(&format!("{}os", base).as_str()) ||
                list.contains(&format!("{}as", base).as_str())
        } else {
            false
        }
    }

}