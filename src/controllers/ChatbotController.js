// controllers/ChatbotController.js
const CategoryService = require('../services/CategoryService');
const ProductService = require('../services/ProductService');
const OrderService = require('../services/OrderService');
const NewsService = require('../services/NewsService');
const StoreService = require('../services/StoreService');

const handleChatbotRequest = async (req, res) => {
    const { message, userId } = req.body;

    try {
        // Mock Grok API response
        const grokResponse = {
            data: {
                choices: [
                    {
                        text: JSON.stringify({
                            intent: (() => {
                                const msg = message.toLowerCase();
                                if (msg.includes('categories')) return 'get_categories';
                                if (msg.includes('products') && (msg.includes('greater') || msg.includes('more than'))) return 'search_products_by_price';
                                if (msg.includes('products')) return 'get_products';
                                if (msg.includes('order')) return 'get_order';
                                if (msg.includes('news') || msg.includes('what’s new') || msg.includes('what is new')) return 'get_news';
                                if (msg.includes('store') || msg.includes('contact')) return 'get_store_info';
                                return 'default';
                            })(),
                            params: (() => {
                                const msg = message.toLowerCase();
                                if (msg.includes('greater') || msg.includes('more than')) {
                                    const match = msg.match(/(\d+)/);
                                    return { price: match ? parseFloat(match[0]) : 0 };
                                }
                                return {};
                            })(),
                        }),
                    },
                ],
            },
        };

        const { intent, params } = JSON.parse(grokResponse.data.choices[0].text);

        let responseMessage;
        switch (intent) {
            case 'get_categories':
                try {
                    const categories = await CategoryService.getAllCategory();
                    if (!categories.data || !Array.isArray(categories.data)) {
                        responseMessage = 'No categories available at the moment.';
                    } else {
                        const categoryList = categories.data.map(c => c.categoryName || 'Unnamed Category').join(', ');
                        const count = categories.data.length;
                        responseMessage = `We have ${count} ${count === 1 ? 'category' : 'categories'}: ${categoryList}.`;
                    }
                } catch (error) {
                    console.error('Error fetching categories:', error.message);
                    responseMessage = 'Unable to fetch categories. Please try again!';
                }
                break;
            case 'get_products':
                try {
                    const products = await ProductService.getAllProduct();
                    if (!products.data || !Array.isArray(products.data)) {
                        responseMessage = 'No products available at the moment.';
                    } else {
                        responseMessage = `All products: ${products.data.map(p => p.productName).join(', ')}.`;
                    }
                } catch (error) {
                    console.error('Error fetching products:', error);
                    responseMessage = 'Unable to fetch products. Please try again!';
                }
                break;
            case 'search_products_by_price':
                try {
                    const price = params.price || 0;
                    const products = await ProductService.getAllProduct();
                    const filteredProducts = products.data.filter(p => p.productPrice > price);
                    if (!filteredProducts.length) {
                        responseMessage = `No products found with price greater than ${price} VND.`;
                    } else {
                        responseMessage = `Products with price greater than ${price} VND: ${filteredProducts.map(p => `${p.productName} - ${p.productPrice} VND`).join(', ')}.`;
                    }
                } catch (error) {
                    console.error('Error searching products by price:', error);
                    responseMessage = 'Unable to search products. Please try again!';
                }
                break;
            case 'get_order':
                if (!userId || userId === 'guest') {
                    responseMessage = 'Please log in to check your order information.';
                } else {
                    try {
                        console.log('userId', userId)
                        const orders = await OrderService.getOrdersByUser(userId);
                        console.log('orders', orders)
                        if (!orders.data || !orders.data.length) {
                            responseMessage = 'You have no orders.';
                        } else {
                            responseMessage = `Your orders: ${orders.data.map(o => `#${o.orderCode} (${o.status})`).join(', ')}.`;
                        }
                    } catch (error) {
                        console.error('Error fetching orders:', error);
                        responseMessage = 'Unable to fetch order information. Please try again!';
                    }
                }
                break;
            case 'get_news':
                try {
                    const news = await NewsService.getAllNews();
                    if (!news.data || !news.data.length) {
                        responseMessage = 'No news available at the moment.';
                    } else {
                        responseMessage = `Latest news: ${news.data.map(n => n.newsTitle).join(', ')}.`;
                    }
                } catch (error) {
                    console.error('Error fetching news:', error);
                    responseMessage = 'Unable to fetch news. Please try again!';
                }
                break;
            case 'get_store_info':
                try {
                    const stores = await StoreService.getAllStores();
                    if (!stores.data || !stores.data.length) {
                        responseMessage = 'No store information available.';
                    } else {
                        responseMessage = `Contact information: ${stores.data.map(s => `${s.storeName} - ${s.storePhone}, ${s.storeEmail}`).join('; ')}.`;
                    }
                } catch (error) {
                    console.error('Error fetching store info:', error);
                    responseMessage = 'Unable to fetch store information. Please try again!';
                }
                break;
            default:
                responseMessage = 'Sorry, I don’t understand your question. Please try again!';
        }

        console.log('Response message:', responseMessage);
        return res.status(200).json({ message: String(responseMessage) });
    } catch (error) {
        console.error('Error in ChatbotController:', error.message);
        return res.status(500).json({ message: 'Sorry, an error occurred. Please try again!' });
    }
};

module.exports = { handleChatbotRequest };