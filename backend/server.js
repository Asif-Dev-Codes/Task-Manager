// const express = require('express');
// const { errorHandler } = require('./middleware/errorMiddleware');
// const connectDB = require('./connect/database');
// const mongoose = require('mongoose');  
// const dotenv = require('dotenv').config();

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));


// const port = process.env.PORT || 5000;

// connectDB();
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use("/api/tasks", require("./routes/taskRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));

// app.use(errorHandler);

// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });

const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./connect/database');

const app = express();

// Load environment variables first
if (dotenv.error) {
    console.error("Error loading .env file:", dotenv.error);
}

// Connect to Database
connectDB();

// Middleware
app.use(express.json());                    // Important for parsing JSON body
app.use(express.urlencoded({ extended: true }));  // Good for form data too

// Routes
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Error Handler (should be last)
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});