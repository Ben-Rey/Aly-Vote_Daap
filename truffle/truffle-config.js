const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");
require("dotenv").config();

module.exports = {
  contracts_build_directory: path.join(__dirname, "../client/src/contracts"),

  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*" // Any network (default: none)
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: { phrase: `${process.env.MNEMONIC}` },
          providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`
        });
      },
      network_id: 3
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: { phrase: `${process.env.MNEMONIC}` },
          providerOrUrl: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`
        });
      },
      network_id: 42
    },
    mumbai: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: { phrase: `${process.env.MNEMONIC}` },
          providerOrUrl: `https://rpc-mumbai.maticvigil.com`
        });
      },
      network_id: 80001,
      gasPrice: 7000000000
    }
  },
  plugins: ["solidity-coverage"],
  // Set default mocha options here, use special reporters, etc.
  mocha: {
    timeout: 100000,
    reporter: "eth-gas-reporter"
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        }
        //  evmVersion: "byzantium"
      }
    }
  }
};
