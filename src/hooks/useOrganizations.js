import { useState, useEffect } from 'react';
import { fetchOrganizations } from '../api/organizations';

export const useOrganizations = (filters = {}) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create a stable string representation of filters for dependency tracking
    const filterKey = JSON.stringify(filters);

    useEffect(() => {
        const loadOrganizations = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchOrganizations(filters);
                setOrganizations(data.data || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch organizations');
            } finally {
                setLoading(false);
            }
        };

        loadOrganizations();
    }, [filterKey]);

    return { organizations, loading, error };
};
