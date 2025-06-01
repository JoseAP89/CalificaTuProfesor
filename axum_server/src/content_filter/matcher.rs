use regex::Regex;

pub struct WordMatcher;

impl WordMatcher {
    pub fn is_match(normalized_word: &str, pattern: &str) -> bool {
        if normalized_word.contains(pattern) {
            return true;
        }
        
        // Fixed join implementation
        let spaced_pattern = pattern.chars()
            .map(|c| c.to_string())
            .collect::<Vec<_>>()
            .join(r".*");
            
        let spaced_re = Regex::new(&spaced_pattern).unwrap();
        if spaced_re.is_match(normalized_word) {
            return true;
        }
        
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
        let repeated_re = Regex::new(&modified_pattern).unwrap();
        if repeated_re.is_match(normalized_word) {
            return true;
        }
        
        false
    }
}