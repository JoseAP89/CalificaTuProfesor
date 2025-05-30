- WORD FILTERING PROJECT 

    Detects bad or rude, and gibberish words, so that to avoid posting crucial data with fake information.

-- Structure of the Project

src/
├── lib.rs                # Library root exposing public interface
├── content_filter/       # Main module
│   ├── mod.rs           # Module declarations
│   ├── filter.rs        # Core filter implementation (SRP)
│   ├── word_loader.rs   # Word loading responsibility (SRP)
│   ├── normalizer.rs    # Normalization logic (SRP)
│   ├── matcher.rs       # Pattern matching logic (SRP)
│   ├── gibberish.rs     # Gibberish detection (SRP)
│   └── models.rs        # Data structures
config/
└── bad_words.json       # Configuration file
tests/
├── integration_tests.rs
└── unit_tests/
    ├── filter_tests.rs
    ├── loader_tests.rs
    └── // etc...


-- Test Structure in detail

tests/
└── unit_tests/
    ├── filter_tests.rs     # Tests for ContentFilter
    ├── loader_tests.rs     # Tests for WordLoader
    ├── normalizer_tests.rs # Tests for WordNormalizer
    ├── matcher_tests.rs    # Tests for WordMatcher
    └── gibberish_tests.rs  # Tests for GibberishDetector