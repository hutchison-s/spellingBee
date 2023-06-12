const fs = require('fs')
const { MongoClient } = require('mongodb')
require('dotenv').config()

// Adds all words from a JSON file with a property "words" that has a value of an array of word objects"
async function addAllFromFile(collection, fileName) {
    const file = await JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    for await (const word of file.words) {
        const result = await collection.insertOne(word);
        console.log(`New listing created with the following id: ${result.insertedId}`)
    }
}

// Finds and reports duplicate words in the collection
async function findDuplicates(collection) {
    const totalWords = await collection.distinct("word");
    const totalDocs = await collection.find().toArray()
    console.log(`There are ${totalDocs.length} documents and ${totalWords.length} unique words.`)
    if (totalWords.length !== totalDocs.length) {
        console.log(`Here are the ${totalDocs.length - totalWords.length} duplicated words:`)
        for await (let word of totalWords) {
            const array = await collection.find({word: word}).toArray();
            if (await array.length > 1) {
                console.log(`Found duplicate: ${word}`)
            }
        }
    } else {
        console.log("No duplicates found.")
    }
}

// Delete all documents matching the provided filter criteria
async function deleteMatches(collection, match) {
    const result = await collection.deleteMany(match)
    console.log(`${result.deletedCount} records deleted.`)
}

// Change name of collection
async function changeName(collection, newName) {
    const result = await collection.rename(newName)
    console.log(result)
}

async function main() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect()
        await findDuplicates(client.db("SpellingBeeWords").collection("words"))
    } catch (err) {
        console.error(err);
    } finally {
        await client.close()
    }
    
}

main().catch(console.error)