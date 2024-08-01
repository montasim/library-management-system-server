const routesConstants = {
    admin: {
        routes: 'admin',
        permissions: {
            create: 'create-admin',
        },
    },
    auth: {
        routes: 'auth',
    },
    detect: {
        routes: 'detect',
    },
    trending: {
        routes: 'trending',
    },
    user: {
        routes: 'user',
    },
    books: {
        routes: 'books',
        params: 'bookId',
        permissions: {
            create: 'create-book',
            getList: 'get-book-list',
            getById: 'get-book-by-id',
            updateById: 'update-book-by-id',
            deleteById: 'delete-book-by-id',
            deleteByList: 'delete-book-by-list',
        },
    },
    favouriteBooks: {
        routes: 'favourite',
        params: 'favouriteBookId',
    },
    desiredBooks: {
        routes: 'desired',
    },
    trendingBooks: {
        routes: 'books',
    },
    booksHistory: {
        routes: 'history',
        params: 'bookId',
    },
    lendBooks: {
        routes: 'lend',
        permissions: {
            create: 'create-lend',
            getList: 'get-favourite',
        },
    },
    requestBooks: {
        routes: 'request',
        params: 'favouriteBookId',
        permissions: {
            create: 'create-request',
        },
    },
    returnBooks: {
        routes: 'return',
        params: 'favouriteBookId',
        permissions: {
            create: 'create-return',
        },
    },
    permissions: {
        routes: 'permissions',
        params: 'permissionId',
        permissions: {
            create: 'create-permission',
            getList: 'get-permission-list',
            getById: 'get-permission-by-id',
            updateById: 'update-permission-by-id',
            deleteById: 'delete-permission-by-id',
            deleteByList: 'delete-permission-by-list',
            createDefault: 'create-default-permission',
        },
    },
    pronouns: {
        routes: 'pronouns',
        params: 'pronounsId',
        permissions: {
            create: 'create-pronouns',
            getList: 'get-pronouns-list',
            getById: 'get-pronouns-by-id',
            updateById: 'update-pronouns-by-id',
            deleteById: 'delete-pronouns-by-id',
            deleteByList: 'delete-pronouns-by-list',
        },
    },
    publications: {
        routes: 'publications',
        params: 'publicationId',
        permissions: {
            create: 'create-publication',
            getList: 'get-publication-list',
            getById: 'get-publication-by-id',
            updateById: 'update-publication-by-id',
            deleteById: 'delete-publication-by-id',
            deleteByList: 'delete-publication-by-list',
        },
    },
    roles: {
        routes: 'roles',
        params: 'roleId',
        permissions: {
            create: 'create-role',
            getList: 'get-role-list',
            getById: 'get-role-by-id',
            updateById: 'update-role-by-id',
            deleteById: 'delete-role-by-id',
            deleteByList: 'delete-role-by-list',
            createDefault: 'create-default-role',
        },
    },
    subjects: {
        routes: 'subjects',
        params: 'subjectId',
        permissions: {
            create: 'create-subject',
            getList: 'get-subject-list',
            getById: 'get-subject-by-id',
            updateById: 'update-subject-by-id',
            deleteById: 'delete-subject-by-id',
            deleteByList: 'delete-subject-by-list',
        },
    },
    writers: {
        routes: 'writers',
        params: 'writerId',
        permissions: {
            create: 'create-writer',
            getList: 'get-writer-list',
            getById: 'get-writer-by-id',
            updateById: 'update-writer-by-id',
            deleteById: 'delete-writer-by-id',
            deleteByList: 'delete-writer-by-list',
        },
    },
};

export default routesConstants;
