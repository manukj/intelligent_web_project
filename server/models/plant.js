const {ObjectId} = require("mongodb");
const postCollection = require("../../config/mongodbConnection").getCollection("hello");

// const plant = {
//     location:{type:String,require:true},
//     description:{type:String,require:true},
//     nickname:{type:String,require:true},
//     height:Number,
//     spread:Number,
//     categery:Number,
//     sunExposure:{type:String,require:true},
//     time:Date,
// }

exports.save = async(plant)=>{
    try{
        const col = await postCollection();
        plant._id=plant.name;
        const result = await col.insertOne(plant);
        return result.ops && result.ops[0];
    }catch (e) {
        throw "save data failed"
    }
}
exports.findAll = async(plant)=>{
    try{
        const col = await postCollection();
        return col.find({}).toArray();
    }catch (e) {
        throw "find all data failed"
    }
}
exports.findById = async(id)=>{
    try{
        const col = await postCollection();
        return col.findOne({_id:id});
    }catch (e) {
        return null;
    }
}
exports.update = async (id,plant)=>{
    try{
        const col = await postCollection();
        const result = await col.findOneAndUpdate(
            {_id:ObjectId(id)},
            {$set:post},
            {returnOriginal:false}
        );
        return result.value;
    }catch{
        throw "update detail failed"
    }
}
exports.delete = async (id)=>{
    try{
        const col = await postCollection();
        await col.deleteOne({_id:ObjectId(id)});
    }catch{
        throw "delete detail failed"
    }
}
module.exports = {
    //plant,
    ...exports,
};