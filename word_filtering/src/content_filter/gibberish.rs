use regex::Regex;
use std::collections::HashSet;

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

    fn calculate_diversity_score(&self, word: &str) -> f64 {
        let chars: HashSet<char> = word.chars().collect();
        if word.len() > 8 && chars.len() > word.len() / 2 {
            0.3
        } else {
            0.0
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
        
        // 1. Check for repeating characters (more aggressive)
        let repeat_score = self.calculate_repeat_score(&word);
        
        // 2. Check consonant/vowel ratio
        let consonant_ratio = self.calculate_consonant_ratio(&word, len);
        
        // 3. Check for unusual consonant clusters (expanded list)
        let cluster_score = self.calculate_cluster_score(&word);
        
        // 4. New: Check for alternating vowels/consonants
        let pattern_score = self.calculate_pattern_score(&word);

        // 5. Too many different consonants in a short word is suspicious
        let diversity_score = self.calculate_diversity_score(&word);
        
        // Weighted combination (adjusted weights)
        (
            repeat_score * 0.4 + 
            consonant_ratio * 0.3 + 
            cluster_score * 0.4 +
            pattern_score * 0.3 +
            diversity_score * 0.1
        ).min(1.0)
    }

    fn calculate_pattern_score(&self, word: &str) -> f64 {
        let mut score: f64 = 0.0;
        let vowels = ['a', 'e', 'i', 'o', 'u'];
        let chars: Vec<char> = word.chars().collect();
        
        // Check for long sequences without vowels
        let mut current_streak = 0;
        for &c in &chars {
            if vowels.contains(&c) {
                current_streak = 0;
            } else {
                current_streak += 1;
                if current_streak >= 4 {  // 4+ consonants in a row
                    score += 0.3;
                }
            }
        }
        
        // Check for repeated patterns
        if word.len() >= 6 {
            for i in 0..word.len()-3 {
                let pattern = &word[i..i+3];
                if word[i+3..].contains(pattern) {
                    score += 0.2;
                }
            }
        }
        
        score.min(1.0)
    }

    fn calculate_cluster_score(&self, word: &str) -> f64 {
        // Expanded list of unusual clusters
        let unusual_clusters = [
            "zq", "xj", "qj", "zx", "xb", "qx", "jx", "zv", "zn", 
            "zp", "zt", "zk", "zw", "zz", "xx", "kk", "qq", "jj",
            "bbb", "jjj", "xxx", "zzz", "kkk", "qqq",
            "bjj", "bxq", "xqz", "nax", "xbb", "aan", "jik", "kjh", "jbx"  // Added repeated letters
        ];
        
        let mut score: f64= 0.0;
        for cluster in unusual_clusters {
            if word.contains(cluster) {
                score += 0.3;  // Increase score for each found cluster
            }
        }
        
        score.min(1.0)
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

}