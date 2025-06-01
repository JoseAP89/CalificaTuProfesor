use word_filtering_lib::ContentFilter; 

#[test]
fn test_full_filter() -> Result<(), Box<dyn std::error::Error>> {
    // 5. Create filter
    let filter = ContentFilter::new()?;
    
    // 6. Test vulgar words
    let result = filter.analyze("this is pu.t0");
    assert!(result.is_inappropriate, "Should detect vulgar words");
    assert!(result.vulgar_words_found, "Should flag vulgar words");
    
    // 7. Test vulgar words
    let result = filter.analyze("this is puto");
    assert!(result.is_inappropriate, "Should detect vulgar words");
    assert!(result.vulgar_words_found, "Should flag vulgar words");

    // 8. Test vulgar words
    let result = filter.analyze("this is 9ut0");
    assert!(result.is_inappropriate, "Should detect vulgar words like puto");
    assert!(result.vulgar_words_found, "Should flag vulgar words");

    // 8. Test vulgar words
    let result = filter.analyze("this is prostituto");
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