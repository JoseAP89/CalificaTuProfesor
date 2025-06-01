use phf::{phf_set};

pub const COMMON_TRIGRAMS: phf::Set<&'static str> = phf_set! {
    "que", "ent", "los", "con", "del", "las", "por", "una", "est", "res",
    "ado", "era", "tra", "ció", "pro", "pre", "par", "ten", "sta", "ant",
    "nte", "ien", "nos", "dad", "ica", "com", "aci", "ela", "men", "tos",
    "nal", "cas", "olo", "man", "tar", "mos", "das", "ser", "ran", "eso",
    "hab", "bio", "iba", "cos", "tem", "gen", "ros", "gra", "tom", "rio",
    "car", "lec", "sem", "ual", "ron", "ina", "ble", "ver", "pez", "baj",
    "ban", "ter", "dar", "ios", "aba", "ria", "ero", "ndo", "sto", "ía ",
    "ión", "ene", "rec", "tre", "laz", "ces", "tur", "lar", "sar",
    "tor", "nci", "cto", "iva", "elo", "lia", "tro", "met", "aza", "iza",
    "vel", "rea", "gua", "rib", "sol", "pas", "hac", "sea", "pan", "bre",
    "cal", "ona", "llo"
};