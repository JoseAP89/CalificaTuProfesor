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
        let mut normalized: String = WordNormalizer::remove_diacritics(&word)
            .chars()
            .filter(|c| c.is_ascii_alphanumeric() || *c == '.' || *c == '*' || *c == ' ')
            .collect();
        
        for (re, replacement) in LEET_SUBSTITUTIONS.iter() {
            normalized = re.replace_all(&normalized, *replacement).to_string();
        }
        normalized
    }

    /*  Removes diacritics and normalize it into lower_case */
    pub fn remove_diacritics(word: &str) -> String {
        word.to_lowercase()
            .chars()
            .map(|c| match c {
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
                _ => c,
            })
            .collect()
    }
}