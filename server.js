const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 9090;

//Connection string
const atlasDataBase = 'testdb';
const connectionString = `mongodb+srv://eldirecto:eldirecto@cluster0.gcdzr.mongodb.net/${atlasDataBase}?retryWrites=true&w=majority`;
const {Schema} = mongoose;

//Initialize Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Create a function(async) to connect to the database
const connectDB = async function () {
    try {
        await mongoose.connect(connectionString, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });

        console.log('Database Connected');
    } catch (error) {
        console.error(error.message);

        //Exit with failure
        process.exit(1);
    }
};

connectDB();

//Schema
const myDataSchema = new Schema({
    name: String,
    email: String,
    country: String,
    age: Number
});

//Creating a new collection called myData in the database(testdb)
const myData = mongoose.model('mydata', myDataSchema);

//Creating a new document in mydata collection
myData.create({
    name: "Prince Igbatayo",
    email: "princeigbatayo@gmail.com",
    country: "Floor 1",
    age: 424
}, (err, data) => {
    if (err) throw err;
    console.log({newData: data});
});

//Creating a basic express route
app.get('/', (req, res) => res.json({message: "Welcome to my App!"}));

//Reading/Fetching all of the created data
app.get('/mydatas', (req, res) => {
    myData.find({}, (err, result) => {
        if (err) {
            return res.status(500).json({message: err});
        } else {
            return res.status(200).json({message: "Request Successful!", data: result});
        }
    });
});

//Updating only one of the created data
app.put('/mydatas/:id', (req, res) => {
    myData.findByIdAndUpdate(req.params.id, {email: req.body.email}, (err, content) => {
        if (err) {
            return res.status(500).json({message: err});
        } else if (!content) {
            return res.status(404).json({message: "Data not found"});
        } else {
            content.save((err, savedResult) => {
                if (err) {
                    return res.status(400).json({message: err});
                } else {
                    return res.status(200).json({message: "Data Updated Successfully!", data: savedResult});
                }
            });
        };
    });
});

//Deleting only one of the created data
app.delete('/mydatas/:id', (req, res) => {
    myData.findByIdAndDelete(req.params.id, (err, content) => {
        if (err) {
            return res.status(500).json({message: err});
        } else if (!content) {
            return res.status(404).json({message: "Data was not found"});
        } else {
            return res.status(200).json({message: "Data Deleted Successfully!"});
        }
    });
});

app.listen(port, () => console.log('App connected'));