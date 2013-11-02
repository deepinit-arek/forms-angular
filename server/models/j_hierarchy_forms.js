var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var HierarchyElement = new Schema({
    elementNo: {type: Number, required: true, form:{label : 'Element No', hidden: true}},
    parent: { type: Number, form: {hidden: true} },
    order: {type: Number, form: {hidden: true}},
    displayStatus: {type: Boolean, form: {hidden: true}},

    label: {type : String},
    dataType: {type: String, enum:['text', 'textarea', 'container', 'array']}

}, {_id: false});

var HierarchyStructureSchema = new Schema({
    // elements : {type:[CareplanElement]}
    Name: {type: String,required: true, index:true,list:{}},
    Hierarchy: {type: [HierarchyElement], form: {hierarchy: true}}
});
         
var HierarchyStructure;

var modelName = 'HierarchyStructure';
try {
    HierarchyStructure = mongoose.model(modelName)
} catch (e) {
    HierarchyStructure = mongoose.model('HierarchyStructure', HierarchyStructureSchema)
}

module.exports = {
    model: HierarchyStructure,
    schema: HierarchyStructureSchema, 
    elements: HierarchyElement
}


