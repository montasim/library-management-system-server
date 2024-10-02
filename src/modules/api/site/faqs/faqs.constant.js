const lengths = {
    QUESTION_MIN: 1,
    QUESTION_MAX: 1000,
    ANSWER_MIN: 1,
    ANSWER_MAX: 1000000000,
};

const pattern = {
    name: /^[a-z]+(-[a-z]+)+$/,
};

const faqsConstants = {
    lengths,
    pattern,
};

export default faqsConstants;
