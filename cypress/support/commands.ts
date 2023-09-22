/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add("teardown", () => {
  cy.exec(
    `curl -v -X DELETE "http://127.0.0.1:8080/emulator/v1/projects/oichan-testable-firebase/databases/(default)/documents"`
  );
  cy.exec(
    `curl -v -X DELETE "http://127.0.0.1:9099/emulator/v1/projects/oichan-testable-firebase/accounts"`
  );
  cy.logout();
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    teardown(): Cypress.Chainable<void>;
  }
}
