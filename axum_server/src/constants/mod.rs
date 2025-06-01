pub mod unusual_trigrams;
pub mod unusual_clusters;
pub mod common_triagrams;
pub mod white_list_words;
pub mod black_list_words;

pub use unusual_trigrams::{UNUSUAL_TRIGRAMS};
pub use unusual_clusters::{UNUSUAL_CLUSTERS};
pub use common_triagrams::{COMMON_TRIGRAMS};
pub use white_list_words::{WHITE_LIST_WORDS};
pub use black_list_words::{BLACK_LIST_WORDS};