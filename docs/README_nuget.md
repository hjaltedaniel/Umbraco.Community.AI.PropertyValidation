# AI Property Validation

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.AI.PropertyValidation?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.AI.PropertyValidation/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.AI.PropertyValidation?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.AI.PropertyValidation)
[![GitHub license](https://img.shields.io/github/license/hjaltedaniel/Umbraco.Community.AI.PropertyValidation?color=8AB803)](https://github.com/hjaltedaniel/Umbraco.Community.AI.PropertyValidation/blob/main/LICENSE)

An [Umbraco.AI](https://github.com/umbraco/Umbraco.AI) add-on that validates content properties using AI when editors save or publish. Define rules in the backoffice with natural-language instructions, and the AI will block or warn when content doesn't meet your standards.

## Quick Start

```bash
dotnet add package Umbraco.Community.AI.PropertyValidation
```

Requires **Umbraco CMS 17.1+** and **Umbraco.AI** with at least one configured AI provider and profile.

After installation, navigate to the **AI** section in the backoffice, expand **Add-ons**, and click **Property Validation** to start creating rules.

## Highlights

- **Backoffice UI** that matches Umbraco.AI conventions — AI profile picker, content type and property alias autocomplete, markdown instructions editor
- **Guardrails** — attach Umbraco.AI guardrails to constrain AI behaviour during validation
- **Save and/or Publish triggers** with Warning or Error severity per rule
- **Version history** — every save is tracked with who changed what and when
- **Graceful degradation** — AI failures never block content editing
- **Parallel execution** — multiple rules validate concurrently

## Example

Create a rule targeting the `pageTitle` property on `blogPost` content types with these instructions:

> Check that this title is SEO-friendly: between 30-60 characters, descriptive, and avoids clickbait language.

When an editor saves a blog post, the AI evaluates the title and either allows it or returns actionable feedback explaining why it failed.

## Documentation

Full documentation, development setup, and API reference available on [GitHub](https://github.com/hjaltedaniel/Umbraco.Community.AI.PropertyValidation).

## License

MIT
