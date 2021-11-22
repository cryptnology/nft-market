import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from '../redux/data/dataActions';
import { updateAccount } from '../redux/blockchain/blockchainActions';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import HashLoader from 'react-spinners/HashLoader';
import Created from './Created';
import Sold from './Sold';
import Cancelled from './Cancelled';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const Dashboard = ({
  nfts,
  cancelledNfts,
  account,
  nftMarketContract,
  nftContract,
  web3,
  network,
}) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const cancelNft = async nft => {
    setLoading(true);

    try {
      await nftMarketContract.methods
        .cancelMarketSale(nftContract._address, nft.itemId)
        .send({
          from: account,
        });
      setLoading(false);
      dispatch(fetchData(account));
      updateAccount(dispatch);
    } catch (error) {
      setLoading(false);
      dispatch(fetchData(account));
      updateAccount(dispatch);
      window.alert(
        'Error cancelling NFT, please make sure you are not cancelling an NFT you do not own'
      );
      console.log('Error cancelling', error);
    }
  };

  const createSale = async nft => {
    setLoading(true);
    const { name, description, price, image } = nft;
    const data = JSON.stringify({
      name,
      description,
      image,
    });

    try {
      await nftMarketContract.methods
        .resellItem(nft.itemId)
        .send({ from: account });
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // /* next, create the item */
      await nftContract.methods.createToken(url).send({ from: account });
      /* then list the item for sale on the marketplace */
      const itemId = await nftMarketContract.methods.currentItemId().call();

      let listingPrice = await nftMarketContract.methods
        .getListingPrice()
        .call();
      listingPrice = listingPrice.toString();

      const formattedPrice = web3.utils.toWei(price, 'ether');

      await nftMarketContract.methods
        .createMarketItem(nftContract._address, itemId, formattedPrice)
        .send({
          from: account,
          value: listingPrice,
        });
      setLoading(false);
      dispatch(fetchData(account));
      updateAccount(dispatch);
    } catch (error) {
      setLoading(false);
      dispatch(fetchData(account));
      updateAccount(dispatch);
      window.alert('Error creating NFT, Please try again');
      console.log('Error uploading file: ', error);
    }
  };

  const createdNfts = () => {
    const emptyAddress = '0x0000000000000000000000000000000000000000';
    if (nfts)
      return nfts.filter(i => i.owner === emptyAddress && i.sold !== true);
  };

  const soldNfts = () => {
    if (nfts && cancelledNfts) return nfts.filter(i => i.sold);
  };

  if (nfts && !nfts.length && !cancelledNfts.length)
    return (
      <>
        <h1 className='text-3xl text-themeBlack text-center mt-6'>Dashboard</h1>
        <div className='flex justify-center items-center h-screen pb-60'>
          <div className='text-center'>
            <h1 className='text-3xl text-themeBlack'>You have no NFTs</h1>
          </div>
        </div>
      </>
    );

  return (
    <>
      <h1 className='text-3xl text-themeBlack text-center mt-6'>Dashboard</h1>
      {!nfts ? (
        <div className='flex justify-center items-center h-screen pb-60'>
          <HashLoader color={'#202020'} loading={true} size={70} />
        </div>
      ) : (
        <>
          {createdNfts().length ? (
            <Created
              nfts={createdNfts}
              network={network}
              cancel={cancelNft}
              loading={loading}
            />
          ) : null}
          {soldNfts().length ? (
            <Sold nfts={soldNfts()} network={network} />
          ) : null}
          {cancelledNfts.length ? (
            <Cancelled
              nfts={cancelledNfts}
              resell={createSale}
              loading={loading}
              network={network}
            />
          ) : null}
        </>
      )}
    </>
  );
};

export default Dashboard;
