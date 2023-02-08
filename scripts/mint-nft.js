require("dotenv").config()

const API_URL = process.env.ALCHEMY_API_KEY
const PUBLIC_KEY = process.env.PUBKEY
const PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(`https://eth-goerli.alchemyapi.io/v2/${API_URL}`)

const contract = require("../artifacts/contracts/SimpleNFT.sol/SimpleNFT.json")
const contractAddress = "0x27b7d408EC354594fE04725e6dd41Cc6Ee6c41e0"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log("Promise failed:", err)
    })
}

mintNFT("ipfs://QmRXrMr6VheH6ArtP1dTxLk9EPKtmDwd7YNJ59y75Rqc7F")
