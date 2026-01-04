import axios from 'axios';

const API_BASE_URL = 'https://gsoc-orgs-backend.onrender.com/api';

export const sendChatMessage = async (orgName, messages) => {
    const response = await axios.post(`${API_BASE_URL}/chat/${encodeURIComponent(orgName)}`, {
        messages
    });
    return response.data;
};

export const sendQuickQuestion = async (orgName, question) => {
    const response = await axios.post(`${API_BASE_URL}/chat/${encodeURIComponent(orgName)}/quick`, {
        question
    });
    return response.data;
};

export const getSuggestedQuestions = async (orgName) => {
    const response = await axios.get(`${API_BASE_URL}/chat/${encodeURIComponent(orgName)}/suggestions`);
    return response.data;
};
