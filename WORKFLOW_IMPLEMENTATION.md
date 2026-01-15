# GitHub Workflows Implementation Summary

## Overview
This PR adds comprehensive GitHub workflows to automate CI/CD, security scanning, dependency management, and project maintenance for the Object UI repository.

## Changes Made

### 📋 New Workflows (11 total)

1. **CodeQL Security Scan** (`codeql.yml`)
   - Automated security vulnerability scanning
   - Runs on push, PR, and weekly schedule
   - Uses GitHub's CodeQL engine for JavaScript/TypeScript analysis

2. **Secret Scanning** (`secret-scan.yml`)
   - Prevents accidental commits of secrets and API keys
   - Uses Gitleaks to scan repository history
   - Runs on push, PR, and weekly schedule

3. **Stale Issues & PRs** (`stale.yml`)
   - Automatically manages inactive issues and PRs
   - Issues: stale after 60 days, closed after 7 more days
   - PRs: stale after 45 days, closed after 14 more days

4. **Auto Label PRs** (`labeler.yml`)
   - Automatically labels PRs based on changed files
   - Labels by package, component type, and change category
   - Helps with PR organization and filtering

5. **Bundle Size Check** (`size-check.yml`)
   - Reports bundle size changes in PR comments
   - Tracks both raw and gzipped sizes
   - Warns about packages exceeding size limits

6. **Dependabot Auto-merge** (`dependabot-auto-merge.yml`)
   - Auto-approves and merges patch/minor dependency updates
   - Comments on major updates for manual review
   - Only merges after CI checks pass

7. **Auto Changelog** (`changelog.yml`)
   - Generates CHANGELOG.md from git history
   - Uses conventional commits format
   - Runs on releases and manual trigger

### 🔧 Improved Workflows

**CI Workflow** (`ci.yml`)
- Added pnpm store caching for faster builds
- Added CODECOV_TOKEN for better coverage reporting
- Optimized cache keys and restore patterns
- Applied to all three jobs (test, lint, build)

### ⚙️ Configuration Files

1. **Dependabot** (`dependabot.yml`)
   - Weekly npm dependency updates
   - Weekly GitHub Actions updates
   - Grouped dependency updates (patch, dev, React, testing)
   - Limit of 10 open PRs

2. **Auto-labeler** (`labeler.yml`)
   - 112 lines of label rules
   - Covers packages, plugins, documentation, tests, configuration
   - Identifies breaking changes automatically

3. **Changelog Generator** (`cliff.toml`)
   - Conventional commits format
   - Groups changes by type (features, fixes, docs, etc.)
   - Links to GitHub issues
   - Filters out noise commits

### 📝 Templates

**Issue Templates**:
- Bug report template with environment details
- Feature request template with use cases
- Configuration file linking to Discord and docs

**Pull Request Template**:
- Comprehensive checklist
- Change type classification
- Testing requirements
- Breaking change documentation
- Migration guide section

### 📚 Documentation

1. **Workflow Documentation** (`.github/WORKFLOWS.md`)
   - Complete guide to all workflows
   - Troubleshooting section
   - Best practices for contributors
   - Maintenance checklist

2. **Updated CONTRIBUTING.md**
   - New section on automated workflows
   - Tips for passing CI checks
   - Explanation of what to expect in PRs

3. **Updated README.md**
   - Added CI and CodeQL status badges
   - Shows workflow health at a glance

## Workflow Summary

| Workflow | Purpose | Triggers | Auto-Action |
|----------|---------|----------|-------------|
| CI | Test, lint, build | Push, PR | None |
| PR Checks | Validate PRs | PR events | Comments |
| CodeQL | Security scan | Push, PR, weekly | None |
| Secret Scan | Find secrets | Push, PR, weekly | None |
| Stale | Close inactive items | Daily | Closes |
| Labeler | Auto-label PRs | PR events | Labels |
| Size Check | Report bundle size | PR | Comments |
| Dependabot | Update dependencies | Weekly | Auto-merge |
| Changelog | Generate changelog | Release | Updates file |
| Deploy Docs | Build & deploy docs | Push to main | Deploys |
| Release | Create releases | Version tags | Releases |

## Benefits

### For Contributors
- ✅ Immediate feedback on code quality
- ✅ Automated testing on multiple Node versions
- ✅ Clear PR requirements and checklists
- ✅ Automatic labeling and organization

### For Maintainers
- ✅ Automated security monitoring
- ✅ Dependency updates with auto-merge
- ✅ Automatic stale issue management
- ✅ Consistent release process
- ✅ Bundle size tracking

### For the Project
- ✅ Improved code quality through automation
- ✅ Better security posture
- ✅ Reduced maintenance burden
- ✅ More organized issue/PR workflow
- ✅ Professional development process

## Testing

All workflows have been configured following GitHub Actions best practices:

1. ✅ Proper permissions (principle of least privilege)
2. ✅ Caching strategies for faster runs
3. ✅ Error handling and fallbacks
4. ✅ Conditional execution where appropriate
5. ✅ Detailed logging and reporting

## Next Steps

After merging this PR:

1. **Configure Secrets** (if needed):
   - `CODECOV_TOKEN` for coverage reporting
   - `NPM_TOKEN` when ready to publish packages
   - `GITLEAKS_LICENSE` for organization scanning (optional)

2. **Create Labels**:
   - The labeler will work better with predefined labels
   - Suggested labels are documented in `labeler.yml`

3. **Monitor Workflows**:
   - Check Actions tab for first runs
   - Review Dependabot PRs as they arrive
   - Adjust stale timeouts if needed

4. **Enable Features**:
   - Enable GitHub Pages in repository settings (for docs)
   - Review and adjust Dependabot auto-merge rules
   - Uncomment npm publish in release workflow when ready

## Files Changed

```
18 files changed, 1083 insertions(+)

New files:
- .github/ISSUE_TEMPLATE/bug_report.md
- .github/ISSUE_TEMPLATE/config.yml
- .github/ISSUE_TEMPLATE/feature_request.md
- .github/PULL_REQUEST_TEMPLATE.md
- .github/WORKFLOWS.md
- .github/dependabot.yml
- .github/labeler.yml
- .github/workflows/changelog.yml
- .github/workflows/codeql.yml
- .github/workflows/dependabot-auto-merge.yml
- .github/workflows/labeler.yml
- .github/workflows/secret-scan.yml
- .github/workflows/size-check.yml
- .github/workflows/stale.yml
- cliff.toml

Modified files:
- .github/workflows/ci.yml (improved caching)
- CONTRIBUTING.md (added workflow section)
- README.md (added badges)
```

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
