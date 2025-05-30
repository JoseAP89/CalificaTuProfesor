use word_filtering::ContentFilter;
use std::io::Write;
use tempfile::NamedTempFile;

#[test]
fn test_full_filter() -> Result<(), Box<dyn std::error::Error>> {
    // Create JSON content
    let json_content = r#"
    {
        "shit": 1,
        "fuck": 2
    }
    "#;
    
    // Create and write to temp file
    let mut temp_file = NamedTempFile::new()?;
    write!(temp_file, "{}", json_content)?;
    
    // Flush to ensure content is written
    temp_file.flush()?;
    
    // Get the path (important to do this after writing)
    let path = temp_file.path().to_str()
        .ok_or("Invalid path")?;
    
    // Create filter
    let filter = ContentFilter::new(path)?;
    
    // Run tests
    let result = filter.analyze("this is shit");
    assert!(result.is_inappropriate);
    assert!(result.vulgar_words_found);
    
    let result = filter.analyze("asdf zxcv");
    assert!(result.is_inappropriate);
    assert!(result.gibberish_detected);
    
    let result = filter.analyze("hello world");
    assert!(!result.is_inappropriate);
    
    Ok(())
}