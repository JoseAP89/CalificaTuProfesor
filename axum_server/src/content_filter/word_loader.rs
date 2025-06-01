use std::collections::HashSet;
use std::fs::File;
use std::io::Read;
use serde_json;
use std::sync::Arc;
use crate::content_filter::models::BadWords;
use lazy_static::lazy_static;

lazy_static! { // ensures thread-safe one-time initialization
    pub static ref BAD_SPANISH_WORDS_SET: Arc<HashSet<String>> = {
        let json_data = include_str!(r"..\..\config\spanish_bad_words.json"); // embeds the file content at compile time (no runtime file I/O)
        let bad_words: BadWords = serde_json::from_str(json_data)
            .expect("Failed to parse bad words JSON");
        
        // Convert to HashSet during initialization
        Arc::new(bad_words.words.into_keys().collect())
    };
}

pub struct WordLoader;

impl WordLoader {

    pub fn get_words() -> Arc<HashSet<String>> {
        BAD_SPANISH_WORDS_SET.clone()
    }

    pub fn load_from_file(json_path: &str) -> Result<HashSet<String>, Box<dyn std::error::Error>> {
        let mut file = File::open(json_path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;
        
        let bad_words: BadWords = serde_json::from_str(&contents)?;
        Ok(bad_words.words.into_keys().collect())
    }
}