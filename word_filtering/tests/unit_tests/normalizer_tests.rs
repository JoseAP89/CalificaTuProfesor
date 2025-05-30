use super::super::content_filter::normalizer::WordNormalizer;

#[test]
fn test_normalization() {
    assert_eq!(WordNormalizer::normalize("sh1t"), "shit");
    assert_eq!(WordNormalizer::normalize("s.h.i.t"), "shit");
    assert_eq!(WordNormalizer::normalize("f*ck"), "fck");
    assert_eq!(WordNormalizer::normalize("hello"), "hello");
}