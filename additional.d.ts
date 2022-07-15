import 'iron-session';
// Needs to be here because of module augmentation vs-code intelisense
// See: https://stackoverflow.com/questions/69226213/how-to-enable-typescript-intellisense-in-vscode-for-a-codebase-in-javascript-whe

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      email: string;
      name: string;
      type: string;
      phone?: string;
    };
    cart?: {
      [eventId: string]: {
        _id: string;
        quantity: number;
      };
    };
  }
}
