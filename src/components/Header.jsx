import { Link } from 'react-router-dom';
import logo from '../images/cryptnology.jpeg';

const Header = ({
  account,
  nftMarketContract,
  dispatch,
  connect,
  network,
  balance,
}) => {
  const blockchainExplorerURL = account => {
    if (network === 'Rinkeby') {
      return `https://rinkeby.etherscan.io/address/${account}`;
    } else if (network === 'Kovan') {
      return `https://kovan.etherscan.io/address/${account}`;
    } else return `https://mumbai.polygonscan.com/address/${account}`;
  };

  const menu = e => {
    e.preventDefault();
    const menu = document.querySelector('#menu');

    if (menu.classList.contains('hidden')) menu.classList.remove('hidden');
    else menu.classList.add('hidden');
  };

  return (
    <div className='bg-themeOrange text-themeBlack sticky'>
      <div className='container mx-auto px-4'>
        {account && nftMarketContract ? (
          <nav className='py-5'>
            <div className='flex items-center'>
              <div className='cursor-pointer lg:hidden mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 hover:text-themeYellow'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  onClick={e => menu(e)}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </div>
              <img
                className='mr-3 rounded-full h-7 w-7 hidden lg:inline-flex'
                alt='logo'
                src={logo}
              />
              <h1 className='uppercase font-bold mr-3'>NFT Market</h1>
              <div className='hidden lg:inline-flex'>
                <ul className='flex'>
                  <li className='mr-3'>
                    <Link className='hover:text-themeYellow' to='/home'>
                      <span>Home</span>
                    </Link>
                  </li>
                  <li className='mr-3 hover:text-themeYellow'>
                    <Link to='/create'>
                      <span>Sell</span>
                    </Link>
                  </li>
                  <li className='mr-3 hover:text-themeYellow'>
                    <Link to='/assets'>
                      <span>My Assets</span>
                    </Link>
                  </li>
                  <li className='mr-3 hover:text-themeYellow'>
                    <Link to='/dashboard'>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <ul className='flex items-center ml-auto'>
                <li className='mr-3 hidden lg:inline-flex'>{network}</li>
                <li className='mr-1 hidden sm:inline-flex'>{balance}</li>
                <li className='mr-3 hidden sm:inline-flex font-bold'>
                  {network === 'Rinkeby' ? 'ETH' : 'MATIC'}
                </li>
                <li>
                  <a
                    href={blockchainExplorerURL(account)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn border-themeBlack border-4 mr-3 hover:bg-themeBlack hover:text-themeOrange'
                  >
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                  </a>
                </li>
                <li>
                  <a
                    href={'/'}
                    onClick={() => {
                      window.location.reload();
                    }}
                    className='btn border-themeBlack border-4 hover:bg-themeBlack hover:text-themeOrange'
                  >
                    Disconnect
                  </a>
                </li>
              </ul>
            </div>
            <div className='hidden lg:hidden' id='menu'>
              <ul className='flex justify-center'>
                <li className=' mr-4 mt-4' onClick={e => menu(e)}>
                  <Link className='hover:text-themeYellow' to='/home'>
                    <span>Home</span>
                  </Link>
                </li>
                <li
                  className='mr-4 mt-4 hover:text-themeYellow'
                  onClick={e => menu(e)}
                >
                  <Link to='/create'>
                    <span>Sell</span>
                  </Link>
                </li>
                <li
                  className='mr-4 mt-4 hover:text-themeYellow'
                  onClick={e => menu(e)}
                >
                  <Link to='/assets'>
                    <span>My Assets</span>
                  </Link>
                </li>
                <li
                  className='mr-4 mt-4 hover:text-themeYellow'
                  onClick={e => menu(e)}
                >
                  <Link to='/dashboard'>
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        ) : (
          <nav className='py-5'>
            <div className='flex items-center'>
              <img
                className='mr-3 rounded-full h-7 w-7'
                alt='logo'
                src={logo}
              />
              <h1>
                <a
                  href='http://www.cryptnology.dev'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-themeYellow uppercase font-bold'
                >
                  NFT Market
                </a>
              </h1>
              <ul className='flex ml-auto'>
                <li>
                  <a
                    href={'/#'}
                    onClick={e => {
                      e.preventDefault();
                      dispatch(connect());
                    }}
                    className=' btn border-themeBlack border-4 hover:bg-themeBlack hover:text-themeOrange'
                  >
                    Connect
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Header;
