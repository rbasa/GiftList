const express = require('express');
const { createHash } = require('crypto');
const MerkleTree = require('../utils/MerkleTree');
const verifyProof = require('../utils/verifyProof');
const niceList = require('../utils/niceList.json');

const port = 1225;

const app = express();
app.use(express.json());

// create the leaves of the Merkle tree by hashing each name in the nice list
const leaves = niceList.map(name => createHash('sha256').update(name).digest());

// create the Merkle tree
const merkleTree = new MerkleTree(leaves);

// get the root of the Merkle tree
const root = merkleTree.getRoot().toString('hex');

app.post('/gift', (req, res) => {
  // grab the parameters from the front-end here
  const { name } = req.body;

  // create the merkle tree for the whole nice list
  const merkleTree = new MerkleTree(niceList);

  // get the root
  const root = merkleTree.getRoot();

  // find the proof that norman block is in the list 
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);
  console.log(proof)
  // Verify that the proof is valid
  const isValidProof= verifyProof(proof, name, root)

  if (isValidProof) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
