const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,

    WRITER_MIN: 1,
    WRITER_MAX: 100,

    SUBJECT_MIN: 1,
    SUBJECT_MAX: 100,

    PUBLICATION_MIN: 1,
    PUBLICATION_MAX: 100,

    EDITION_MIN: 1,
    EDITION_MAX: 100,

    SUMMARY_MIN: 100,
    SUMMARY_MAX: 5000,

    FILE_ID: 100,
    SHAREABLE_LINK: 500,
    DOWNLOAD_LINK: 500,

    BEST_SELLER_MIN: 0,
    BEST_SELLER_MAX: 10,

    REVIEW_MIN: 0,
    REVIEW_MAX: 5,
};

const imageSize = 1.1 * 1024 * 1024; // 1.1 MB

const requestBooksConstants = {
    lengths,
    imageSize,
};

export default requestBooksConstants;
