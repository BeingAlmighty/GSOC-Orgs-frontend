import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader">
                <div className="loader-ring"></div>
                <span>Loading organizations...</span>
            </div>
        </div>
    );
};

export default Loader;
