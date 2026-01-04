import { useNavigate } from 'react-router-dom';
import './OrgCard.css';

const OrgCard = ({ organization }) => {
    const navigate = useNavigate();
    const { name, description, logo, category, technologies, years, stats, summary } = organization;

    const handleClick = () => {
        navigate(`/org/${encodeURIComponent(name)}`);
    };

    const getStatusColor = (status) => {
        if (status === 'Highly Active') return 'status-high';
        if (status === 'Active') return 'status-active';
        return 'status-low';
    };

    return (
        <div className="org-card" onClick={handleClick}>
            <div className="org-card-header">
                <div className="org-logo">
                    {logo ? (
                        <img src={logo} alt={name} onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                        <div className="org-logo-placeholder">{name.charAt(0).toUpperCase()}</div>
                    )}
                </div>
                <div className="org-info">
                    <h3 className="org-name">{name}</h3>
                    {category && <span className="org-category">{category}</span>}
                </div>
            </div>

            <p className="org-description">
                {description?.length > 120 ? `${description.substring(0, 120)}...` : description}
            </p>

            <div className="org-tech">
                {technologies?.slice(0, 4).map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                ))}
                {technologies?.length > 4 && (
                    <span className="tech-more">+{technologies.length - 4}</span>
                )}
            </div>

            <div className="org-footer">
                <div className="org-years">
                    <span className="years-count">{stats?.yearsParticipated || years?.length || 0}</span>
                    <span className="years-label">years</span>
                </div>
                <div className={`org-status ${getStatusColor(stats?.status)}`}>
                    {stats?.status || 'Unknown'}
                </div>
            </div>

            {summary?.returnLikelihoodScore && (
                <div className="org-likelihood">
                    <div className="likelihood-bar">
                        <div 
                            className="likelihood-fill" 
                            style={{ width: `${summary.returnLikelihoodScore}%` }}
                        ></div>
                    </div>
                    <span className="likelihood-text">{summary.returnLikelihood}</span>
                </div>
            )}
        </div>
    );
};

export default OrgCard;
