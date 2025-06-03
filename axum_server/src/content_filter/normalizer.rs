use regex::Regex;
use once_cell::sync::Lazy;

static LEET_SUBSTITUTIONS: Lazy<Vec<(Regex, &str)>> = Lazy::new(|| {
    vec![
        (Regex::new(r"1").unwrap(), "i"),
        (Regex::new(r"3").unwrap(), "e"),
        (Regex::new(r"€").unwrap(), "e"),
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
    pub fn normalize(word: &str, fullversion: bool) -> String {
        let mut normalized: String = WordNormalizer::remove_diacritics(&word, fullversion)
            .chars()
            .filter(|c| c.is_alphanumeric() || matches!(c , '.' | '*' | ' ' | '@' | '€' | '$' | '!') )
            .collect();
        
        for (re, replacement) in LEET_SUBSTITUTIONS.iter() {
            normalized = re.replace_all(&normalized, *replacement).to_string();
        }
        println!("normalized -> {}", normalized);
        normalized
    }

    /*  Removes diacritics and normalize it into lower_case */
    pub fn remove_diacritics(word: &str, fullversion: bool) -> String {
        if fullversion {
            word.to_lowercase()
                .chars()
                .map(|c| match c {
                    'á' | 'à' | 'â' | 'ã' | 'ä' | 'å' | 'ā' | 'ă' | 'ą' => 'a',
                    'ç' | 'ć' | 'ĉ' | 'ċ' | 'č' => 'c',
                    'ď' | 'đ' => 'd',
                    'é' | 'è' | 'ê' | 'ë' | 'ē' | 'ĕ' | 'ė' | 'ę' | 'ě' => 'e',
                    'ƒ' => 'f',
                    'ĝ' | 'ğ' | 'ġ' | 'ģ' => 'g',
                    'ĥ' | 'ħ' => 'h',
                    'í' | 'ì' | 'î' | 'ï' | 'ĩ' | 'ī' | 'ĭ' | 'į' | 'ı' => 'i',
                    'ĵ' => 'j',
                    'ķ' | 'ĸ' => 'k',
                    'ĺ' | 'ļ' | 'ľ' | 'ŀ' | 'ł' => 'l',
                    'ñ' | 'ń' | 'ņ' | 'ň' | 'ŉ' => 'n',
                    'ó' | 'ò' | 'ô' | 'õ' | 'ö' | 'ø' | 'ō' | 'ŏ' | 'ő' => 'o',
                    'ŕ' | 'ŗ' | 'ř' => 'r',
                    'ś' | 'ŝ' | 'ş' | 'š' | 'ſ' => 's',
                    'ţ' | 'ť' | 'ŧ' => 't',
                    'ú' | 'ù' | 'û' | 'ü' | 'ũ' | 'ū' | 'ŭ' | 'ů' | 'ű' | 'ų' => 'u',
                    'ŵ' => 'w',
                    'ý' | 'ÿ' | 'ŷ' => 'y',
                    'ź' | 'ż' | 'ž' => 'z',
                    // Greek (lowercase)
                    'ά' => 'α',
                    'έ' => 'ε',
                    'ή' => 'η',
                    'ί' | 'ϊ' | 'ΐ' => 'ι',
                    'ό' => 'ο',
                    'ύ' | 'ϋ' | 'ΰ' => 'υ',
                    'ώ' => 'ω',
                    // Other diacritics
                    'ß' => 's',
                    // Default case - keep the character as is
                    _ => c,
                })
                .collect()

        } else { // mostly use for rude words comparissons, since chars like 'ñ' are important in spanish
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
                    'š' | 'ś' => 's',
                    'ž' | 'ż' => 'z',
                    'ń' => 'n',
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
}