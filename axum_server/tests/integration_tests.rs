use axum_server::ContentFilter; 

#[test]
fn test_full_filter() -> Result<(), Box<dyn std::error::Error>> {
    // 5. Create filter
    let filter = ContentFilter::new()?;
    
    //  vulgar words test section
    
    let text_word = "p3ndej0" ;
    let result = filter.analyze(text_word);
    assert!(result.is_inappropriate, "Should detect vulgar words: {}", text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words");
    
    let text_word = "this is puto" ;
    let result = filter.analyze(text_word);
    assert!(result.is_inappropriate, "Should detect vulgar words: {}", text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);


    let text_word = "this is 9ut0";
    let result = filter.analyze(text_word);
    assert!(result.is_inappropriate, "Should detect vulgar words like puto: {}", text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    let text_word = "this is prostituto";
    let result = filter.analyze(text_word);
    assert!(result.is_inappropriate, "Should detect vulgar words: {}", text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    //  gibberish words test section

    let text_word = "kjhba test";
    let result = filter.analyze(text_word);
    assert!(result.is_inappropriate, "Should detect gibberish word: {}", text_word);
    
    let text_word = "weikjfi";
    let result = filter.analyze(text_word);
    assert!(result.is_inappropriate, "Should detect gibberish: {}", text_word);

    let text_word = "awlkhidwhi";
    let result = filter.analyze(text_word);
    assert!(result.is_inappropriate, "Should detect gibberish: {}", text_word);


    // clean words test section

    let text_word = "hello world";
    let result = filter.analyze(text_word);
    assert!(!result.is_inappropriate, "Should pass clean text: {}", text_word);
    
    let text_word = "quick test";
    let result = filter.analyze(text_word);
    assert!(!result.is_inappropriate, "Should pass clean text: {}", text_word);

    let text_word = "hello world";
    let result = filter.analyze(text_word);
    assert!(!result.is_inappropriate, "Should pass clean text: {}", text_word);

    let text_word = "El profesor nos mintio con muchas cosas";
    let result = filter.analyze(text_word);
    assert!(!result.is_inappropriate, "Should pass clean text: {}", text_word);

    let text_word = "Maestro Ivan Shevchenko";
    let result = filter.analyze(text_word);
    assert!(!result.is_inappropriate, "Should pass clean text: {}", text_word);

    Ok(())
}