import HashLoader from 'react-spinners/HashLoader';

const UserItems = ({ nfts, network }) => {
  const purchasedNfts = () => {
    if (nfts) return nfts.filter(i => i.sold);
  };

  if (purchasedNfts() && !purchasedNfts().length)
    return (
      <>
        <h1 className='text-3xl text-themeBlack text-center mt-6'>Your NFTs</h1>
        <div className='flex justify-center items-center h-screen pb-60'>
          <div className='text-center'>
            <h1 className='text-3xl text-themeBlack'>You have no NFTs</h1>
          </div>
        </div>
      </>
    );

  return (
    <>
      <h1 className='text-3xl text-themeBlack text-center mt-6'>Your NFTs</h1>
      {!purchasedNfts() ? (
        <div className='flex justify-center items-center h-screen pb-60'>
          <HashLoader color={'#202020'} loading={true} size={70} />
        </div>
      ) : (
        <div className='grid lg:grid-cols-3 xl:grid-cols-4 gap-4 container px-6 sm:px-16 md:px-20 lg:px-4 mx-auto'>
          {purchasedNfts() &&
            purchasedNfts().map((nft, i) => (
              <div
                key={i}
                className='text-center text-themeGrey bg-themeBlack rounded-xl overflow-hidden shadow-lg mt-10'
              >
                <img
                  src={nft.image}
                  alt='logo'
                  width='160px'
                  height='145px'
                  className='lg:h-96 w-full object-cover object-center'
                />
                <div className='m-4'>
                  <span className='font-bold'>{nft.name}</span>
                  <span className='block mt-4'>{nft.description}</span>
                  <span className='block mt-4'>
                    {nft.price} {network === 'Rinkeby' ? 'ETH' : 'MATIC'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default UserItems;
