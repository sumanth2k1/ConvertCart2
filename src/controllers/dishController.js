const MenuItem = require("../database/models/MenuItem");

exports.searchDishes = async (req, res) => {
    try {
        const { name, minPrice, maxPrice } = req.query;

        // Basic validation
        if (!name || !minPrice || !maxPrice) {
            return res.status(400).json({
                message: 'Query params "name", "minPrice", and "maxPrice" are required'
            });
        }

        const min = Number(minPrice);
        const max = Number(maxPrice);

        if (Number.isNaN(min) || Number.isNaN(max)) {
            return res.status(400).json({
                message: '"minPrice" and "maxPrice" must be valid numbers'
            });
        }

        if (min > max) {
            return res.status(400).json({
                message: '"minPrice" cannot be greater than "maxPrice"'
            });
        }

        // MongoDB aggregation pipeline
        const restaurants = await MenuItem.aggregate([
            {
                $match: {
                    isDeleted: false,
                    name: { $regex: new RegExp(name, 'i') },
                    price: { $gte: min, $lte: max }
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'menuItemId',
                    pipeline: [{ $match: { isDeleted: false } }],
                    as: 'orders'
                }
            },
            { $match: { 'orders.0': { $exists: true } } },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: 'restaurantId',
                    foreignField: '_id',
                    pipeline: [{ $match: { isDeleted: false } }],
                    as: 'restaurant'
                }
            },
            { $unwind: '$restaurant' },
            {
                $project: {
                    _id: 0,
                    restaurantId: '$restaurant._id',
                    restaurantName: '$restaurant.name',
                    city: '$restaurant.city',
                    dishName: '$name',
                    dishPrice: '$price',
                    orderCount: { $sum: '$orders.quantity' }
                }
            },
            { $sort: { orderCount: -1 } },
            { $limit: 10 }
        ]);

        return res.json({ restaurants });
    } catch (err) {
        console.error('Error in searchDishes:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};