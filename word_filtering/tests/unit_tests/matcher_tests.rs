use super::super::content_filter::matcher::WordMatcher;

#[test]
fn test_pattern_matching() {
    assert!(WordMatcher::is_match("shit", "shit"));
    assert!(WordMatcher::is_match("shiiit", "shit"));
    assert!(WordMatcher::is_match("s.h.i.t", "shit"));
    assert!(!WordMatcher::is_match("shirt", "shit"));
}