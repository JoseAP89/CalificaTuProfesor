use std::collections::HashMap;

type TableName = String;
type Command = String;
type Result = String;

#[derive(Debug)]
pub struct SearchNameOperations {
    store: HashMap<TableName,Operation>,
}

#[derive(Debug)]
pub struct  Operation {
    store: HashMap<Command, Result>
}

impl SearchNameOperations {
    pub fn new() -> Self {
        let mut searchname_ops: HashMap<TableName, Operation> = HashMap::new();
        // university
        let mut ops_store: HashMap<Command, Result>= HashMap::new();
        ops_store.insert(String::from("name"), String::from("name")); 
        ops_store.insert(String::from("id"), String::from("university_id")); 
        let operation = Operation {
            store: ops_store
        };
        searchname_ops.insert(String::from("university"), operation); 

        // campus
        let mut ops_store: HashMap<Command, Result>= HashMap::new();
        ops_store.insert(String::from("name"), String::from("name")); 
        ops_store.insert(String::from("id"), String::from("campus_id")); 
        let operation = Operation {
            store: ops_store
        };
        searchname_ops.insert(String::from("campus"), operation); 

        // state
        let mut ops_store: HashMap<Command, Result>= HashMap::new();
        ops_store.insert(String::from("name"), String::from("name")); 
        ops_store.insert(String::from("id"), String::from("state_id")); 
        let operation = Operation {
            store: ops_store
        };
        searchname_ops.insert(String::from("state"), operation); 

        // scale
        let mut ops_store: HashMap<Command, Result>= HashMap::new();
        ops_store.insert(String::from("name"), String::from("name")); 
        ops_store.insert(String::from("id"), String::from("scale_id")); 
        let operation = Operation {
            store: ops_store
        };
        searchname_ops.insert(String::from("scale"), operation); 

        // adding up everything together
        let search_name_ops = SearchNameOperations{
            store: searchname_ops
        };
        search_name_ops
    }

    pub fn get_id_command(&self, table_name: TableName) -> String{
        match self.store.get(&table_name){
            Some(op) => {
                match op.store.get("id") {
                    Some(cmd) => cmd.to_owned(),
                    None => String::from("X")
                }
            },
            None => String::from("X")
        }
    }
    
}