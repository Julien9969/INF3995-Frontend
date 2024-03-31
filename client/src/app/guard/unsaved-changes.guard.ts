import {IdeComponent} from "@app/pages/ide/ide.component";

export const unsavedChangesGuard = (idecomponent: IdeComponent) => {
  return new Promise((resolve) => {
    if (idecomponent.isDirty) {
      idecomponent.openDialog().subscribe((result) => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } else {
      resolve(true);
    }
  });
};
