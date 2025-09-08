const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
console.log('Mongo URI chargé:', uri);

const clientOptions = {
    useNewUrlParser : true,
    dbName : 'apinode'
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}