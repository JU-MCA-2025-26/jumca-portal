# Pull Request

> **Target Branch:** `develop`

## Summary

Provide a concise description of the changes introduced in this Pull Request.

---

## Related Issue(s)

Closes #

Related to #

---

## Type of Change

Select all that apply.

- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation
- [ ] Performance Improvement
- [ ] Dependency Update
- [ ] Build / CI
- [ ] Chore

---

## Affected Module(s)

Select all applicable modules.

- [ ] Auth
- [ ] Resources
- [ ] Profile
- [ ] Placement
- [ ] Admin
- [ ] Shared Package
- [ ] API
- [ ] Database
- [ ] Frontend
- [ ] Backend
- [ ] Documentation
- [ ] Infrastructure / CI

---

## SRS Requirement(s)

If this PR implements or modifies functionality defined in the Software Requirements Specification, list the corresponding requirement IDs.

Examples:

- REQ-1
- REQ-8
- REQ-19

If not applicable, write **N/A**.

---

## Database Changes

- [ ] No database changes
- [ ] Prisma schema updated
- [ ] Migration added
- [ ] Prisma Client regenerated
- [ ] Seed updated

Migration name:

```
<name>
```

---

## API Changes

- [ ] No API changes
- [ ] New endpoint(s)
- [ ] Existing endpoint modified
- [ ] Breaking API change

If applicable, list affected endpoints.

```
GET

POST

PATCH

PUT

DELETE
```

---

## Frontend Changes

- [ ] New page
- [ ] New component
- [ ] Existing UI updated
- [ ] Styling only
- [ ] No frontend changes

---

## Testing

### Local Verification

- [ ] Application builds successfully
- [ ] Lint passes
- [ ] TypeScript passes
- [ ] Client tested
- [ ] Server tested
- [ ] Database migration tested
- [ ] No console errors
- [ ] No runtime errors observed

---

## API Testing

If APIs were changed:

- [ ] Tested using the shared Postman collection
- [ ] Updated the shared Postman collection
- [ ] Updated Postman environment if required

---

## Documentation

- [ ] No documentation changes required
- [ ] README updated
- [ ] Developer Guide updated
- [ ] API documentation updated
- [ ] Environment variable documentation updated

---

## Screenshots

If this PR changes the UI, include screenshots or screen recordings.

---

## Breaking Changes

Describe any breaking changes.

If none, write:

```
None
```

---

## Additional Notes

Include any implementation details, assumptions, known limitations, or reviewer notes.

---

# Contributor Checklist

Before requesting review, confirm the following:

- [ ] My branch is based on the latest `develop`
- [ ] I followed the project's coding standards
- [ ] I used Conventional Commits
- [ ] I have self-reviewed my changes
- [ ] I removed unused code and files
- [ ] I did not commit secrets or credentials
- [ ] I updated documentation where necessary
- [ ] I updated the Postman collection for API changes
- [ ] I included Prisma migrations (if applicable)
- [ ] I verified the application builds successfully
- [ ] I verified linting passes
- [ ] I resolved merge conflicts
- [ ] This Pull Request is ready for review

---

## Reviewer Checklist

- [ ] Code follows project conventions
- [ ] Business logic is appropriate
- [ ] Error handling is adequate
- [ ] Validation is implemented where required
- [ ] Database changes are correct
- [ ] API changes are documented
- [ ] Documentation is updated
- [ ] Tests and verification are sufficient
- [ ] Ready to merge into `develop`
