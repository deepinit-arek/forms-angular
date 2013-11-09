var mongoose = require('mongoose')
    , fngHierarchy = require('../lib/fng-hierarchy-plugin')
    , Schema = mongoose.Schema;

var PartsElement = new Schema({
    description: {type : String, required: true, list:{}, form:{size:'medium'}},
    sku: {type: String, form:{showIf:{lhs:'$parts.fngh_isContainer', comp:'ne', rhs:true}, size:'medium', label:'SKU'}},
    qty: {type: Number, form:{showIf:{lhs:'$parts.fngh_isContainer', comp:'ne', rhs:true}}}
}, {_id: false});

PartsElement.plugin(fngHierarchy, null);

var JSchema = new Schema({
    name: {type: String, required: true, index:true, list:{}},
    parts: {type: [PartsElement], form: {hierarchy: true}}
});

var J;
try {J = mongoose.model('J') } catch(e) {J = mongoose.model('J', JSchema)}

module.exports = J;