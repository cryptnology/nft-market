import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchData } from '../redux/data/dataActions';
import { updateAccount } from '../redux/blockchain/blockchainActions';
import HashLoader from 'react-spinners/HashLoader';

const Home = ({
  nfts,
  nftMarketContract,
  nftContract,
  web3,
  account,
  network,
}) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const buyNft = async nft => {
    setLoading(true);
    const price = web3.utils.toWei(nft.price.toString(), 'ether');

    try {
      await nftMarketContract.methods
        .createMarketSale(nftContract._address, nft.itemId)
        .send({
          from: account,
          value: price,
        });
      setLoading(false);

      dispatch(fetchData(account));
      updateAccount(dispatch);
      history.push('/assets');
    } catch (error) {
      setLoading(false);
      dispatch(fetchData(account));
      updateAccount(dispatch);
      window.alert(
        'Error buying NFT, please make sure you are not buying your own NFT'
      );
      console.log('Error buying', error);
    }
  };

  const renderButton = nft => {
    return (
      <>
        <button onClick={() => buyNft(nft)} className={`btn-card`}>
          Buy
        </button>
      </>
    );
  };

  const nftsToBeSold = () => {
    if (nfts) return nfts.filter(i => parseInt(i.seller) !== parseInt(account));
  };

  if (nftsToBeSold() && !nftsToBeSold().length)
    return (
      <>
        <h1 className='text-3xl text-themeBlack text-center mt-6'>
          Marketplace
        </h1>
        <div className='flex justify-center items-center h-screen pb-60'>
          <div className='text-center'>
            <h1 className='text-3xl text-themeBlack'>
              No items in marketplace
            </h1>
          </div>
        </div>
      </>
    );

  return (
    <>
      <h1 className='text-3xl text-themeBlack text-center mt-6'>Marketplace</h1>
      {!nftsToBeSold() ? (
        <div className='flex justify-center items-center h-screen pb-60'>
          <HashLoader color={'#202020'} loading={true} size={70} />
        </div>
      ) : (
        <div className='grid lg:grid-cols-3 xl:grid-cols-4 gap-4 container px-6 sm:px-16 md:px-20 lg:px-4 mx-auto'>
          {nftsToBeSold() &&
            nftsToBeSold().map((nft, i) => (
              <div
                key={i}
                className='text-center text-themeGrey bg-themeBlack rounded-xl overflow-hidden shadow-lg mt-10'
              >
                <img
                  src={nft.image}
                  alt='logo'
                  width='160px'
                  height='145px'
                  // className='w-full h-13 md:h-34 object-cover'
                  className='lg:h-96 w-full object-cover object-center'
                />
                <div className='m-4'>
                  <span className='font-bold'>{nft.name}</span>
                  <span className='block mt-4'>{nft.description}</span>
                  <span className='block mt-4'>
                    {nft.price} {network === 'Rinkeby' ? 'ETH' : 'MATIC'}
                  </span>
                  {loading ? (
                    <div className='block mt-2 py-8'>
                      <HashLoader color={'#ffd100'} loading={true} size={45} />
                    </div>
                  ) : (
                    renderButton(nft)
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Home;
