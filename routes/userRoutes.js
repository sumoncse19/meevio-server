const express = require('express');
const router = express.Router();

module.exports = (usersCollections) => {
  router.post('/users', async (req, res) => {
    const user = req.body;
    const result = await usersCollections.insertOne(user);
    res.send(result);
  });

  router.get('/users', async (req, res) => {
    const results = await usersCollections.find().toArray();
    res.send(results);
  });

  router.patch('/users/:email', async (req, res) => {
    const email = req.params.email;
    const { name, photo } = req.body;

    const filter = { email: email };
    const updateDoc = {
      $set: {
        name: name,
        photo: photo,
      },
    };

    const result = await usersCollections.updateOne(filter, updateDoc);
    res.send(result);
  })

  router.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email }
    const result = await usersCollections.findOne(query);
    res.send(result);
  })

  router.patch('/users/plan/:email', async (req, res) => {
    const email = req.params.email;
    const { plan } = req.body;

    const filter = { email: email };
    const updateDoc = {
      $set: {
        plan: plan,
      },
    };

    const result = await usersCollections.updateOne(filter, updateDoc);
    res.send(result);
  })

  return router;
};
