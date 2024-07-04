const getAuthenticationToken = async (header) => {
    const bearer = 'Bearer ';

    return await header?.startsWith(bearer) ? header.slice(bearer.length) : null;
};

export default getAuthenticationToken;
