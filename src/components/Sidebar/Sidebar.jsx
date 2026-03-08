import './Sidebar.css';

const Sidebar = ({ selectedYears, onYearChange, selectedNewOrgYears, onNewOrgYearChange, isOpen, onClose }) => {
    const years = ['2026', '2025', '2024', '2023'];
    const newOrgYears = ['2026', '2025', '2024'];

    const handleYearToggle = (year) => {
        const newYears = selectedYears.includes(year)
            ? selectedYears.filter(y => y !== year)
            : [...selectedYears, year];
        onYearChange(newYears);
    };

    const handleNewOrgYearToggle = (year) => {
        const newYears = selectedNewOrgYears.includes(year)
            ? selectedNewOrgYears.filter(y => y !== year)
            : [...selectedNewOrgYears, year];
        onNewOrgYearChange(newYears);
    };

    const clearFilters = () => {
        onYearChange([]);
        onNewOrgYearChange([]);
    };

    const hasActiveFilters = selectedYears.length > 0 || selectedNewOrgYears.length > 0;

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Filters</h3>
                    {hasActiveFilters && (
                        <button className="clear-btn" onClick={clearFilters}>
                            Clear all
                        </button>
                    )}
                </div>

                <div className="filter-section">
                    <h4>Participated In Years</h4>
                    <p className="filter-hint">Show orgs that participated in ALL selected years</p>
                    <div className="filter-options">
                        {years.map(year => (
                            <label key={year} className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={selectedYears.includes(year)}
                                    onChange={() => handleYearToggle(year)}
                                    disabled={selectedNewOrgYears.length > 0}
                                />
                                <span className="checkmark"></span>
                                <span className="year-label">GSoC {year}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <h4>New Organizations</h4>
                    <p className="filter-hint">Show orgs that ONLY participated in selected years (no earlier history)</p>
                    <div className="filter-options">
                        {newOrgYears.map(year => (
                            <label key={`new-${year}`} className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={selectedNewOrgYears.includes(year)}
                                    onChange={() => handleNewOrgYearToggle(year)}
                                    disabled={selectedYears.length > 0}
                                />
                                <span className="checkmark"></span>
                                <span className="year-label">Only in {year}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="active-filters">
                        {selectedYears.length > 0 && (
                            <>
                                <p>Showing orgs that participated in ALL of:</p>
                                <div className="filter-tags">
                                    {selectedYears.sort((a, b) => b - a).map(year => (
                                        <span key={year} className="filter-tag">
                                            {year}
                                            <button onClick={() => handleYearToggle(year)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                        {selectedNewOrgYears.length > 0 && (
                            <>
                                <p>Showing NEW orgs that ONLY appeared in:</p>
                                <div className="filter-tags new-org-tags">
                                    {selectedNewOrgYears.sort((a, b) => b - a).map(year => (
                                        <span key={year} className="filter-tag new-org-tag">
                                            {year}
                                            <button onClick={() => handleNewOrgYearToggle(year)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
