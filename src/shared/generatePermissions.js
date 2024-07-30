const generatePermissions = (routes) => {
    let permissions = [];

    // Iterate over each route in the routes object
    for (const key in routes) {
        const route = routes[key];

        // Extract specific permissions from each route
        if (route.permissions) {
            for (const action in route.permissions) {
                // Directly use the predefined permission strings
                permissions.push(route.permissions[action]);
            }
        }
    }

    return permissions;
};

export default generatePermissions;
