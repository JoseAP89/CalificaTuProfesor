use regex::Regex;
use once_cell::sync::Lazy;

static LEET_SUBSTITUTIONS: Lazy<Vec<(Regex, &str)>> = Lazy::new(|| {
    vec![
        (Regex::new(r"1").unwrap(), "i"),
        (Regex::new(r"3").unwrap(), "e"),
        (Regex::new(r"4").unwrap(), "a"),
        (Regex::new(r"5").unwrap(), "s"),
        (Regex::new(r"7").unwrap(), "t"),
        (Regex::new(r"9").unwrap(), "p"),
        (Regex::new(r"0").unwrap(), "o"),
        (Regex::new(r"@").unwrap(), "a"),
        (Regex::new(r"!").unwrap(), "i"),
        (Regex::new(r"\$").unwrap(), "s"),
        (Regex::new(r"\*").unwrap(), ""),
    ]
});

pub struct WordNormalizer;

impl WordNormalizer {
    pub fn normalize(word: &str) -> String {
        let cleaned: String = word.chars()
            .filter(|c| c.is_ascii_alphanumeric() || *c == '.' || *c == '*' || *c == ' ')
            .collect();
        
        let mut normalized = cleaned.to_lowercase();
        for (re, replacement) in LEET_SUBSTITUTIONS.iter() {
            normalized = re.replace_all(&normalized, *replacement).to_string();
        }
        
        normalized
    }
}