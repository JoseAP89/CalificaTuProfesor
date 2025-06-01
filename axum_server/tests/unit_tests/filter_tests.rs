use super::super::content_filter::filter::ContentFilter;
use std::collections::HashSet;
use std::io::Write;
use tempfile::NamedTempFile;

// Mock implementation for testing
struct MockWordLoader;
impl MockWordLoader {
    fn load_from_file(_path: &str) -> Result<HashSet<String>, Box<dyn std::error::Error>> {
        let mut words = HashSet::new();
        words.insert("shit".to_string());
        words.insert("fuck".to_string());
        Ok(words)
    }
}

#[test]
fn test_contains_vulgar_words() {
    // Create a temporary JSON file
    let mut temp_file = NamedTempFile::new().unwrap();
    writeln!(temp_file, r#"{"shit": 1, "fuck": 2}"#).unwrap();
    
    let filter = ContentFilter::new(temp_file.path().to_str().unwrap()).unwrap();
    
    // Test standard cases
    assert!(filter.contains_vulgar_words("this is shit"));
    assert!(filter.contains_vulgar_words("what the fuck"));
    
    // Test leetspeak cases
    assert!(filter.contains_vulgar_words("sh1t"));
    assert!(filter.contains_vulgar_words("f*ck"));
    
    // Test obfuscated cases
    assert!(filter.contains_vulgar_words("s.h.i.t"));
    assert!(filter.contains_vulgar_words("f.u.c.k"));
    
    // Test clean cases
    assert!(!filter.contains_vulgar_words("hello world"));
    assert!(!filter.contains_vulgar_words("shirt"));
}

#[test]
fn test_analyze_method() {
    // Create a temporary JSON file
    let mut temp_file = NamedTempFile::new().unwrap();
    writeln!(temp_file, r#"{"shit": 1, "fuck": 2}"#).unwrap();
    
    let filter = ContentFilter::new(temp_file.path().to_str().unwrap()).unwrap();
    
    // Test with vulgar words
    let result = filter.analyze("this is shit");
    assert!(result.is_inappropriate);
    assert!(result.vulgar_words_found);
    assert!(!result.gibberish_detected);
    
    // Test with gibberish
    let result = filter.analyze("asdf zxcv qwerty");
    assert!(result.is_inappropriate);
    assert!(!result.vulgar_words_found);
    assert!(result.gibberish_detected);
    
    // Test with clean text
    let result = filter.analyze("the quick brown fox");
    assert!(!result.is_inappropriate);
    assert!(!result.vulgar_words_found);
    assert!(!result.gibberish_detected);
    
    // Test with both vulgar words and gibberish
    let result = filter.analyze("shit asdf zxcv");
    assert!(result.is_inappropriate);
    assert!(result.vulgar_words_found);
    assert!(result.gibberish_detected);
}

#[test]
fn test_filter_initialization() {
    // Create a temporary JSON file
    let mut temp_file = NamedTempFile::new().unwrap();
    writeln!(temp_file, r#"{"test": 1}"#).unwrap();
    
    let filter = ContentFilter::new(temp_file.path().to_str().unwrap());
    assert!(filter.is_ok());
    
    let filter = filter.unwrap();
    assert_eq!(filter.vulgar_words.len(), 1);
    assert!(filter.vulgar_words.contains("test"));
}

#[test]
fn test_empty_word_list() {
    // Create an empty JSON file
    let mut temp_file = NamedTempFile::new().unwrap();
    writeln!(temp_file, r#"{}"#).unwrap();
    
    let filter = ContentFilter::new(temp_file.path().to_str().unwrap()).unwrap();
    
    // Should not find any vulgar words
    assert!(!filter.contains_vulgar_words("shit"));
    assert!(!filter.contains_vulgar_words("fuck"));
    
    // Gibberish detection should still work
    let result = filter.analyze("asdf zxcv");
    assert!(result.is_inappropriate);
    assert!(!result.vulgar_words_found);
    assert!(result.gibberish_detected);
}