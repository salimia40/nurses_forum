# Git Workflow

This document outlines the Git workflow for the Nurses Forum project.

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd nurses_forum
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

## Commit Message Convention

We use Conventional Commits to make our commit messages more readable and to generate changelogs automatically. Each commit message should have a specific format:

```text
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

### Examples

```text
feat(auth): add user registration functionality
```

```text
fix(forum): resolve thread creation error
```

```text
docs(README): update installation instructions
```

## Branch Naming Convention

Branches should be named following this pattern:

```text
<type>/<short-description>
```

For example:

- `feat/user-auth`
- `fix/login-error`
- `docs/api-docs`

## Development Workflow

1. Create a new branch from `main`:

   ```bash
   git checkout -b <branch-name>
   ```

2. Make your changes and commit them following the commit message convention.

3. Push your branch:

   ```bash
   git push origin <branch-name>
   ```

4. Create a Pull Request to merge into `main`.

## Pre-commit Checks

This project uses Husky, lint-staged, and commitlint to enforce code quality and commit message conventions.

- **Husky**: Sets up Git hooks
- **lint-staged**: Runs linters and formatters on staged files
- **commitlint**: Validates commit messages

These tools run automatically. When you commit code:

1. ESLint and Prettier format and lint your staged files
2. Commitlint validates your commit message format
3. If all checks pass, your commit is created

## Useful Git Commands

- Check status of your repository:

  ```bash
  git status
  ```

- View commit history:

  ```bash
  git log --oneline --graph
  ```

- Fetch latest changes from remote:

  ```bash
  git fetch
  ```

- Pull latest changes from remote:

  ```bash
  git pull
  ```

- Discard local changes in a file:

  ```bash
  git checkout -- <file>
  ```
