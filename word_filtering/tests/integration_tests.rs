use word_filtering::ContentFilter;
use std::io::{Write, Seek, SeekFrom};
use tempfile::NamedTempFile;

#[test]
fn test_full_filter() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Create JSON content with proper formatting
    let json_content = r#"{
        "shit": 1,
        "fuck": 2
    }"#;

    // 2. Create and properly write to temp file
    let mut temp_file = NamedTempFile::new()?;
    write!(temp_file, "{}", json_content)?;
    temp_file.flush()?;
    
    // 3. Reset file pointer to beginning
    temp_file.seek(SeekFrom::Start(0))?;
    
    // 4. Get path after writing
    let path = temp_file.path().to_str()
        .ok_or("Invalid path")?.to_string();
    
    // 5. Create filter
    let filter = ContentFilter::new(&path)?;
    
    // 6. Test vulgar words
    let result = filter.analyze("this is shit");
    assert!(result.is_inappropriate, "Should detect vulgar words like puto");
    assert!(result.vulgar_words_found, "Should flag vulgar words");
    
    // 7. Test vulgar words
    let result = filter.analyze("this is sh1t");
    assert!(result.is_inappropriate, "Should detect vulgar words like puto");
    assert!(result.vulgar_words_found, "Should flag vulgar words");

    // 8. Test vulgar words
    let result = filter.analyze("this is sh.1t");
    assert!(result.is_inappropriate, "Should detect vulgar words like puto");
    assert!(result.vulgar_words_found, "Should flag vulgar words");

    // 9 Test gibberish
    let result = filter.analyze("kjhba test");
    assert!(result.is_inappropriate, "Should detect gibberish");
    assert!(result.gibberish_detected, "Should flag gibberish");
    
    // 10. Test clean text
    let result = filter.analyze("hello world");
    assert!(!result.is_inappropriate, "Should pass clean text");
    
    Ok(())
}