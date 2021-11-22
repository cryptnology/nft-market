//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract NFTMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;
  Counters.Counter private _itemsCancelled;

  address payable owner;
  uint256 listingPrice = 0.025 ether;
  string public name = 'NFT Swap Marketplace';
  string public symbol = 'NSM';

  constructor() {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint256 itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
    bool cancelled;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
    bool cancelled
  );

  event MarketItemSold(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
    bool cancelled
  );

  event MarketItemCancelled(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
    bool cancelled
  );

  /* Returns the current itemId count */
  function currentItemId() external view returns (uint256) {
    uint256 itemId = _itemIds.current();
    return itemId + 1;
  }

  /* Returns the listing price of the contract */
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  /* Places an item for sale on the marketplace */
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, 'Price must be at least 1 wei');
    require(msg.value == listingPrice, 'Price must be equal to listing price');

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToMarketItem[itemId] = MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false,
      false
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false,
      false
    );
  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(address nftContract, uint256 itemId)
    public
    payable
    nonReentrant
  {
    uint256 price = idToMarketItem[itemId].price;
    uint256 tokenId = idToMarketItem[itemId].tokenId;
    require(msg.sender != address(0));
    require(
      msg.sender != idToMarketItem[itemId].seller,
      'Owner owns the item already'
    );
    require(msg.sender.balance >= price, 'Not enough funds in balance');
    require(
      msg.value == price,
      'Please submit the asking price in order to complete the purchase'
    );

    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
    payable(owner).transfer(listingPrice);

    emit MarketItemSold(
      itemId,
      nftContract,
      tokenId,
      address(0),
      msg.sender,
      price,
      true,
      false
    );
  }

  function cancelMarketSale(address nftContract, uint256 itemId)
    public
    payable
    nonReentrant
  {
    uint256 tokenId = idToMarketItem[itemId].tokenId;
    uint256 price = idToMarketItem[itemId].price;
    require(msg.sender == idToMarketItem[itemId].seller, 'Not the owner');

    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

    idToMarketItem[itemId] = MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(address(0)),
      payable(msg.sender),
      price,
      false,
      true
    );

    _itemsCancelled.increment();

    emit MarketItemCancelled(
      itemId,
      nftContract,
      tokenId,
      address(0),
      msg.sender,
      price,
      false,
      true
    );
  }

  /* Allows the resale of a cancelled NFT*/
  function resellItem(uint256 itemId) external {
    require(msg.sender == idToMarketItem[itemId].owner, 'Not the owner');
    idToMarketItem[itemId].cancelled = false;
  }

  /* Returns all unsold market items */
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint256 itemCount = _itemIds.current();
    uint256 unsoldItemCount = _itemIds.current() -
      (_itemsSold.current() + _itemsCancelled.current());
    uint256 currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint256 i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint256 currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _itemIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        idToMarketItem[i + 1].owner == msg.sender &&
        idToMarketItem[i + 1].cancelled == false
      ) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        idToMarketItem[i + 1].owner == msg.sender &&
        idToMarketItem[i + 1].cancelled == false
      ) {
        uint256 currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _itemIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint256 currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has cancelled */
  function fetchItemsCancelled() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _itemIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        idToMarketItem[i + 1].owner == msg.sender &&
        idToMarketItem[i + 1].cancelled == true
      ) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        idToMarketItem[i + 1].owner == msg.sender &&
        idToMarketItem[i + 1].cancelled == true
      ) {
        uint256 currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}
