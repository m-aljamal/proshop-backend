const filters = (model, populate) => async (req, res, next) => {
  let query;
  /**
   * this is to make select fields in database like just the name or location
   * like this http://localhost:5000/api/bootcamps?select=name,description
   *
   */
  // ? copy req.query
  const reqQuer = { ...req.query };
  // Fields to exclude delete select and sort from the url to get response
  const removeFields = ["select", "sort", "page", "limit"];
  //  Loop over removeFields and delete them for req.query
  removeFields.forEach((param) => delete reqQuer[param]);

  // ? create query string
  let querString = JSON.stringify(reqQuer);

  /**
   * here is the url:
   * lte  http://localhost:5000/api/bootcamps?averageCost[lte]=100
   * gt  http://localhost:5000/api/bootcamps?averageCost[gt]=100
   * and can add another filter like  city = Lowell
   * http://localhost:5000/api/bootcamps?averageCost[in]=500&location.city=Lowell
   * http://localhost:5000/api/bootcamps?averageCost[in]=500&location.city=Lowell&jobGuarantee=false
   * another example http://localhost:5000/api/bootcamps?careers[in]=Business
   */
  // ? create operators ($gt, $gte...)
  // ? when get req.query there is no $ to query in mongo so this will but $ before gt gte le
  querString = querString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // ? finid data

  query = model.find(JSON.parse(querString));
  // make the name of the product found without the full name
  if (req.query.name && req.query.price) {
    query = model.find({
      name: { $regex: req.query.name, $options: "i" },
      price: JSON.parse(querString).price,
    });
  } else if (req.query.name) {
    query = model.find({ name: { $regex: req.query.name, $options: "i" } });
  }
  /**
     * this is to make select fields in database like just the name or location
     * like this http://localhost:5000/api/bootcamps?select=name,description
     *  if the url has select will return array of filds like this only name and description
     *   {
              "_id": "5d725a1b7b292f5f8ceff788",
              "name": "Devcentral Bootcamp",
              "description": "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development"
          },
          {
              "_id": "5d713a66ec8f2b88b8f830b8",
              "name": "ModernTech Bootcamp",
              "description": "ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX"
          },
     *  also can add another filter with same select http://localhost:5000/api/bootcamps?select=name,description&housing=truehttp://localhost:5000/api/bootcamps?select=name,description&housing=true
        only the name and select with housing is true
     */

  // ? Select Fiels
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // sort if the url has sort sort by what is in url if there is no sort will sort by createdAt
  /**
   * sort by  name
   * http://localhost:5000/api/bootcamps?sort=name
   *
   * or  other way
   * http://localhost:5000/api/bootcamps?sort=-name
   */
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  /**
   * Pagination
   * url:
   * http://localhost:5000/api/bootcamps?limit=3
   * http://localhost:5000/api/bootcamps?limit=2&select=name
   * page=1    then page=2   page=3   .....
   * http://localhost:5000/api/bootcamps?page=1&limit=2&select=name
   *
   */
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }
  // ? Executing query
  const results = await query;
  //? Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advancedResult = {
    total: total,
    resultCount: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = filters;
