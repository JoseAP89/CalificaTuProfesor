use super::super::content_filter::gibberish::GibberishDetector;

#[test]
fn test_gibberish_detection() {
    let detector = GibberishDetector::new(0.7, 4);
    assert!(detector.contains_gibberish("asdf zxcv"));
    assert!(!detector.contains_gibberish("the quick brown fox xjhs"));
}