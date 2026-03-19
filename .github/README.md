# AI Property Validation

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.AI.PropertyValidation?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.AI.PropertyValidation/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.AI.PropertyValidation?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.AI.PropertyValidation)
[![GitHub license](https://img.shields.io/github/license/hjaltedaniel/Umbraco.Community.AI.PropertyValidation?color=8AB803)](../LICENSE)

An Umbraco.AI add-on that lets you define AI-powered validation rules for content properties. When editors save or publish content, targeted properties are evaluated by AI against your instructions — blocking or warning when content doesn't meet your standards.

## Features

- **Backoffice UI** matching Umbraco.AI conventions — appears under the AI section's Add-ons sidebar alongside Prompts and Agents
- **AI profile picker** — select which AI profile (provider, model, temperature) to use per rule
- **Content type picker** with autocomplete — target specific document types or use `*` for all
- **Property alias picker** with autocomplete — select properties filtered by the chosen content type
- **Markdown instructions editor** — write rich validation instructions with the same editor used by Umbraco.AI Prompts
- **Guardrail picker** — attach Umbraco.AI guardrails to constrain AI behaviour during validation
- **Save and/or Publish triggers** — choose when each rule fires
- **Warning or Error severity** — warnings inform editors but allow the operation; errors block it
- **Version history** — every save creates a versioned snapshot with who changed what and when
- **Info panel** — view the rule's GUID, version number, creation and modification dates
- **Graceful degradation** — AI errors or timeouts never block content editing
- **Parallel validation** — multiple rules execute concurrently for performance

## Prerequisites

- Umbraco CMS 17.1+
- [Umbraco.AI](https://github.com/umbraco/Umbraco.AI) installed and configured with at least one AI provider and profile

## Installation

```bash
dotnet add package Umbraco.Community.AI.PropertyValidation
```

## Setup

1. Install and configure [Umbraco.AI](https://github.com/umbraco/Umbraco.AI) with a provider (e.g., `Umbraco.AI.OpenAI`) and create at least one AI profile in the backoffice
2. Install this package
3. Navigate to the **Settings** section in the backoffice, find the **AI** sidebar, expand **Add-ons**, and click **Property Validation**
4. Click **Create** to add your first validation rule

## Creating a Validation Rule

The workspace editor has three tabs:

### Settings

| Field | Description |
|-------|-------------|
| **Name** | Human-readable name for the rule (e.g., "SEO Title Check") |
| **Alias** | Auto-generated from the name, lockable for manual editing |
| **AI Profile** | Pick an Umbraco.AI profile — this determines provider, model, and temperature |
| **Content Type** | Pick a document type via autocomplete, or enter `*` for all types |
| **Property Alias** | Pick a property via autocomplete, filtered by the selected content type |
| **Instructions** | Markdown editor for the validation prompt sent to AI |
| **Validate On** | Save, Publish, or Both |
| **Failure Level** | Warning (allow save, show message) or Error (block save/publish) |
| **Active/Inactive** | Toggle in the header to enable or disable the rule without deleting it |

### Governance

Attach **guardrails** from Umbraco.AI to constrain the AI's validation behaviour. Guardrails are system-level directives injected before the validation instructions — use them for tone enforcement, compliance requirements, language policies, or scope limiting.

### Info

View the rule's metadata and full version history:

- **ID** — the rule's unique GUID
- **Version** — current version number, incremented on each save
- **Date Created / Date Modified**
- **Version History** — table showing each version with the action taken, who made the change, and when

## Example Instructions

> Check that this title is SEO-friendly: between 30-60 characters, descriptive, and avoids clickbait language. It should accurately represent the page content.

> Validate that this meta description is between 120-160 characters, includes the primary keyword naturally, and provides a compelling reason to click through from search results.

> Ensure this body text does not contain any personally identifiable information such as email addresses, phone numbers, or physical addresses.

## How It Works

1. When content is saved or published, the notification handler queries for matching enabled rules (by content type alias and trigger)
2. For each matching rule, the property value is extracted from the content
3. A prompt is constructed with the rule's instructions, any guardrails, and the property value
4. The prompt is sent to the AI via Umbraco.AI's `IAIChatService` using the configured profile
5. The AI responds with a JSON verdict: `{"valid": true}` or `{"valid": false, "reason": "..."}`
6. **Error** level failures cancel the save/publish with the AI's feedback displayed to the editor
7. **Warning** level failures show the feedback but allow the operation to proceed
8. If the AI service is unavailable, times out (15s), or returns an unparseable response, the operation proceeds with an informational message — validation never blocks editors due to technical failures

## API Endpoints

The package exposes a Management API for programmatic access:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/rule` | List all rules |
| `GET` | `/api/v1/rule/{id}` | Get a single rule |
| `POST` | `/api/v1/rule` | Create a rule |
| `PUT` | `/api/v1/rule/{id}` | Update a rule |
| `DELETE` | `/api/v1/rule/{id}` | Delete a rule |
| `GET` | `/api/v1/rule/{id}/versions` | Get version history |
| `GET` | `/api/v1/utils/document-types` | Autocomplete document type aliases |
| `GET` | `/api/v1/utils/property-aliases` | Autocomplete property aliases |

All endpoints are prefixed with `/umbraco/umbracocommunityaipropertyvalidation/` and require backoffice authentication.

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup

1. Clone the repository
2. Install frontend dependencies and build:
   ```bash
   cd src/Umbraco.Community.AI.PropertyValidation/Client
   npm install
   npm run build
   ```
3. Open the solution in your IDE and run the TestSite project
4. Install and configure Umbraco.AI with a provider in the test site
5. The package menu appears in the AI sidebar under Add-ons

### Project Structure

```
src/
  Umbraco.Community.AI.PropertyValidation/          # .NET Razor Class Library
    Api/Models/                                      # Request/response DTOs
    Client/src/                                      # TypeScript/Lit frontend source
      validation-rule/
        actions/                                     # Create and save workspace actions
        context/                                     # Workspace context token
        views/                                       # Settings, Governance, Info, Collection views
        validation-rule-workspace-editor.element.ts  # Main workspace editor (header + context)
        validation-rule-menu-item.element.ts         # Sidebar menu item
        manifests.ts                                 # Extension manifest registration
    Controllers/                                     # Management API controllers
    Data/                                            # NPoco schemas and repository
    Migrations/                                      # Database migrations
    Models/                                          # Domain models
    Services/                                        # AI validation service
    NotificationHandlers/                            # Content save/publish handlers
    wwwroot/App_Plugins/                             # Compiled frontend output (RCL)
```

## License

MIT
