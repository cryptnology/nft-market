require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const infuraApiKey = process.env.INFURA_API_KEY;
const rinkebyRpcUrl = `https://rinkeby.infura.io/v3/${infuraApiKey}`;
const mumbaiRpcUrl = `https://polygon-mumbai.infura.io/v3/${infuraApiKey}`;

// const privateKeys = process.env.PRIVATE_KEYS || '';
const rinkebyPrivateKey = process.env.RINKEBY_PRIVATE_KEY;
const polygonPrivateKey = process.env.POLYGON_PRIVATE_KEY;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },

    rinkeby: {
      provider: function () {
        return new HDWalletProvider([rinkebyPrivateKey], rinkebyRpcUrl);
      },
      network_id: 4,
    },

    mumbai: {
      provider: function () {
        return new HDWalletProvider([polygonPrivateKey], mumbaiRpcUrl);
      },
      network_id: 80001,
    },
  },

  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    polygonscan: process.env.POLYGONSCAN_API_KEY,
  },

  // Configure your compilers
  contracts_build_directory: './src/contracts/',
  compilers: {
    solc: {
      version: '0.8.4', // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  db: {
    enabled: false,
  },
};
