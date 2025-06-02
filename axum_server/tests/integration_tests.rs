use axum_server::ContentFilter; 

#[test]
fn test_full_filter() -> Result<(), Box<dyn std::error::Error>> {
    // 5. Create filter
    let filter = ContentFilter::new()?;
    
    //  vulgar words test section
    
    let text_word = "p3ndej0" ;
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);
    
    let text_word = "p3ndej0$" ;
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);
    
    let text_word = "pendejita" ;
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    let text_word = "p3ndej170" ;
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    let text_word = "this is puto" ;
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    let text_word = "this is putó" ;
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    let text_word = "this is PUtÓ" ;
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    let text_word = "this is 9ut0";
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    let text_word = "this is prostituto";
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should flag vulgar words: {}", text_word);

    let text_word = "soplapollas";
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should detect vulgar words: {}", text_word);

    let text_word = "Este maestro se paso, nos puso el examen super complidado y 
    muchos maricas se quejaron pero aun asi nos reprobo a todos.";
    let result = filter.analyze(text_word);
    assert!(result.vulgar_words_found, "Should detect vulgar words: {}", text_word);

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

    let text_word = "El Colegio de México, A.C.";
    let result = filter.analyze(text_word);
    assert!(!result.is_inappropriate, "Should pass clean text: {}", text_word);

    let text_word = "Hacia mucho frio en sus clases por la mañana, pero valío la pena la mañaneada.";
    let result = filter.analyze(text_word);
    assert!(!result.is_inappropriate, "Should pass clean text: {}", text_word);

    let text_word = "apasionado";
    let result = filter.analyze(text_word);
    assert!(!result.vulgar_words_found, "Should pass clean text: {}", text_word);

    let text_word = "la clase del profesor, a decir vdd, es bastante buena, se nota que el prof
    es muy apasionado con lo que hace y le mete corazon a todas sus lecciones, se sale un poco de tema pero
    tambien aprendemos de las cosas que dice, relaciona sus experiencias vividas con su trabajo y con eso 
    aprendemos mucho de cada palabra que sale de su boca, muy recomendado bandita.";
    let result = filter.analyze(text_word);
    assert!(!result.vulgar_words_found, "Should pass clean text: {}", text_word);

    Ok(())
}