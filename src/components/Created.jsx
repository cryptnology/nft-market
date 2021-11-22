import HashLoader from 'react-spinners/HashLoader';

const Created = ({ nfts, network, cancel, loading }) => {
  const renderButton = nft => {
    return (
      <>
        <button onClick={() => cancel(nft)} className={`btn-card-cancel`}>
          Cancel
        </button>
      </>
    );
  };
  return (
    <>
      <h1 className='text-xl text-themeBlack text-center mt-6'>Created</h1>
      <div className='grid lg:grid-cols-3 xl:grid-cols-4 gap-4 container px-6 sm:px-16 md:px-20 lg:px-4 mx-auto border-card'>
        {nfts() &&
          nfts().map((nft, i) => (
            <div
              key={i}
              className='text-center text-themeGrey bg-themeBlack rounded-xl overflow-hidden shadow-lg my-10'
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
                {loading ? (
                  <div className='block mt-2 py-8'>
                    <HashLoader color={'#EF4444'} loading={true} size={45} />
                  </div>
                ) : (
                  renderButton(nft)
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Created;
