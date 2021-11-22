const NFTMarket = artifacts.require('NFTMarket');
const NFT = artifacts.require('NFT');

require('chai').use(require('chai-as-promised')).should();

contract('NFT', ([deployer]) => {
  let nftMarket;
  let nftMarketAddress;
  let nft;
  let nftAddress;
  const name = 'NFT Swap';
  const symbol = 'NSWAP';
  let token;
  const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach(async () => {
    // Deploy contracts
    nftMarket = await NFTMarket.new();
    nftMarketAddress = nftMarket.address;
    nft = await NFT.new(nftMarketAddress);
    nftAddress = nft.address;

    // Creates a token
    token = await nft.createToken('https://www.mytokenlocation.com', {
      from: deployer,
    });
  });

  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await nft.name();
      result.should.equal(name, 'name is correct');
    });

    it('tracks the symbol', async () => {
      const result = await nft.symbol();
      result.should.equal(symbol, 'symbol is correct');
    });
  });

  describe('creates tokens', () => {
    let log;

    it('emits a transfer event', async () => {
      log = token.logs;
      let transfer = log[0];
      transfer.event.should.eq('Transfer');
      transfer = log[0].args;
      transfer.from.should.eq(ETHER_ADDRESS, 'from is correct');
      transfer.to.should.eq(deployer, 'to is correct');
      transfer.tokenId.toString().should.eq('1');
    });

    it('emits an approval event', async () => {
      let approval = log[1];
      approval.event.should.eq('ApprovalForAll');
      approval = log[1].args;
      approval.owner.should.eq(deployer, 'owner is correct');
      approval.approved.should.eq(true, 'is approved');
    });
  });
});
