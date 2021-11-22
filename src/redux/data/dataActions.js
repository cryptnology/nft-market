import store from '../store';
import axios from 'axios';

const fetchDataRequest = () => {
  return {
    type: 'CHECK_DATA_REQUEST',
  };
};

const fetchDataSuccess = payload => {
  return {
    type: 'CHECK_DATA_SUCCESS',
    payload: payload,
  };
};

const fetchDataFailed = payload => {
  return {
    type: 'CHECK_DATA_FAILED',
    payload: payload,
  };
};

export const fetchData = account => {
  return async dispatch => {
    dispatch(fetchDataRequest());
    try {
      let allMarketItems = await store
        .getState()
        .blockchain.nftMarketContract.methods.fetchMarketItems()
        .call({ from: account });

      allMarketItems = await Promise.all(
        allMarketItems.map(async i => {
          const tokenUri = await store
            .getState()
            .blockchain.nftContract.methods.tokenURI(i.tokenId)
            .call();
          const meta = await axios.get(tokenUri);
          let price = store
            .getState()
            .blockchain.web3.utils.fromWei(i.price.toString(), 'ether');
          let item = {
            price,
            itemId: parseInt(i.tokenId),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            sold: i.sold,
            cancelled: i.cancelled,
          };

          return item;
        })
      );

      let marketItemsPurchased = await store
        .getState()
        .blockchain.nftMarketContract.methods.fetchMyNFTs()
        .call({ from: account });

      marketItemsPurchased = await Promise.all(
        marketItemsPurchased.map(async i => {
          const tokenUri = await store
            .getState()
            .blockchain.nftContract.methods.tokenURI(i.tokenId)
            .call();
          const meta = await axios.get(tokenUri);
          let price = store
            .getState()
            .blockchain.web3.utils.fromWei(i.price.toString(), 'ether');
          let item = {
            price,
            itemId: parseInt(i.tokenId),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            sold: i.sold,
            cancelled: i.cancelled,
          };

          return item;
        })
      );

      let marketItemsCreated = await store
        .getState()
        .blockchain.nftMarketContract.methods.fetchItemsCreated()
        .call({ from: account });

      marketItemsCreated = await Promise.all(
        marketItemsCreated.map(async i => {
          const tokenUri = await store
            .getState()
            .blockchain.nftContract.methods.tokenURI(i.tokenId)
            .call();
          const meta = await axios.get(tokenUri);
          let price = store
            .getState()
            .blockchain.web3.utils.fromWei(i.price.toString(), 'ether');
          let item = {
            price,
            itemId: parseInt(i.tokenId),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            sold: i.sold,
            cancelled: i.cancelled,
          };

          return item;
        })
      );

      let marketItemsCancelled = await store
        .getState()
        .blockchain.nftMarketContract.methods.fetchItemsCancelled()
        .call({ from: account });

      marketItemsCancelled = await Promise.all(
        marketItemsCancelled.map(async i => {
          const tokenUri = await store
            .getState()
            .blockchain.nftContract.methods.tokenURI(i.tokenId)
            .call();
          const meta = await axios.get(tokenUri);
          let price = store
            .getState()
            .blockchain.web3.utils.fromWei(i.price.toString(), 'ether');
          let item = {
            price,
            itemId: parseInt(i.tokenId),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            sold: i.sold,
            cancelled: i.cancelled,
          };

          return item;
        })
      );

      dispatch(
        fetchDataSuccess({
          allMarketItems,
          marketItemsPurchased,
          marketItemsCreated,
          marketItemsCancelled,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed('Could not load data from contract.'));
    }
  };
};
