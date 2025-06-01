use regex::Regex;
use std::collections::HashSet;
use crate::constants::{UNUSUAL_TRIGRAMS, UNUSUAL_CLUSTERS, COMMON_TRIGRAMS};

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
        let unique_chars = chars.len();
        let len = word.len();
        
        // Only apply to longer words where high diversity is suspicious
        if len >= 4 {
            let diversity_ratio = unique_chars as f64 / len as f64;
            if diversity_ratio > 0.9 {
                0.6  // Very high diversity
            } else if diversity_ratio > 0.8 {
                0.3  // High diversity
            } else {
                0.0
            }
        } else {
            0.0
        }
    }

    pub fn remove_diacritics(c: char) -> char {
        // Convert to lowercase first for consistency
        let c_lower = c.to_ascii_lowercase();
        // Handle common accented characters
        match c_lower {
            'á' | 'à' | 'â' | 'ä' | 'ã' | 'å' | 'ā' => 'a',
            'é' | 'è' | 'ê' | 'ë' | 'ē' | 'ė' | 'ę' => 'e',
            'í' | 'ì' | 'î' | 'ï' | 'ī' | 'į' => 'i',
            'ó' | 'ò' | 'ô' | 'ö' | 'õ' | 'ō' | 'ø' => 'o',
            'ú' | 'ù' | 'û' | 'ü' | 'ū' => 'u',
            'ý' | 'ÿ' => 'y',
            'ç' | 'č' | 'ć' => 'c',
            'ñ' | 'ń' => 'n',
            'š' | 'ś' => 's',
            'ž' | 'ż' => 'z',
            'ß' => 's',
            'ð' => 'd',
            'þ' => 't',
            'æ' => 'a',
            'œ' => 'o',
            'ł' => 'l',
            'ř' => 'r',
            'ť' => 't',
            'ď' => 'd',
            'ḧ' => 'h',
            'ẍ' => 'x',
            _ => c_lower
        }
    }

    pub fn contains_gibberish(&self, text: &str) -> bool {
        let words = text.split_whitespace();
        for word in words {
            let clean_word = &word.chars()
                .filter(|c| c.is_alphabetic() || c == &' ' )
                .map(|c| GibberishDetector::remove_diacritics(c))
                .collect::<String>()
                .split_whitespace()
                .collect::<Vec<_>>()
                .join(" ");
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

        // 6. Gibberish words tend to have unusual trigram (3-letter) combinations
        let trigram_score = self.calculate_trigram_score(&word);
        
        // Weighted combination (adjusted weights)
        (
            repeat_score * 0.3 + 
            consonant_ratio * 0.4 + 
            cluster_score * 0.3 +
            pattern_score * 0.2 +
            diversity_score * 0.3 +
            trigram_score * 0.4
        ).min(1.0)
    }

    fn calculate_pattern_score(&self, word: &str) -> f64 {
        let mut score: f64 = 0.0;
        let vowels = ['a', 'e', 'i', 'o', 'u'];
        let chars: Vec<char> = word.chars().collect();
        
        // Check for consonant streaks (but be more lenient with short words)
        let mut current_streak = 0;
        let mut max_streak = 0;
        for &c in &chars {
            if vowels.contains(&c) {
                current_streak = 0;
            } else {
                current_streak += 1;
                max_streak = max_streak.max(current_streak);
            }
        }
        
        // Only penalize if streak is too long relative to word length
        if max_streak >= 4 && word.len() <= 8 {
            score += 0.3;
        } else if max_streak >= 5 {
            score += 0.4;
        }
        
        // Check for repeated patterns (but require longer repeats for short words)
        if word.len() >= 6 {
            let pattern_len = if word.len() > 8 { 3 } else { 4 };
            for i in 0..=word.len() - pattern_len {
                let pattern = &word[i..i + pattern_len];
                if word[i + pattern_len..].contains(pattern) {
                    score += 0.2;
                }
            }
        }
        
        score.min(1.0)
    }

    fn calculate_cluster_score(&self, word: &str) -> f64 {
        // Expanded list of unusual clusters
        let unusual_clusters = UNUSUAL_CLUSTERS;
        
        let mut score: f64= 0.0;
        for cluster in unusual_clusters.iter() {
            if word.contains(cluster) {
                score += 0.4;  // Increased score for found clusters
                if cluster.len() >= 3 {
                    score += 0.2;  // Extra for longer clusters
                }
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
        let consonant_count = len - vowel_count;
        
        if len == 0 {
            return 0.0;
        }
        
        let ratio = consonant_count as f64 / len as f64;
        
        // More nuanced scoring based on word length
        match len {
            3..=4 if ratio > 0.75 => ratio * 0.7,  // Short words can have high ratios
            5..=7 if ratio > 0.8 => ratio * 1.2,
            8.. if ratio > 0.75 => ratio * 1.5,
            _ => 0.0
        }.min(1.0)
    }

    fn calculate_trigram_score(&self, word: &str) -> f64 {
        let chars: Vec<char> = word.to_lowercase().chars().collect();
        if chars.len() < 3 {
            return 0.0;
        }

        let total = chars.len() - 2;
        let mut unusual_count = 0;
        let mut common_count = 0;

        for i in 0..=chars.len() - 3 {
            let trigram: String = chars[i..i + 3].iter().collect();
            if UNUSUAL_TRIGRAMS.contains(&trigram.as_str()) {
                unusual_count += 1;
            }
            if COMMON_TRIGRAMS.contains(&trigram.as_str()) {
                common_count += 1;
            }
        }

        let unusual_ratio = unusual_count as f64 / total as f64;
        let common_ratio = common_count as f64 / total as f64;

        // Final score: high if many unusual trigrams and few common ones
        ((unusual_ratio * 1.5) - (common_ratio * 1.2)).clamp(0.0, 1.0)
    }

}