//! ```cargo
//! [dependencies]
//! serde = { version = "1.0", features = ["derive"] }
//! serde_json = "1.0"
//! ```

use std::fs::File;
use std::fs::write;
use std::io::Read;
use serde_json::{json, Value, Serializer};
use serde::{Deserialize, Serialize};
use std::collections::HashMap; 

#[derive(Debug, Serialize, Deserialize)]
pub struct BadWords {
    #[serde(flatten)]
    pub words: HashMap<String, u32>,
}

fn main() {
    let spanish_json_path = r"..\config\spanish_bad_words.json";
    let file = File::open(spanish_json_path);
    let mut contents = String::new();
    let mut result_list : Vec<(String, i32)> = Vec::new();
    let _ = file.expect("**** Error while opening the file ****").read_to_string(&mut contents);
    let bad_words: BadWords = serde_json::from_str(&contents).expect("**** Error while converting to string ****");
    for (v, _) in bad_words.words {
        result_list.push((v.to_string(), 0));
    }
    result_list.sort_by(|a, b| a.0.cmp(&b.0));
    let mut new_spanish_dict =  json!({});
    for (i, tuple) in result_list.iter_mut().enumerate() {
        tuple.1 = (i + 1) as i32;
        new_spanish_dict[tuple.0.clone()] = json!(tuple.1);
    }
    println!();
    match save_json_to_file(&new_spanish_dict, &spanish_json_path){
        Ok(_) => println!("**** The new data was saved into the file successfully ****\n"),
        Err(_) => println!("**** There was an error saving the new file ****\n"),
    }
}

fn save_json_to_file(json_value: &Value, file_path: &str) -> std::io::Result<()> {
    // 1. Create a buffer to hold the JSON data
    let mut buf = Vec::new();
    // 2. Configure a PrettyFormatter with 4-space indentation
    let formatter = serde_json::ser::PrettyFormatter::with_indent(b"    "); // 4 spaces
    // 3. Create a serializer with the custom formatter
    let mut ser = Serializer::with_formatter(&mut buf, formatter);
    // 4. Serialize the JSON value
    json_value.serialize(&mut ser)?;
    // 5. Write to file
    write(file_path, buf)
}