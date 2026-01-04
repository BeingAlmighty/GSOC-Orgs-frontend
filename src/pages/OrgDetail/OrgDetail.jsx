import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrganizationByName } from '../../api/organizations';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import ChatModal from '../../components/ChatModal/ChatModal';
import './OrgDetail.css';

const OrgDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const loadOrganization = async () => {
            try {
                setLoading(true);
                const data = await fetchOrganizationByName(name);
                setOrganization(data.data);
            } catch (err) {
                setError(err.message || 'Failed to load organization');
            } finally {
                setLoading(false);
            }
        };

        loadOrganization();
    }, [name]);

    if (loading) {
        return (
            <div className="org-detail">
                <Header />
                <Loader />
            </div>
        );
    }

    if (error || !organization) {
        return (
            <div className="org-detail">
                <Header />
                <div className="error-container">
                    <h2>Organization not found</h2>
                    <button onClick={() => navigate('/')}>Back to Home</button>
                </div>
            </div>
        );
    }

    const { 
        description, url, logo, category, technologies, topics, 
        years, yearDetails, stats, summary 
    } = organization;

    return (
        <div className="org-detail">
            <Header />
            <main className="detail-content">
                <div className="detail-top-bar">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Organizations
                    </button>
                    <button className="chat-btn" onClick={() => setIsChatOpen(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Talk to {name}
                    </button>
                </div>

                <div className="detail-header">
                    <div className="detail-logo">
                        {logo ? (
                            <img src={logo} alt={name} onError={(e) => e.target.style.display = 'none'} />
                        ) : (
                            <div className="logo-placeholder">{name.charAt(0).toUpperCase()}</div>
                        )}
                    </div>
                    <div className="detail-info">
                        <h1>{name}</h1>
                        {category && <span className="detail-category">{category}</span>}
                        {url && (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="detail-url">
                                {url}
                            </a>
                        )}
                    </div>
                </div>

                <div className="detail-grid">
                    <div className="detail-main">
                        <section className="detail-section">
                            <h2>About</h2>
                            <p className="description">{description}</p>
                            {summary?.about && (
                                <p className="summary-text">{summary.about}</p>
                            )}
                        </section>

                        {summary?.history && (
                            <section className="detail-section">
                                <h2>GSoC History</h2>
                                <p className="summary-text">{summary.history}</p>
                            </section>
                        )}

                        {summary?.prediction && (
                            <section className="detail-section prediction-section">
                                <h2>2026 Prediction</h2>
                                <div className="prediction-card">
                                    <div className="prediction-header">
                                        <span className="prediction-label">Return Likelihood</span>
                                        <span className="prediction-value">{summary.returnLikelihood}</span>
                                    </div>
                                    <div className="prediction-bar">
                                        <div 
                                            className="prediction-fill" 
                                            style={{ width: `${summary.returnLikelihoodScore}%` }}
                                        ></div>
                                    </div>
                                    <p className="prediction-text">{summary.prediction}</p>
                                    {summary.projectTrend && (
                                        <div className="trend-info">
                                            <span>Project Trend: </span>
                                            <span className={`trend-${summary.projectTrend}`}>
                                                {summary.projectTrend === 'increasing' ? '📈 Increasing' : 
                                                 summary.projectTrend === 'decreasing' ? '📉 Decreasing' : 
                                                 summary.projectTrend === 'stable' ? '➡️ Stable' : 
                                                 '❓ Insufficient Data'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        <section className="detail-section">
                            <h2>Year-by-Year Breakdown</h2>
                            <div className="years-timeline">
                                {years?.map(year => (
                                    <div key={year} className="year-item">
                                        <div className="year-badge">{year}</div>
                                        <div className="year-details">
                                            <span className="project-count">
                                                {yearDetails?.[year]?.projectsCount || 0} projects
                                            </span>
                                            {yearDetails?.[year]?.projectsUrl && (
                                                <a 
                                                    href={yearDetails[year].projectsUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="projects-link"
                                                >
                                                    View Projects →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="detail-sidebar">
                        <section className="sidebar-section">
                            <h3>Statistics</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-value">{stats?.yearsParticipated || 0}</span>
                                    <span className="stat-label">Years</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats?.totalProjects || 0}</span>
                                    <span className="stat-label">Total Projects</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats?.avgProjectsPerYear || 0}</span>
                                    <span className="stat-label">Avg/Year</span>
                                </div>
                            </div>
                            <div className={`status-badge ${stats?.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                {stats?.status}
                            </div>
                        </section>

                        <section className="sidebar-section">
                            <h3>Technologies</h3>
                            <div className="tags-container">
                                {technologies?.map((tech, index) => (
                                    <span key={index} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        </section>

                        {topics?.length > 0 && (
                            <section className="sidebar-section">
                                <h3>Topics</h3>
                                <div className="tags-container">
                                    {topics?.map((topic, index) => (
                                        <span key={index} className="topic-tag">{topic}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="sidebar-section">
                            <h3>Quick Links</h3>
                            <div className="quick-links">
                                {url && (
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="quick-link">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                        Official Website
                                    </a>
                                )}
                                {yearDetails?.[years?.[0]]?.projectsUrl && (
                                    <a 
                                        href={yearDetails[years[0]].projectsUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="quick-link"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                        </svg>
                                        Latest GSoC Projects
                                    </a>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </main>

            <ChatModal 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                orgName={name}
                orgData={organization}
            />
        </div>
    );
};

export default OrgDetail;
