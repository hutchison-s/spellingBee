const mongoose = require("mongoose");
const { Schema } = mongoose;

const wordSchema = new Schema({
    word: String,
    part_of_speech: String,
    definition: String,
    etymology: String,
    example_sentence: String,
    gradeLevel: Number
})

const Words = mongoose.model("Words", wordSchema, 'words');

module.exports = Words;

