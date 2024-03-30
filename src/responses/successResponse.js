import httpStatusCodes from 'http-status-codes';

const okResponse = (res, data, message, metaData) => {
    return commonResponse(res, data, message, metaData, httpStatusCodes.OK);
};

const createdResponse = (res, data, message, metaData) => {
    return commonResponse(res, data, message, metaData, httpStatusCodes.CREATED);
};

const commonResponse = (res, data, message, metaData, statusCode) => {
    res.statusCode = statusCode;

    const formattedResponse = {
        success: true,
        message: message ? message : undefined,
        result: data ? {
            data: data,
        } : undefined,
        metaData: metaData ? metaData : undefined,
    };

    return res.json(formattedResponse);

};

export { okResponse, createdResponse };
