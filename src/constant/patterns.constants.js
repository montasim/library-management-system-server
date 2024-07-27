const EMAIL =
    /^(?!.*\btemp\b)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const MOBILE = /^(?:\+8801|01)[3-9]\d{8}$/;

const PASSWORD =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

const ISO_8601_DATE =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(Z|[+-]\d{2}:\d{2})$/s;

const UPPERCASE = /[A-Z]/;

const LOWERCASE = /[a-z]/;

const DIGITS = /\d/;

const SPECIAL_CHARACTERS = /[\s~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?()._]/;

/**
 * Regular expression for validating well-formed URLs.
 *
 * This pattern supports both HTTP and HTTPS protocols and can validate standard web URLs.
 * It covers the following parts of a URL:
 * - Optional protocol (HTTP or HTTPS)
 * - Domain name (supports subdomains)
 * - Top-level domain (minimum 2, maximum 6 letters)
 * - Optional path (can include letters, numbers, underscores, slashes, dots, and hyphens)
 * - Optional trailing slash
 *
 * It does not cover URL port numbers, query parameters, or anchor tags.
 *
 * @example
 * // Returns true for valid URLs
 * console.log(isValidUrl("http://www.example.com")); // true
 * console.log(isValidUrl("https://example.com/about")); // true
 *
 * // Returns false for invalid URLs
 * console.log(isValidUrl("www.example.com")); // false (no protocol)
 * console.log(isValidUrl("example")); // false (not a valid URL)
 *
 * @param {string} url The URL string to be validated.
 * @returns {boolean} Returns true if the URL matches the pattern, false otherwise.
 */
const URL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/**
 * Regular expression for validating Facebook URLs.
 *
 * This pattern checks for URLs that correctly represent Facebook user profiles or pages. It supports both
 * HTTPS and HTTP protocols and allows optional 'www.' It validates URLs that direct to a user's profile
 * via a username (e.g., https://www.facebook.com/username) or via the profile ID
 * (e.g., https://facebook.com/profile.php?id=123456789).
 *
 * @example
 * console.log(isValidFacebookUrl("https://www.facebook.com/username")); // true
 * console.log(isValidFacebookUrl("https://facebook.com/profile.php?id=123456789")); // true
 * console.log(isValidFacebookUrl("https://facebook.com/username")); // true
 * console.log(isValidFacebookUrl("http://www.facebook.com/username")); // true
 * console.log(isValidFacebookUrl("www.facebook.com/username")); // false, missing protocol
 * console.log(isValidFacebookUrl("https://facebook.com/")); // false, missing username
 *
 * @param {string} url The Facebook URL to be validated.
 * @returns {boolean} Returns true if the URL is a valid Facebook URL, false otherwise.
 */
const FACEBOOK_URL =
    /^(https?:\/\/)(www\.)?facebook\.com\/(profile\.php\?id=\d+|[a-zA-Z0-9\.-]+)$/;

/**
 * Regular expression for validating Twitter URLs.
 *
 * This pattern ensures that the URL is a valid Twitter profile link. It supports both
 * HTTPS and HTTP protocols and does not require 'www.' It specifically checks for URLs that
 * lead to a user profile, which generally follow the format of https://twitter.com/username.
 * The username must consist of alphanumeric characters or underscores, and cannot start with a number.
 *
 * Examples of valid Twitter URLs:
 * - https://twitter.com/username
 * - https://www.twitter.com/username
 * - http://twitter.com/username
 * - http://www.twitter.com/username
 *
 * Examples of invalid Twitter URLs:
 * - http://twitter.com/username/ (extra slash)
 * - https://twitter.com/ (missing username)
 * - https://twitter.com/username/subpage (extra path elements)
 *
 * @example
 * console.log(isValidTwitterUrl("https://twitter.com/username")); // true
 * console.log(isValidTwitterUrl("https://www.twitter.com/username123")); // true
 * console.log(isValidTwitterUrl("https://twitter.com/")); // false
 * console.log(isValidTwitterUrl("https://twitter.com/username/extra")); // false
 *
 * @param {string} url The Twitter URL to be validated.
 * @returns {boolean} Returns true if the URL is a valid Twitter URL, false otherwise.
 */
