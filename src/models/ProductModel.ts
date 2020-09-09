import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 65,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const ProductModel = mongoose.model('Product', ProductSchema);
export default ProductModel;
