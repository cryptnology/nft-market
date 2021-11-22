import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchData } from '../redux/data/dataActions';
import { updateAccount } from '../redux/blockchain/blockchainActions';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import HashLoader from 'react-spinners/HashLoader';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const CreateItem = ({
  nftMarketContract,
  nftContract,
  web3,
  account,
  network,
}) => {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });

  const history = useHistory();
  const dispatch = useDispatch();

  const onChange = async e => {
    setLoading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: prog => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setLoading(false);
      setFileUrl(url);
    } catch (error) {
      setLoading(false);
      setFileUrl(null);
      window.alert('Please add an Image');
      console.log('Error uploading file: ', error);
    }
  };

  const createMarket = async () => {
    setLoading(true);
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on to blochchain*/
      setLoading(false);
      createSale(url);
    } catch (error) {
      setLoading(false);
      dispatch(fetchData(account));
      updateAccount(dispatch);
      window.alert('Error creating NFT, Please try again');
      console.log('Error uploading file: ', error);
    }
  };

  const createSale = async url => {
    setLoading(true);

    try {
      /* next, create the item */
      await nftContract.methods.createToken(url).send({ from: account });
      /* then list the item for sale on the marketplace */
      const itemId = await nftMarketContract.methods.currentItemId().call();

      const price = web3.utils.toWei(formInput.price, 'ether');
      let listingPrice = await nftMarketContract.methods
        .getListingPrice()
        .call();
      listingPrice = listingPrice.toString();

      await nftMarketContract.methods
        .createMarketItem(nftContract._address, itemId, price)
        .send({
          from: account,
          value: listingPrice,
        });
      setLoading(false);
      dispatch(fetchData(account));
      updateAccount(dispatch);
      history.push('/dashboard');
    } catch (error) {
      setLoading(false);
      dispatch(fetchData(account));
      updateAccount(dispatch);
      window.alert('Error creating NFT, Please try again');
      console.log('Error uploading file: ', error);
    }
  };

  const completedForm = () => {
    return formInput.name.length &&
      formInput.description.length &&
      formInput.price.length
      ? true
      : false;
  };

  const renderButton = () => {
    return (
      <button
        onClick={createMarket}
        className='btn-card mx-auto font-bold mt-4'
      >
        Create your NFT
      </button>
    );
  };

  return (
    <div className='flex px-4 md:px-16 lg:px-24 xl:px-44 justify-center items-center'>
      <div className='md:w-full lg:w-4/5 xl:w-3/5 flex flex-col p-12 rounded-lg bg-themeBlack text-themeGrey'>
        <h1 className='text-2xl text-themeOrange text-center'>Create an NFT</h1>
        <input
          placeholder='Name'
          className='mt-8 border rounded p-4 text-themeBlack'
          type='text'
          required
          onChange={e =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder='Description'
          className='mt-2 border rounded p-4 text-themeBlack'
          type='text'
          required
          onChange={e =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder={`Price eg. 0.1 ${
            network === 'Rinkeby' ? 'ETH' : 'MATIC'
          }`}
          className='mt-2 border rounded p-4 text-themeBlack'
          type='number'
          required
          onChange={e =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type='file' name='Asset' className='my-4' onChange={onChange} />
        <div className='flex justify-center'>
          {fileUrl && (
            <img className='rounded my-3' width='350' src={fileUrl} alt='' />
          )}
        </div>
        {loading ? (
          <div className='mt-9 mx-auto'>
            <HashLoader color={'#ffd100'} loading={true} size={45} />
          </div>
        ) : (
          completedForm() && fileUrl && renderButton()
        )}
      </div>
    </div>
  );
};

export default CreateItem;
