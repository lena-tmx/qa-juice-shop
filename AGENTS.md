# AI Contributor Instructions

Follow the project architecture and quality rules documented in `CLAUDE.md`.

## Language

Write all repository-facing text in English. This rule is mandatory for:

- commit messages;
- pull request titles and descriptions;
- pull request review comments and GitHub issue comments;
- code comments and TODOs;
- test titles, step names, documentation, CI messages, and generated report text.

The language used by the user in the conversation does not change this rule.

## Test case names

Apply these requirements to every `test()` title, including `qase()` and parameterized
titles:

- Start with a capital letter and use a natural, human-readable English sentence.
- Use a concise behavior and outcome; do not start with `should`.
- Keep every title unique by naming the meaningful scenario variant.
- Answer what, where, and under which condition whenever those details are needed to
  identify the case.
- Do not put internal codes, Qase IDs, endpoint paths, selectors, browsers, environments,
  or lengthy test data in a title unless that detail is the tested behavior.
- Keep names reusable across browsers and environments.
- Describe observable business behavior rather than implementation mechanics. An expected
  HTTP status may be included when it is part of an API contract.

Use concise, capitalized feature names for `test.describe()` groups.

Examples:

- Good: `Login succeeds with valid credentials`
- Good: `User registration returns HTTP 400 for an existing email`
- Good: `Basket is empty after its only product is removed`
- Bad: `should login user`
- Bad: `Auth003`
- Bad: `Login in Chromium`
- Bad: `POST /rest/user/login returns 200`
