import type { Dialog, Page } from "@playwright/test";

export interface DialogEvidence {
  type: ReturnType<Dialog["type"]>;
  message: string;
}

interface ObservationResult<T> {
  result: T;
  dialog: DialogEvidence | undefined;
  wasDialogTriggered: boolean;
}

export class BrowserDialogMonitor {
  private readonly dialogs: DialogEvidence[] = [];
  private readonly firstDialogPromise: Promise<DialogEvidence>;
  private resolveFirstDialog!: (evidence: DialogEvidence) => void;

  constructor(private readonly page: Page) {
    this.firstDialogPromise = new Promise((resolve) => {
      this.resolveFirstDialog = resolve;
    });
  }

  async observe<T>(
    action: () => Promise<T>,
    timeout = 3_000,
  ): Promise<ObservationResult<T>> {
    this.page.on("dialog", this.handleDialog);

    try {
      const result = await action();
      const dialog = await this.waitForDialog(timeout);
      return {
        result,
        dialog,
        wasDialogTriggered: dialog !== undefined,
      };
    } finally {
      this.page.off("dialog", this.handleDialog);
    }
  }

  private async waitForDialog(
    timeout: number,
  ): Promise<DialogEvidence | undefined> {
    if (this.firstDialog) {
      return this.firstDialog;
    }

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => resolve(undefined), timeout);

      void this.firstDialogPromise.then((evidence) => {
        clearTimeout(timeoutId);
        resolve(evidence);
      });
    });
  }

  private get firstDialog(): DialogEvidence | undefined {
    return this.dialogs[0];
  }

  private readonly handleDialog = async (dialog: Dialog): Promise<void> => {
    const evidence = {
      type: dialog.type(),
      message: dialog.message(),
    };

    this.dialogs.push(evidence);
    if (this.dialogs.length === 1) {
      this.resolveFirstDialog(evidence);
    }

    await dialog.dismiss();
  };
}
