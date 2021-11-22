import { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from './redux/blockchain/blockchainActions';
import { fetchData } from './redux/data/dataActions';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import CreateItem from './components/CreateItem';
import UserItems from './components/UserItems';
import Dashboard from './components/Dashboard';
import Connect from './components/Connect';

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector(state => state.blockchain);
  const data = useSelector(state => state.data);

  useEffect(() => {
    if (
      blockchain.account !== '' &&
      blockchain.nftMarketContract !== null &&
      blockchain.nftContract !== null
    ) {
      dispatch(fetchData(blockchain.account));
    }
  }, [
    blockchain.nftMarketContract,
    blockchain.nftContract,
    blockchain.account,
    dispatch,
  ]);

  return (
    <div className='font-body mt-24'>
      <Header
        account={blockchain.account}
        nftMarketContract={blockchain.nftMarketContract}
        dispatch={dispatch}
        connect={connect}
        network={blockchain.network}
        balance={blockchain.balance}
      />
      <div>
        {blockchain.account === '' || blockchain.nftMarketContract === null ? (
          <Connect errorMsg={blockchain.errorMsg} />
        ) : (
          <Switch>
            <Route path='/dashboard'>
              <Dashboard
                nfts={data.marketItemsCreated}
                cancelledNfts={data.marketItemsCancelled}
                account={blockchain.account}
                nftMarketContract={blockchain.nftMarketContract}
                nftContract={blockchain.nftContract}
                web3={blockchain.web3}
                network={blockchain.network}
              />
            </Route>
            <Route path='/assets'>
              <UserItems
                nfts={data.marketItemsPurchased}
                account={blockchain.account}
                network={blockchain.network}
              />
            </Route>
            <Route path='/create'>
              <CreateItem
                account={blockchain.account}
                nftMarketContract={blockchain.nftMarketContract}
                nftContract={blockchain.nftContract}
                web3={blockchain.web3}
                network={blockchain.network}
              />
            </Route>
            <Route path='/home'>
              <Home
                nfts={data.allMarketItems}
                nftMarketContract={blockchain.nftMarketContract}
                nftContract={blockchain.nftContract}
                web3={blockchain.web3}
                account={blockchain.account}
                network={blockchain.network}
              />
            </Route>
            <Redirect from='/' exact to='/home' />
          </Switch>
        )}
        <div className='pt-28'>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
