import Web3 from 'web3';
import nftMarket from '../../contracts/NFTMarket.json';
import nft from '../../contracts/NFT.json';

const connectRequest = () => {
  return {
    type: 'CONNECTION_REQUEST',
  };
};

const connectSuccess = payload => {
  return {
    type: 'CONNECTION_SUCCESS',
    payload: payload,
  };
};

const connectFailed = payload => {
  return {
    type: 'CONNECTION_FAILED',
    payload: payload,
  };
};

const updateAccountRequest = payload => {
  return {
    type: 'UPDATE_ACCOUNT',
    payload: payload,
  };
};

export const connect = () => {
  return async dispatch => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const networkId = await window.ethereum.request({
          method: 'net_version',
        });

        const balance = await web3.eth.getBalance(accounts[0]);
        let network = await web3.eth.net.getNetworkType();
        network = network.charAt(0).toUpperCase() + network.slice(1);
        const nftMarketNetworkData = await nftMarket.networks[networkId];
        const nftNetworkData = await nft.networks[networkId];

        if (nftMarketNetworkData && nftNetworkData) {
          const nftMarketObj = new web3.eth.Contract(
            nftMarket.abi,
            nftMarketNetworkData.address
          );
          const nftObj = new web3.eth.Contract(nft.abi, nftNetworkData.address);
          dispatch(
            connectSuccess({
              account: accounts[0],
              balance: (balance / 10 ** 18).toFixed(5),
              network: network,
              nftMarketContract: nftMarketObj,
              nftContract: nftObj,
              web3: web3,
            })
          );
          // Add listeners start
          window.ethereum.on('accountsChanged', async accounts => {
            const balance = await web3.eth.getBalance(accounts[0]);
            dispatch(
              updateAccountRequest({
                account: accounts[0],
                balance: (balance / 10 ** 18).toFixed(5),
              })
            );
          });
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(
            connectFailed(
              'Change network to Polygon (Mumbai) or Ethereum (Rinkeby).'
            )
          );
        }
      } catch (err) {
        dispatch(connectFailed('Something went wrong.'));
      }
    } else {
      dispatch(connectFailed('Install Metamask.'));
    }
  };
};

export const updateAccount = async dispatch => {
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  const account = await accounts[0];
  const balance = await web3.eth.getBalance(account);
  dispatch(
    updateAccountRequest({ account, balance: (balance / 10 ** 18).toFixed(5) })
  );
};
