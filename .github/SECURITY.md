# Security Policy

## Supported Versions

Security updates are provided for the latest development branch and the latest stable release.

| Branch         | Supported |
| :------------- | :-------: |
| `develop`      |    ✅     |
| `main`         |    ✅     |
| Older releases |    ❌     |

---

## Reporting a Vulnerability

If you discover a security vulnerability, **please do not create a public GitHub issue.**

Instead, report it privately to the project maintainers with:

- A description of the vulnerability.
- Steps to reproduce.
- Potential impact.
- Suggested mitigation (if known).
- Proof of Concept (if available).

The maintainers will:

1. Acknowledge receipt of the report.
2. Investigate and validate the issue.
3. Develop and test a fix.
4. Coordinate responsible disclosure.
5. Credit the reporter (if desired).

---

## Scope

Examples of vulnerabilities include, but are not limited to:

- Authentication bypass
- Authorization or privilege escalation
- JWT/session vulnerabilities
- Password handling issues
- SQL injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Remote Code Execution (RCE)
- Arbitrary file upload
- Path traversal
- Sensitive information disclosure
- Insecure object references (IDOR)
- Rate limiting failures
- Security misconfiguration

---

## Out of Scope

The following are generally considered out of scope unless they lead to a demonstrable security impact:

- UI or visual bugs
- Typographical errors
- Missing HTTP security headers without an exploit
- Outdated dependencies with no known exploit path
- Denial-of-Service attacks requiring unrealistic resources
- Issues affecting unsupported branches

---

## Disclosure Policy

Please allow the maintainers reasonable time to investigate and resolve reported vulnerabilities before making them public.

Coordinated and responsible disclosure helps protect users of the project.

---

## Security Best Practices for Contributors

When contributing, please ensure that you:

- Never commit secrets, API keys, passwords, or credentials.
- Never expose JWT secrets or private keys.
- Validate all user input.
- Enforce authentication and authorization on protected endpoints.
- Use parameterized database queries through Prisma.
- Keep dependencies up to date.
- Follow the OWASP Top 10 recommendations where applicable.
- Review changes for potential security implications before opening a Pull Request.

---

## Dependencies

Dependencies should be updated regularly, and security advisories should be reviewed before each release.

GitHub Dependabot alerts and dependency review workflows are enabled to help identify known vulnerabilities.

---

## Questions

For general security questions that are **not** vulnerability reports, please use GitHub Discussions or contact the project maintainers.
