use std::collections::HashSet;
use std::fs::File;
use std::io::Read;
use serde_json;
use crate::content_filter::models::BadWords;

pub struct WordLoader;

impl WordLoader {
    pub fn load_from_file(json_path: &str) -> Result<HashSet<String>, Box<dyn std::error::Error>> {
        let mut file = File::open(json_path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;
        
        let bad_words: BadWords = serde_json::from_str(&contents)?;
        Ok(bad_words.words.into_keys().collect())
    }
}