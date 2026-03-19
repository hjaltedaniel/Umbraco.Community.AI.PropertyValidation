import { UmbBasicState, UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { ENTITY_TYPE, ROOT_ENTITY_TYPE } from "../../constants.js";
import {
  validationRuleApi,
  type ValidationRuleModel,
  type CreateUpdateRuleModel,
} from "../../api.js";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export interface ValidationRuleDetailModel {
  unique: string;
  entityType: string;
  name: string;
  alias: string;
  contentTypeAlias: string;
  propertyAlias: string;
  profileAlias: string;
  instructions: string;
  guardrails: string | null;
  validateOn: number;
  failureLevel: number;
  isEnabled: boolean;
  version: number;
  dateCreated: string | null;
  dateModified: string | null;
}

function createScaffold(): ValidationRuleDetailModel {
  return {
    unique: EMPTY_GUID,
    entityType: ENTITY_TYPE,
    name: "",
    alias: "",
    contentTypeAlias: "",
    propertyAlias: "",
    profileAlias: "",
    instructions: "",
    guardrails: null,
    validateOn: 2,
    failureLevel: 1,
    isEnabled: true,
    version: 0,
    dateCreated: null,
    dateModified: null,
  };
}

function mapFromApi(rule: ValidationRuleModel): ValidationRuleDetailModel {
  return {
    unique: rule.key,
    entityType: ENTITY_TYPE,
    name: rule.name,
    alias: rule.alias,
    contentTypeAlias: rule.contentTypeAlias,
    propertyAlias: rule.propertyAlias,
    profileAlias: rule.profileAlias,
    instructions: rule.instructions,
    guardrails: rule.guardrails,
    validateOn: rule.validateOn,
    failureLevel: rule.failureLevel,
    isEnabled: rule.isEnabled,
    version: rule.version,
    dateCreated: rule.createDate,
    dateModified: rule.updateDate,
  };
}

function mapToApi(model: ValidationRuleDetailModel): CreateUpdateRuleModel {
  return {
    name: model.name,
    alias: model.alias,
    contentTypeAlias: model.contentTypeAlias,
    propertyAlias: model.propertyAlias,
    profileAlias: model.profileAlias,
    instructions: model.instructions,
    guardrails: model.guardrails,
    validateOn: model.validateOn,
    failureLevel: model.failureLevel,
    isEnabled: model.isEnabled,
  };
}

/**
 * Workspace context for Property Validation Rule entities.
 */
export class ValidationRuleWorkspaceContext {
  public readonly IS_VALIDATION_RULE_WORKSPACE_CONTEXT = true;

  #isNew = new UmbBasicState<boolean>(true);
  readonly isNew = this.#isNew.asObservable();

  #model = new UmbObjectState<ValidationRuleDetailModel | undefined>(undefined);
  readonly model = this.#model.asObservable();

  #unique = new UmbBasicState<string | undefined>(undefined);
  readonly unique = this.#unique.asObservable();

  getIsNew(): boolean {
    return this.#isNew.getValue();
  }

  getUnique(): string | undefined {
    return this.#unique.getValue();
  }

  getEntityType(): string {
    return ENTITY_TYPE;
  }

  getData(): ValidationRuleDetailModel | undefined {
    return this.#model.getValue();
  }

  scaffold() {
    const model = createScaffold();
    this.#unique.setValue(EMPTY_GUID);
    this.#model.setValue(model);
    this.#isNew.setValue(true);
  }

  async load(id: string) {
    try {
      const rule = await validationRuleApi.getByKey(id);
      const model = mapFromApi(rule);
      this.#unique.setValue(model.unique);
      this.#model.setValue(model);
      this.#isNew.setValue(false);
    } catch (e) {
      console.error("Failed to load validation rule", e);
    }
  }

  updateProperty<K extends keyof ValidationRuleDetailModel>(
    key: K,
    value: ValidationRuleDetailModel[K]
  ) {
    const current = this.#model.getValue();
    if (current) {
      this.#model.setValue({ ...current, [key]: value });
    }
  }

  async submit() {
    const model = this.#model.getValue();
    if (!model) return;

    if (this.#isNew.getValue()) {
      const created = await validationRuleApi.create(mapToApi(model));
      const newModel = mapFromApi(created);
      this.#unique.setValue(newModel.unique);
      this.#model.setValue(newModel);
      this.#isNew.setValue(false);

      const path = `section/ai/workspace/${ENTITY_TYPE}/edit/${newModel.unique}`;
      history.replaceState(null, "", path);
    } else {
      const updated = await validationRuleApi.update(model.unique, mapToApi(model));
      this.#model.setValue(mapFromApi(updated));
    }
  }

  async deleteRule() {
    const unique = this.#unique.getValue();
    if (!unique || unique === EMPTY_GUID) return;

    await validationRuleApi.delete(unique);
    const path = `section/ai/workspace/${ROOT_ENTITY_TYPE}`;
    history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}
