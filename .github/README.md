# AI Property Validation

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.AI.PropertyValidation?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.AI.PropertyValidation/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.AI.PropertyValidation?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.AI.PropertyValidation)
[![GitHub license](https://img.shields.io/github/license/hjaltedaniel/Umbraco.Community.AI.PropertyValidation?color=8AB803)](../LICENSE)

AI-powered property validation for Umbraco CMS. Define validation rules in the backoffice that use AI to validate content properties when editors save or publish content.

## Features

- **Backoffice UI** for creating and managing validation rules under the AI section's Addons sidebar
- **AI-powered validation** using Umbraco.AI's `IAIChatService` with configurable profiles
- **Flexible targeting** by content type and property alias (supports `*` for all content types)
- **Save and/or Publish triggers** per rule
- **Warning or Error level** - warnings show messages but allow save, errors block the operation
- **Graceful degradation** - AI errors or timeouts don't block content editing
- **Parallel validation** - multiple rules execute concurrently for performance

## Prerequisites

- Umbraco CMS 17.1+
- [Umbraco.AI](https://github.com/umbraco/Umbraco.AI) package installed and configured with at least one AI provider and profile

## Installation

```bash
dotnet add package Umbraco.Community.AI.PropertyValidation
```

## Setup

1. Install and configure [Umbraco.AI](https://github.com/umbraco/Umbraco.AI) with a provider (e.g., `Umbraco.AI.OpenAI`) and create at least one AI profile in the backoffice
2. Install this package
3. Navigate to the **AI** section in the backoffice, expand the **Add-ons** sidebar, and click **Property Validation**
4. Create validation rules

## Creating Validation Rules

Each rule has:

| Field | Description |
|-------|-------------|
| **Name** | Human-readable name for the rule |
| **Content Type Alias** | The document type alias to target, or `*` for all types |
| **Property Alias** | The property to validate (e.g., `pageTitle`) |
| **AI Profile Alias** | The alias of the Umbraco.AI profile to use |
| **Prompt** | The validation instruction sent to the AI |
| **Validate On** | Save, Publish, or Both |
| **Failure Level** | Warning (allow save) or Error (block save) |
| **Enabled** | Toggle the rule on/off |

### Example Prompt

> Check that this title is SEO-friendly: between 30-60 characters, descriptive, and avoids clickbait language. It should accurately represent the page content.

## How It Works

1. When content is saved or published, the notification handler checks for matching enabled rules
2. For each matching rule, the property value is sent to the AI along with the validation prompt
3. The AI evaluates the content and responds with pass/fail and a reason
4. If a rule fails with **Error** level, the save/publish is cancelled with the AI's feedback
5. If a rule fails with **Warning** level, the feedback is shown but the operation proceeds
6. If the AI service is unavailable or times out (15s), the operation proceeds with an informational message

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup

1. Clone the repository
2. `cd src/Umbraco.Community.AI.PropertyValidation/Client && npm install && npm run build`
3. Open the solution in your IDE and run the TestSite project
4. Configure Umbraco.AI with a provider in the test site

## License

MIT
