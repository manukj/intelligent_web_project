const MongodbClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";

const dbName = "test";

let _db = null;

async function connectdb(){
    if(!_db){
        try{
            const client = new MongodbClient(url);
            await client.connect();
            _db = await client.db(dbName);

        }catch (e) {
            throw "connect mongodb failed"
        }
    }
    return _db;
}

exports.getCollection = (collection)=>{
    let _col = null;
    return async()=>{
        if(!_col){
            try{
                const db = await connectdb();
                _col = await db.collection(collection);
            }catch (e) {
                throw "choose collection failed"
            }
        }
        return _col;
    }
}