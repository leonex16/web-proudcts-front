export const handleResponse = async (promise) => {
    const responseStatus = {
        error: null,
        body: null,
        status: 'error',
        statusCode: 400
    };
    try {
        const resp = await promise;
        console.log;
        const json = await resp.json();
        responseStatus.status = 'success';
        responseStatus.statusCode = resp.status;
        responseStatus.body = json;
        return responseStatus;
    }
    catch (error) {
        console.error(error);
        responseStatus.error = error;
        return responseStatus;
    }
};
