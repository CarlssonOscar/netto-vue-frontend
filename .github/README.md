# GitHub Copilot Configuration

This directory contains configuration files for GitHub Copilot and system documentation guidelines.

## Files

### `copilot-instructions.md`
**Primary AI instruction file** - Contains rules and guidelines for GitHub Copilot when working with this codebase.

**Purpose:**
- Code quality standards (Clean Architecture, SOLID principles)
- AI behavior rules
- Debugging methodology
- Change management guidelines
- Documentation maintenance policies

**Automatically loaded by:**
- GitHub Copilot in VS Code
- GitHub Copilot Chat
- Other Copilot-enabled IDEs

### `master-prompt-documentation.md`
**Documentation generation template** - Contains the master prompt for generating/updating system documentation.

**Purpose:**
- Template for creating `docs/system-overview.md`
- Structure and guidelines for comprehensive system documentation
- Mermaid diagram examples and best practices

**When to use:**
- Initial documentation creation
- Major architectural changes
- Quarterly documentation reviews
- Before major releases

## How Copilot Uses These Files

### Automatic Loading
Copilot automatically reads `copilot-instructions.md` when you:
- Open the workspace
- Start a Copilot Chat session
- Request code suggestions

### Explicit Reference
To explicitly use the documentation prompt in Copilot Chat:

```
Generera dokumentation enligt master-prompt-documentation.md
```

Or with #file syntax:
```
Följ #file:'.github/master-prompt-documentation.md'
```

## File Structure

```
Behandlingsoversikt/
??? .github/
?   ??? README.md                        (This file)
?   ??? copilot-instructions.md          (General AI instructions)
?   ??? master-prompt-documentation.md   (Documentation generation prompt)
??? docs/
    ??? system-overview.md               (Generated system documentation)
```

## Maintenance

### When to Update

| File | Update When |
|------|-------------|
| `copilot-instructions.md` | Code standards change, new patterns adopted, architectural decisions |
| `master-prompt-documentation.md` | Documentation requirements change, new sections needed |

### Version Control
- All changes to these files should be committed to version control
- Update "Last Updated" date when making changes
- Document significant changes in commit messages

## Best Practices

? **DO:**
- Keep instructions clear and concise
- Update files when standards change
- Review quarterly alongside documentation
- Link related files using relative paths

? **DON'T:**
- Duplicate content between files
- Leave outdated instructions
- Make changes without testing with Copilot
- Forget to update "Last Updated" dates

---

**Last Updated:** 2025-11-21  
**Maintained By:** RegVastOscar
