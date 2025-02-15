const { MerkleTree } = require('merkletreejs');
const CryptoJS = require('crypto-js');

const addresses = [
  '0x1234567890abcdef1234567890abcdef12345678',
  '0xabcdefabcdefabcdefabcdefabcdefabcdef',
  '0x9876543210abcdef9876543210abcdef98765432',
  '0xfedcba9876543210fedcba9876543210fedcba98',
  '0x11223344556677889900aabbccddeeff11223344',
];

const leaves = addresses.map((address) => CryptoJS.SHA256(address));
const tree = new MerkleTree(leaves, (data) => CryptoJS.SHA256(data));
const root = tree.getRoot().toString('hex');
const testAddress = '0x1234567890abcdef1234567890abcdef12345678';
const testLeaf = CryptoJS.SHA256(testAddress).toString();
const proof = tree.getProof(testLeaf);
// console.log('\nProof for Test Address:', proof.map((p) => p.data.toString('hex')));

// Verify the proof
// Check if the proof matches the root for the test address
const isValid = tree.verify(proof, testLeaf, root);
console.log('\nIs the Test Address Valid?', isValid);

const badLeaf = addresses.map(address => CryptoJS.SHA256(address))
console.log(badLeaf);



// console.log('\nMerkle Tree Structure:\n', tree.toString());