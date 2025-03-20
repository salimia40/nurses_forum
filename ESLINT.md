# ESLint & Prettier Configuration Guide

This project uses ESLint v9+ with the new flat configuration format and Prettier for code formatting. Below is information about our setup and how to use it.

## Configuration Structure

The ESLint configuration is defined in `eslint.config.mjs` and uses the modern flat config format, which is the default in ESLint v9+. Prettier is integrated with ESLint for optimal formatting.

Our configuration consists of:

1. **Ignore Patterns**: Files and directories that should be ignored by ESLint
2. **Base Config**: Rules applied to all JavaScript and TypeScript files
3. **Bun-Specific Config**: Additional rules specific to Bun runtime
4. **Prettier Integration**: Code formatting rules

## Using ESLint & Prettier

### Running Linting

You can run ESLint with:

```bash
bun run lint
```

### Fixing Issues Automatically

To fix ESLint issues automatically where possible:

```bash
bun run lint:fix
```

### Formatting Code with Prettier

To format your code with Prettier:

```bash
bun run format
```

### Checking if Files are Properly Formatted

To check if your files are properly formatted without modifying them:

```bash
bun run format:check
```

### IDE Integration

For a better development experience:

1. Install the ESLint extension for VS Code for real-time linting feedback
2. Install the Prettier extension for VS Code for real-time formatting
3. Configure VS Code to "Format on Save" for automatic formatting as you work

## Key Features of Our Config

- **TypeScript Support**: Full TypeScript syntax support via `@typescript-eslint`
- **React Specific Rules**: Rules for React and React Hooks
- **Bun Runtime Support**: Global Bun object properly defined
- **Persian Language Support**: Configured to work with Persian text and RTL interfaces
- **Prettier Integration**: Consistent code formatting across the project

## Migrating from Previous Config

This configuration was migrated from the older `.eslintrc.json` format to the new flat config format following the [official ESLint migration guide](https://eslint.org/docs/latest/use/configure/migration-guide).

Key changes:

1. Plugins are now directly imported rather than referenced by string
2. Configuration is an array of config objects
3. Ignore patterns are included in the config itself
4. Globals and environments are defined in `languageOptions`
5. Prettier integration is added via plugins and config

## Prettier Configuration

Our Prettier configuration (`.prettierrc.json`) specifies:

- Single quotes for strings
- 2 spaces for indentation
- 100 character line width
- Trailing commas
- Consistent arrow function parentheses
- LF line endings

## Adding New Rules

To add new ESLint rules, edit the `rules` object in the appropriate section of `eslint.config.mjs`. For example:

```javascript
rules: {
  // Add your new rule here
  'new-rule': 'error'
}
```

To modify Prettier rules, edit the `.prettierrc.json` file.
