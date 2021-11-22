const NFTMarket = artifacts.require('NFTMarket');
const NFT = artifacts.require('NFT');
const web3 = require('web3');

require('chai').use(require('chai-as-promised')).should();

contract('NFTMarket', ([deployer, user1, user2]) => {
  let nftMarket;
  let nftMarketAddress;
  let nftAddress;
  let nft;
  let listingPrice;
  let auctionPrice;
  let token1;
  const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
  const name = 'NFT Swap Marketplace';
  const symbol = 'NSM';

  beforeEach(async () => {
    // Deploy contracts
    nftMarket = await NFTMarket.new();
    nftMarketAddress = nftMarket.address;
    nft = await NFT.new(nftMarketAddress);
    nftAddress = nft.address;

    // Get listing price and set auction price
    listingPrice = await nftMarket.getListingPrice();
    listingPrice = listingPrice.toString();
    auctionPrice = web3.utils.toWei('1', 'ether');

    // Create token for deployer
    token1 = await nft.createToken('https://www.mytokenlocation.com', {
      from: deployer,
    });
    // Create token for user1
    await nft.createToken('https://www.mytokenlocation2.com', {
      from: user1,
    });
    await nft.createToken('https://www.mytokenlocation3.com', {
      from: user2,
    });
  });

  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await nftMarket.name();
      result.should.equal(name, 'name is correct');
    });

    it('tracks the symbol', async () => {
      const result = await nftMarket.symbol();
      result.should.equal(symbol, 'symbol is correct');
    });
  });

  describe('puts tokens up for sale', () => {
    let log;

    it('emits a transfer event', async () => {
      log = token1.logs;
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

  describe('executes sale of token to another user', () => {
    let log;

    it('emits a market item sold event', async () => {
      await nftMarket.createMarketItem(nftAddress, 1, auctionPrice, {
        value: listingPrice,
      });
      const soldToken = await nftMarket.createMarketSale(nftAddress, 1, {
        from: user1,
        value: auctionPrice,
      });
      log = soldToken.logs[0];
      log.event.should.eq('MarketItemSold');
      let sold = log.args;
      sold.itemId.toString().should.equal('1', 'item id is correct');
      sold.nftContract.should.equal(nftAddress, 'market address is correct');
      sold.tokenId.toString().should.equal('1', 'token id is correct');
      sold.seller.should.equal(ETHER_ADDRESS, 'address is correct');
      sold.owner.should.equal(user1, 'address is correct');
      sold.price.toString().should.equal(auctionPrice, 'price is correct');
      sold.sold.should.equal(true, 'sold status is correct');
    });
  });

  describe('cancels the sale of a token on the market', () => {
    it('emits a market item cancelled event', async () => {
      await nftMarket.createMarketItem(nftAddress, 1, auctionPrice, {
        from: deployer,
        value: listingPrice,
      });
      await nftMarket.createMarketItem(nftAddress, 2, auctionPrice, {
        from: user1,
        value: listingPrice,
      });

      const cancelSale = await nftMarket.cancelMarketSale(nftAddress, 2, 2, {
        from: user1,
      });

      log = cancelSale.logs[0];
      log.event.should.eq('MarketItemCancelled');
      const cancelled = log.args;
      cancelled.itemId.toString().should.equal('2', 'item id is correct');
      cancelled.nftContract.should.equal(
        nftAddress,
        'market address is correct'
      );
      cancelled.tokenId.toString().should.equal('2', 'token id is correct');
      cancelled.seller.should.equal(ETHER_ADDRESS, 'address is correct');
      cancelled.owner.should.equal(user1, 'address is correct');
      cancelled.price.toString().should.equal('0', 'price is correct');
      cancelled.sold.should.equal(false, 'sold status is correct');
    });
  });

  describe('queries for and returns the items', () => {
    beforeEach(async () => {
      await nftMarket.createMarketItem(nftAddress, 1, auctionPrice, {
        value: listingPrice,
      });
      await nftMarket.createMarketItem(nftAddress, 2, auctionPrice, {
        from: user1,
        value: listingPrice,
      });
      await nftMarket.createMarketItem(nftAddress, 3, auctionPrice, {
        from: user2,
        value: listingPrice,
      });
    });

    it('returns the unsold items', async () => {
      let items = await nftMarket.fetchMarketItems();
      items = await Promise.all(
        items.map(async i => {
          const tokenUri = await nft.tokenURI(i.tokenId);
          let item = {
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            tokenUri,
          };
          return item;
        })
      );
      items[0].price.should.eq(auctionPrice.toString(), 'price is correct');
      items[0].tokenId.should.eq('1', 'token id is correct');
      items[0].seller.should.eq(deployer, 'seller is correct');
      items[0].owner.should.eq(ETHER_ADDRESS, 'owner is correct');
      items[0].tokenUri.should.eq(
        'https://www.mytokenlocation.com',
        'uri is correct'
      );
    });

    it('returns only items that a user has purchased', async () => {
      await nftMarket.createMarketSale(nftAddress, 3, {
        from: user1,
        value: auctionPrice,
      });
      let items = await nftMarket.fetchMyNFTs({ from: user1 });
      items = await Promise.all(
        items.map(async i => {
          const tokenUri = await nft.tokenURI(i.tokenId);
          let item = {
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            tokenUri,
          };
          return item;
        })
      );
      items[0].price.should.eq(auctionPrice.toString(), 'price is correct');
      items[0].tokenId.should.eq('3', 'token id is correct');
      items[0].seller.should.eq(user2, 'seller is correct');
      items[0].owner.should.eq(user1, 'owner is correct');
      items[0].tokenUri.should.eq(
        'https://www.mytokenlocation3.com',
        'uri is correct'
      );
    });

    it('returns only items a user has created', async () => {
      let items = await nftMarket.fetchItemsCreated({ from: user2 });
      items = await Promise.all(
        items.map(async i => {
          const tokenUri = await nft.tokenURI(i.tokenId);
          let item = {
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            tokenUri,
          };
          return item;
        })
      );
      items[0].price.should.eq(auctionPrice.toString(), 'price is correct');
      items[0].tokenId.should.eq('3', 'token id is correct');
      items[0].seller.should.eq(user2, 'seller is correct');
      items[0].owner.should.eq(ETHER_ADDRESS, 'owner is correct');
      items[0].tokenUri.should.eq(
        'https://www.mytokenlocation3.com',
        'uri is correct'
      );
    });
  });
});
