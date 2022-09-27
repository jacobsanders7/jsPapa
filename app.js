const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')
var port = 3000;

const app = express()
app.use(express.json())



let db

connectToDb((err) => {
  if (!err) {
    app.listen(3000,() => {
      console.log("Server is running...")
    })
    db = getDb()
  }
})
  

// routes / route handler
 app.get('/names', (req,res) => {
  let names = []

  db.collection('names')
  .find()
  .sort({name:1})
  .forEach(name => names.push(name))
  .then(() => {
    res.status(200).json(names)
  })
  .catch(() => {
    res.status(500).json({error: 'Could not fetch the documents'})
  })
 })  


app.get('/names/:id', (req, res) => {

      let names = []
    if (ObjectId.isValid(req.params.id)){
      db.collection('names')
      .findOne({_id: ObjectId(req.params.id)})
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'could not fetch the documents'})
      })
    } else {
      res.status(500).json({error: 'Not a valid doc id'})
    }

   })

   app.post('/names', (req, res) => {
    const name = req.body

    db.collection('names')
    .insertOne(name)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({err: "Could not create new document"})
    })
   })
   
   
  app.delete('/names/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) { 
      db.collection('names')
      .deleteOne({_id: ObjectId(req.params.id)})
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'could not delete the document'})
      })
    } else {
      res.status(500).json({error: 'Not a valid doc id'})
    }
  
  })

  app.patch('/names/:id', (req, res) =>{
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) { 
      db.collection('names')
      .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'could not update the document'})
      })
    } else {
      res.status(500).json({error: 'Not a valid doc id'})
    }

  })
