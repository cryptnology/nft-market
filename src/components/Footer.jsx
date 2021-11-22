import { AiFillGithub, AiFillLinkedin, AiOutlineMail } from 'react-icons/ai';

const Footer = () => {
  return (
    <div className='footer text-themeGrey bg-themeBlack'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center py-4'>
          <h1>
            Created at
            <span className='font-bold ml-1.5 social-icons'>
              <a
                href='http://www.cryptnology.dev'
                target='_blank'
                rel='noopener noreferrer'
              >
                cryptnology.dev
              </a>
            </span>
          </h1>
          <div className='flex social-icons social ml-auto'>
            <a
              href='https://github.com/cryptnology'
              target='_blank'
              rel='noopener noreferrer'
            >
              <AiFillGithub size='2.1rem' />
            </a>
          </div>
          <div className='social social-icons'>
            <a
              href='https://www.linkedin.com/in/jamie-anderson-121061200/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <AiFillLinkedin className='mx-4' size='2.1rem' />
            </a>
          </div>
          <div className='social social-icons'>
            <a href='mailto:jamie@cryptnology.dev'>
              <AiOutlineMail size='2.1rem' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
