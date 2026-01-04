import { useState, useMemo, useCallback } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import OrgCard from '../../components/OrgCard/OrgCard';
import Loader from '../../components/Loader/Loader';
import { useOrganizations } from '../../hooks/useOrganizations';
import './Home.css';

const Home = () => {
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedNewOrgYears, setSelectedNewOrgYears] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filters = useMemo(() => ({
        years: selectedYears.length > 0 ? selectedYears.join(',') : undefined,
        newOrgYears: selectedNewOrgYears.length > 0 ? selectedNewOrgYears.join(',') : undefined
    }), [selectedYears, selectedNewOrgYears]);

    const { organizations, loading, error } = useOrganizations(filters);

    const filteredOrgs = useMemo(() => {
        if (!searchQuery.trim()) return organizations;
        
        const query = searchQuery.toLowerCase();
        return organizations.filter(org => 
            org.name.toLowerCase().includes(query) ||
            org.description?.toLowerCase().includes(query) ||
            org.technologies?.some(tech => tech.toLowerCase().includes(query)) ||
            org.category?.toLowerCase().includes(query)
        );
    }, [organizations, searchQuery]);

    const handleYearChange = useCallback((years) => {
        setSelectedYears(years);
        // Clear new org years when selecting regular years
        if (years.length > 0) setSelectedNewOrgYears([]);
    }, []);

    const handleNewOrgYearChange = useCallback((years) => {
        setSelectedNewOrgYears(years);
        // Clear regular years when selecting new org years
        if (years.length > 0) setSelectedYears([]);
    }, []);

    return (
        <div className="home">
            <Header />
            <div className="home-content">
                <Sidebar 
                    selectedYears={selectedYears}
                    onYearChange={handleYearChange}
                    selectedNewOrgYears={selectedNewOrgYears}
                    onNewOrgYearChange={handleNewOrgYearChange}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                <main className="main-content">
                    <div className="main-header">
                        <div className="main-title">
                            <h1>Organizations</h1>
                            <span className="org-count">
                                {filteredOrgs.length} {filteredOrgs.length === 1 ? 'organization' : 'organizations'}
                            </span>
                        </div>
                        <div className="main-controls">
                            <button 
                                className="filter-toggle"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="4" y1="6" x2="20" y2="6"></line>
                                    <line x1="4" y1="12" x2="14" y2="12"></line>
                                    <line x1="4" y1="18" x2="10" y2="18"></line>
                                </svg>
                                Filters
                                {selectedYears.length > 0 && (
                                    <span className="filter-badge">{selectedYears.length}</span>
                                )}
                            </button>
                            <div className="search-box">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input 
                                    type="text"
                                    placeholder="Search organizations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <div className="error-state">
                            <p>Failed to load organizations</p>
                            <span>{error}</span>
                        </div>
                    ) : filteredOrgs.length === 0 ? (
                        <div className="empty-state">
                            <p>No organizations found</p>
                            <span>Try adjusting your filters or search query</span>
                        </div>
                    ) : (
                        <div className="org-grid">
                            {filteredOrgs.map((org, index) => (
                                <OrgCard key={org.name || index} organization={org} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Home;
