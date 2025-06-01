const axios = require('axios');

const analyzeChatbotMessage = async (message) => {
    try {
        const response = await axios.post(
            'https://api.x.ai/v1/grok',
            {
                prompt: `Phân tích câu hỏi: "${message}". Xác định ý định (intent) và các tham số cần thiết. Trả về JSON: { intent: string, params: object }`,
                context: 'Bạn là chatbot của một cửa hàng trang sức.'
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROK_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return JSON.parse(response.data.choices[0].text);
    } catch (error) {
        throw error.response?.data || { message: 'Không thể kết nối đến Grok API.' };
    }
};

module.exports = { analyzeChatbotMessage };