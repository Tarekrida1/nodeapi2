const { populate } = require("../api/courses/models/Course");

const advancedResults = (model, populate) => async (req, res , next) => {
    let query;

    // copy req.body
    let reqQuery = { ...req.query };
  
      
    // fields to exclude
    const removeFields  = ['select', 'sort', 'page', 'limit'];
  
    // loop over removeFileds and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
  
    // console.log(reqQuery);
    let queryStr = JSON.stringify(reqQuery);
    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  
  
    // console.log(que)
    query = model.find(JSON.parse(queryStr));
    
  
    // select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
      // console.log(fields)
    }
    
     // sort 
     if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // console.log(fields)
    } else {
      query = query.sort('createdAt');
    }
  
    // pagination 
    const page = parseInt(req.query.page , 10) || 1;
    const limit = parseInt(req.query.limit , 10) || 9;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  

  query = query.skip(startIndex).limit(limit);

if(populate) {
    query = query.populate(populate);
}

// Excuting query
  const results = await query;

    // pagination result
  
    const pagination = {};
  
    if(endIndex < total) {
     pagination.next = {
      page: page + 1,
      limit
     }
    }
    if(endIndex > 0 ) {
      pagination.prev = {
       page: page - 1,
       limit
      }
     }
  

     res.advancedResults = {
         success: true,
         count : results.length,
         pagination,
         data: results
     }
  next();
  
    // console.log(req.query)
};


module.exports = advancedResults;