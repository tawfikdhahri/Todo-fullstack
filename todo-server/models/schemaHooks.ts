import { Document } from "mongoose";
import moment from "moment";

// CREATED AT
export function createdAt(schema): void {
  schema.pre("save", function (this): Document {
    if (this.isNew && !this.createdAt) {
      this.createdAt = moment().valueOf();
      this.id = this._id.toString();
    } else this.lastUpdate = moment().valueOf();
    return this;
  });
}
