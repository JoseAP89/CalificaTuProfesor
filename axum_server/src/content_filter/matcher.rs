use regex::Regex;

pub struct WordMatcher;

impl WordMatcher {
    pub fn is_match(normalized_word: &str, pattern: &str) -> bool {
            // 1. Exact match first (most reliable)
        if normalized_word == pattern {
            return true;
        }

        // 2. Only do flexible matching for short patterns (e.g. "puta")
        println!("es maricas -> {}", pattern == "maricas");
        if pattern.len() <= 10 {
            // Match like p.*u.*t.*a
            let spaced_pattern = pattern.chars().map(|c| c.to_string()).collect::<Vec<_>>().join(".*");
            let spaced_re = Regex::new(&format!(r"\b{}\b", spaced_pattern)).unwrap();
            if spaced_re.is_match(normalized_word) {
                return true;
            }

            // Allow repeated characters only for short patterns
            let mut prev_char = '\0';
            let mut modified_pattern = String::new();
            for c in pattern.chars() {
                if c == prev_char {
                    modified_pattern.push_str(&format!("{}+", c));
                } else {
                    modified_pattern.push(c);
                    prev_char = c;
                }
            }
            let repeated_re = Regex::new(&format!(r"\b{}\b", modified_pattern)).unwrap();
            if repeated_re.is_match(normalized_word) {
                return true;
            }
        }

        false
    }
}