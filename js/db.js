var db = openDatabase("myDB", "1.0", "TiPS Database Example", 2*1024*1024);

    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS  myTable (id INTEGER PRIMARY KEY, nome TEXT, senha TEXT, email TEXT)");
    })