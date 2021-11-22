const NFTMarket = artifacts.require('NFTMarket');
const NFT = artifacts.require('NFT');

module.exports = function (deployer) {
  // First deploy NFTMarket then use NFTMarket address in NFT contructor
  deployer.deploy(NFTMarket).then(() => {
    return deployer.deploy(NFT, NFTMarket.address);
  });
};
