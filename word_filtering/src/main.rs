use std::io;
use word_filtering_lib::ContentFilter; // Replace with your crate name
use std::path::PathBuf;
use clap::Parser;

/// CLI Arguments Structure
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Path to JSON file containing bad words
    #[arg(short, long, default_value = "bad_words.json")]
    wordlist: PathBuf,

    /// Text to analyze (or omit for interactive mode)
    text: Option<String>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    // Initialize content filter
    let filter = ContentFilter::new()?;

    // Process input
    match args.text {
        Some(text) => analyze_and_print(&filter, &text),
        None => interactive_mode(&filter)?,
    }

    Ok(())
}

fn analyze_and_print(filter: &ContentFilter, text: &str) {
    let result = filter.analyze(text);
    
    println!("Analysis for: '{}'", text);
    println!("- Inappropriate: {}", result.is_inappropriate);
    println!("- Vulgar words found: {}", result.vulgar_words_found);
    println!("- Gibberish detected: {}", result.gibberish_detected);
    
    if result.is_inappropriate {
        println!("\n⚠️  Warning: This content may be inappropriate!");
    }
}

fn interactive_mode(filter: &ContentFilter) -> io::Result<()> {
    println!("Content Filter Interactive Mode");
    println!("Enter text to analyze (CTRL+D to exit):");
    
    let stdin = io::stdin();
    let mut buffer = String::new();
    
    while stdin.read_line(&mut buffer)? > 0 {
        let text = buffer.trim_end();
        if !text.is_empty() {
            analyze_and_print(filter, text);
        }
        buffer.clear();
    }
    
    Ok(())
}