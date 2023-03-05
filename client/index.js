const axios = require('axios');
const { createHash } = require('crypto');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const verifyProof = require('../utils/verifyProof');

const serverUrl = 'http://localhost:1225';

async function main() {
  // create the leaves of the Merkle tree by hashing each name in the nice list
  const leaves = niceList.map(name => createHash('sha256').update(name).digest());

  // create the Merkle tree
  const merkleTree = new MerkleTree(leaves);

  // get the root of the Merkle tree
  const root = merkleTree.getRoot();

  // find the proof that our name is in the list
  const name = "Sidney Kertzmann";
  const index = niceList.findIndex(n => n === name);
  if (index === -1) {
    console.log('Sorry, your name is not on the nice list.');
    return;
  }
  const proof = merkleTree.getProof(index);

  // verify the proof with the server
  try {
    const { data: gift } = await axios.post(`${serverUrl}/gift`, { name, proof, root });
    console.log('Gift:', gift);
    // console.log('Proof:', proof);
    // console.log('Root:', root);
  } catch (error) {
    console.error(error.response.data);
  }
}

main();
