import httpStatusCodes from 'http-status-codes';

const badRequestResponse = (res, message, error) => {
    return commonResponse(res, message, error, httpStatusCodes.BAD_REQUEST);
};

const unauthorisedResponse = (res, message, error) => {
    return commonResponse(res, message, error, httpStatusCodes.UNAUTHORIZED);
};

const notFoundResponse = (res, message, error) => {
    return commonResponse(res, message, error, httpStatusCodes.NOT_FOUND);
};

const internalServerErrorResponse = (res, message, error) => {
    return commonResponse(res, message, error, httpStatusCodes.INTERNAL_SERVER_ERROR);
};

const unauthenticatedResponse = (res, message, error) => {
    return commonResponse(res, message, error, httpStatusCodes.FORBIDDEN);
};

const commonResponse = (res, message, error, statusCode) => {
    res.statusCode = statusCode;

    const formattedResponse = {
        success: false,
        message: message ? message : undefined,
        error: error ? error.message : undefined,
    };
    return res.json(formattedResponse);

};

export {
    badRequestResponse,
    unauthorisedResponse,
    notFoundResponse,
    internalServerErrorResponse,
    unauthenticatedResponse
};
