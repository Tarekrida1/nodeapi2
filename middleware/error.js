const ErrorResponse = require("../untils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // log for dev
    console.log(err.red);

    // mongoose bag ObjectId
if(err.name === "CastError") {
    const message = `Recourse not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404)
}

    // mongoose Duplicate key
    if(err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400)
    }

    
    // mongoose validation errors
    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400)


    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error !'
    });
}

module.exports = errorHandler;