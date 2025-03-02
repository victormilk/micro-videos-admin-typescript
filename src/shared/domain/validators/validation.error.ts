import { FieldsErrors } from "./validators-fields-interface";

export class EntityValidationError extends Error {
  constructor(public errors: FieldsErrors, message = "Validation Error") {
    super(message);
    this.name = "EntityValidationError";
  }

  count() {
    return Object.keys(this.errors).length;
  }
}
