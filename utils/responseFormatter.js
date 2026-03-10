

const { HTTP_STATUS } = require('../config/constants');


const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};


const errorResponse = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};


const paginatedResponse = (res, message, items, pagination) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data: items,
    pagination: {
      total: pagination.total,
      limit: pagination.limit,
      offset: pagination.offset,
      hasMore: pagination.hasMore,
      currentPage: Math.floor(pagination.offset / pagination.limit) + 1,
      totalPages: Math.ceil(pagination.total / pagination.limit)
    }
  });
};


const createdResponse = (res, message, data) => {
  return successResponse(res, HTTP_STATUS.CREATED, message, data);
};


const noContentResponse = (res) => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};


const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(
    res,
    HTTP_STATUS.NOT_FOUND,
    `${resource} not found`,
    [{ field: 'id', message: `The requested ${resource.toLowerCase()} does not exist` }]
  );
};


const unauthorizedResponse = (res, message = 'Authentication required') => {
  return errorResponse(
    res,
    HTTP_STATUS.UNAUTHORIZED,
    message,
    [{ field: 'authentication', message }]
  );
};


const forbiddenResponse = (res, message = 'Access denied') => {
  return errorResponse(
    res,
    HTTP_STATUS.FORBIDDEN,
    message,
    [{ field: 'authorization', message }]
  );
};


const badRequestResponse = (res, message, errors = []) => {
  return errorResponse(res, HTTP_STATUS.BAD_REQUEST, message, errors);
};


const conflictResponse = (res, message) => {
  return errorResponse(
    res,
    HTTP_STATUS.CONFLICT,
    message,
    [{ field: 'conflict', message }]
  );
};

const serverErrorResponse = (res, message = 'Internal server error') => {
  return errorResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message,
    [{ field: 'server', message }]
  );
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  conflictResponse,
  serverErrorResponse
};
