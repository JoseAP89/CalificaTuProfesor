use phf::{phf_set};

pub const UNUSUAL_TRIGRAMS: phf::Set<&'static str> = phf_set! {
    "qxz", "zqx", "xqz", "jxz", "zjx", "xvj", "qvj", "zvj", "jvq", "xqj", "zqj", "qqq",
    "xxx", "zzz", "jjj", "vvv", "kkk", "qkk", "zzx", "zxz", "xxz", "qzx", "zqz", "vqx",
    "vqz", "jxq", "xkj", "kqx", "kqz", "kpz", "jqq", "qjq", "jjx", "xjj", 
    "zxq", "xjq", "jqx", "pxq", "pqx", "qwp", "xwp", "zwp", "qwx", "wxz", "xwz", "qkz",
    "jkz", "vkz", "zkq", "zzq", "qzz", "xzq", "qgz", "gzx",  "xgx", "gzq", "zqg",
    "xvz", "zvx", "vxz", "vvx", "vxq",  "xvv", "qvv", "vqq", "qqv", "qqk", "kkq",
    "kqq", "kzk", "zkz", "zzk", "kkz", "kxz", "xzk", "zxk", "zkx", "qpx", "pxz", "pzq",
    "zqp", "xqp", "pzx", "xpz", "vjx", "qjx", "jzq", "jzk", "kzq",
    "zjq", "jqz",  "pjq", "qjp", "pjx", "xjp", "zpq", "qzp", "qqp", "pqq", "pqz",
     "zzp", "ppz", "pzz", "qpp", "ppq", "jpp", "ppj", "qpj", "jqp", "vpp", "ppv",
    "zpp",  "qpq", "qpz", "kpk", "pkz", "zkp",  "qxp",  
      "xzj",  "qzj",  "qxj", "jzx", "zxj", 
     "jqj", "qjj", "jjq", "jjz", "jzj", "jvj", "vjj", "jjv", "jvk", "jvz", "vjz",
      "xjv", "vzx", "zxv", "vxx", "xxv", "vxv", "kqv",
    "vqk", "qkv", "kzv", "kvz", "zkv", "qvk", "vzk",  "zkk",  "xkz", 
    "xkq",  "xqk", "qkx", "kjh", "jhb", "kjf", "jfi",  "ikj", "dwh", "lkh",
    "wlk",  "awl", "eik"
};
