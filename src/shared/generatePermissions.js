const generatePermissions = (actions, routes) => {
    const validRoutes = Object.values(routes).map(route => route.routes);
    const permissions = actions.flatMap(action => validRoutes.map(route => `${action}-${route}`));

    console.log('permissions', permissions);

    return permissions;
};

export default generatePermissions;
