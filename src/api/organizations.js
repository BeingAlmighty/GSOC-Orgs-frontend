import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchOrganizations = async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.year) params.append('year', filters.year);
    if (filters.years) params.append('years', filters.years);
    if (filters.newOrgYears) params.append('newOrgYears', filters.newOrgYears);
    if (filters.category) params.append('category', filters.category);
    if (filters.technology) params.append('technology', filters.technology);
    if (filters.limit) params.append('limit', filters.limit);
    
    const url = `${API_BASE_URL}/organizations${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Fetching organizations with URL:', url);
    
    const response = await axios.get(url);
    console.log('Response count:', response.data?.count);
    return response.data;
};

export const fetchOrganizationByName = async (name) => {
    const response = await axios.get(`${API_BASE_URL}/organizations/${encodeURIComponent(name)}`);
    return response.data;
};

export const fetchOrganizationStats = async () => {
    const response = await axios.get(`${API_BASE_URL}/organizations/stats`);
    return response.data;
};
