const EMAIL =
    /^(?!.*\btemp\b)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const MOBILE = /^(?:\+88|88)?(01[3-9]\d{8})$/;

const PASSWORD =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

const ISO_8601_DATE =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(Z|[+-]\d{2}:\d{2})$/s;

const UPPERCASE = /[A-Z]/;

const LOWERCASE = /[a-z]/;

const DIGITS = /\d/;

const SPECIAL_CHARACTERS = /[\s~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?()._]/;

const patterns = {
    EMAIL,
    MOBILE,
    PASSWORD,
    ISO_8601_DATE,
    UPPERCASE,
    LOWERCASE,
    DIGITS,
    SPECIAL_CHARACTERS,
};

export default patterns;
