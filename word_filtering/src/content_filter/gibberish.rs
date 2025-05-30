use regex::Regex;

pub struct GibberishDetector {
    threshold: f64,  // Note we're using f64 here
    min_word_length: usize,
}

impl GibberishDetector {
    pub fn new(threshold: f64, min_word_length: usize) -> Self {
        Self {
            threshold,
            min_word_length,
        }
    }

    pub fn contains_gibberish(&self, text: &str) -> bool {
        let words = text.split_whitespace();
        for word in words {
            let clean_word = word.trim_matches(|c: char| !c.is_alphabetic());
            if clean_word.len() >= self.min_word_length {
                let score = self.calculate_score(clean_word);
                if score > self.threshold {
                    return true;
                }
            }
        }
        false
    }

    fn calculate_score(&self, word: &str) -> f64 {
        let word = word.to_lowercase();
        let len = word.len();
        
        let repeat_score = self.calculate_repeat_score(&word);
        let consonant_ratio = self.calculate_consonant_ratio(&word, len);
        let cluster_score = self.calculate_cluster_score(&word);
        
        (repeat_score * 0.4 + consonant_ratio * 0.3 + cluster_score * 0.3).min(1.0)
    }

    fn calculate_repeat_score(&self, word: &str) -> f64 {  // Changed return type to f64
        let mut score: f64 = 0.0;  // Explicitly typed as f64
        let mut prev_char = '\0';
        let mut repeat_count = 0;
        
        for c in word.chars() {
            if c == prev_char {
                repeat_count += 1;
                if repeat_count >= 2 {
                    score += 0.3;
                }
            } else {
                repeat_count = 0;
            }
            prev_char = c;
        }
        
        score.min(1.0)  // Now the type is clear
    }

    fn calculate_consonant_ratio(&self, word: &str, len: usize) -> f64 {
        let vowels = Regex::new(r"[aeiouy]").unwrap();
        let vowel_count = vowels.find_iter(word).count();
        if len > 0 {
            (len - vowel_count) as f64 / len as f64
        } else {
            0.0
        }
    }

    fn calculate_cluster_score(&self, word: &str) -> f64 {
        let unusual_clusters = Regex::new(r"(zx|xb|xj|qx|jx|zv|zn|zq|zp|zt|zk|zw|zv|zz|xx|kk|qq)").unwrap();
        if unusual_clusters.is_match(word) { 0.5 } else { 0.0 }
    }
}