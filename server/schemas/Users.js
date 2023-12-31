const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    authLevel: Number,
    name: String,
    email: String,
    sub: String,
    gamerName: String,
    gameData: {
        spelling: {
            score: Number,
            level: Number,
            correctWords: [
                {
                    word: String,
                    definition: String,
                    part_of_speech: String,
                    etymology: String,
                    example_sentence: String,
                    gradeLevel: Number
                }
            ],
            wrongWords: [
                {
                    word: String,
                    definition: String,
                    part_of_speech: String,
                    etymology: String,
                    example_sentence: String,
                    gradeLevel: Number
                }
            ]
        },
        definitions: {
            score: Number,
            level: Number,
            correctWords: [
                {
                    word: String,
                    definition: String,
                    part_of_speech: String,
                    etymology: String,
                    example_sentence: String,
                    gradeLevel: Number
                }
            ],
            wrongWords: [
                {
                    word: String,
                    definition: String,
                    part_of_speech: String,
                    etymology: String,
                    example_sentence: String,
                    gradeLevel: Number
                }
            ]
        },
        compare: {
            score: Number,
            level: Number,
            correctWords: [
                {
                    word: String,
                    definition: String,
                    part_of_speech: String,
                    etymology: String,
                    example_sentence: String,
                    gradeLevel: Number
                }
            ],
            wrongWords: [
                {
                    word: String,
                    definition: String,
                    part_of_speech: String,
                    etymology: String,
                    example_sentence: String,
                    gradeLevel: Number
                }
            ]
        }
    }
})

const Users = mongoose.model("Users", userSchema, 'users');

module.exports = Users;