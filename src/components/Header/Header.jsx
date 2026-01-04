import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <a href="/" className="logo">
                    <span className="logo-gsoc">GSoC</span>
                    <span className="logo-orgs">Organizations</span>
                </a>
                <nav className="nav">
                    <a href="https://summerofcode.withgoogle.com/" target="_blank" rel="noopener noreferrer">
                        Official GSoC
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
