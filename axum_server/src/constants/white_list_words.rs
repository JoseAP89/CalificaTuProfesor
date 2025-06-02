use phf::{phf_set};

pub const WHITE_LIST_WORDS: phf::Set<&'static str> = phf_set! {
    "pena", "vena", "cara", "pinchar", "inyecta", "cabeza", "apasionado", "piojo", "calabaza",
    "pollo", "venganza", "venda", "pero", "con", "el", "ella", "peso", "pasion", "aburrida",
    "cabezear", "pal", "vdd", "cora", "pico", "piso", "bato", "pato", "pera", "pata", "casa",
    "lo", "y", "muy", "mucho", "poco", "la", "los", "las", "ellas", "ellos", "libro", "clase",
    "clases", "banda", "cariño", "corazon", "salon"
};