const TWITTER_URL = /^(https?:\/\/)(www\.)?twitter\.com\/([a-zA-Z0-9_]+)(\/)?$/;

/**
 * Regular expression for validating LinkedIn URLs.
 *
 * This pattern checks URLs that are intended to point to LinkedIn profiles or company pages. It supports both
 * HTTPS and HTTP protocols and includes optional 'www.' The URL must specifically lead to either a user profile
 * with '/in/' followed by a username, or a company page with '/company/' followed by the company name.
 * Usernames and company names can contain alphanumeric characters, dashes, and underscores.
 *
 * Examples of valid LinkedIn URLs:
 * - https://www.linkedin.com/in/username
 * - https://linkedin.com/in/username-123
 * - http://www.linkedin.com/company/company-name
 * - https://linkedin.com/company/company_name123
 *
 * Examples of invalid LinkedIn URLs:
 * - https://linkedin.com/username (incorrect path)
 * - http://www.linkedin.com/in/ (missing username)
 * - https://linkedin.com/company/ (missing company name)
 *
 * @example
 * console.log(isValidLinkedinUrl("https://www.linkedin.com/in/username")); // true
 * console.log(isValidLinkedinUrl("https://linkedin.com/company/company-name")); // true
 * console.log(isValidLinkedinUrl("https://linkedin.com/in/")); // false
 * console.log(isValidLinkedinUrl("https://www.linkedin.com/username")); // false
 *
 * @param {string} url The LinkedIn URL to be validated.
 * @returns {boolean} Returns true if the URL is a valid LinkedIn URL, false otherwise.
 */
const LINKEDIN_URL =
    /^(https?:\/\/)(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9_-]+|company\/[a-zA-Z0-9_-]+)$/;

/**
 * Regular expression for validating GitHub URLs.
 *
 * This pattern ensures that the URL points to either a GitHub user profile or a repository. It supports both
 * HTTPS and HTTP protocols and optionally includes 'www.' The URL must specifically lead to a user profile
 * or a repository, which are typically structured as https://github.com/username or
 * https://github.com/username/repository. Usernames and repository names can include alphanumeric characters,
 * dashes, and underscores.
 *
 * Examples of valid GitHub URLs:
 * - https://github.com/username
 * - https://www.github.com/username
 * - http://github.com/username/repository
 * - https://github.com/username/repo-name
 *
 * Examples of invalid GitHub URLs:
 * - https://github.com/ (missing username)
 * - http://github.com/username/ (trailing slash with no repository)
 * - https://github.com/username//repo (incorrect path formatting)
 *
 * @example
 * console.log(isValidGithubUrl("https://github.com/username")); // true
 * console.log(isValidGithubUrl("https://github.com/username/repository")); // true
 * console.log(isValidGithubUrl("https://github.com/username/")); // false
 * console.log(isValidGithubUrl("https://github.com//username")); // false
 *
 * @param {string} url The GitHub URL to be validated.
 * @returns {boolean} Returns true if the URL is a valid GitHub URL, false otherwise.
 */
const GITHUB_URL =
    /^(https?:\/\/)(www\.)?github\.com\/([a-zA-Z0-9_-]+)(\/[a-zA-Z0-9_-]+)?\/?$/;

const patterns = {
    EMAIL,
    MOBILE,
    PASSWORD,
    ISO_8601_DATE,
    UPPERCASE,
    LOWERCASE,
    DIGITS,
    SPECIAL_CHARACTERS,
    URL,
    FACEBOOK_URL,
    TWITTER_URL,
    LINKEDIN_URL,
    GITHUB_URL,
};

export default patterns;
