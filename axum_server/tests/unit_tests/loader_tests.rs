use super::super::content_filter::word_loader::WordLoader;
use std::io::Write;
use tempfile::NamedTempFile;

#[test]
fn test_json_loading() {
    let mut temp_file = NamedTempFile::new().unwrap();
    writeln!(temp_file, r#"{"shit": 1, "fuck": 2}"#).unwrap();
    
    let words = WordLoader::load_from_file(temp_file.path().to_str().unwrap()).unwrap();
    assert!(words.contains("shit"));
    assert!(words.contains("fuck"));
    assert_eq!(words.len(), 2);
}