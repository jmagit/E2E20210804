// ***********************************************
// This example commands.js shows you how to
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

Cypress.Commands.add('clickLink', (label) => {
    cy.get('a').contains(label).click().end()
})
Cypress.Commands.add('getLink', (label) => {
    // cy.get('a').contains(label).click()
    return cy.get('a').contains(label)
})
Cypress.Commands.add('clickDigito', (label) => {
    //cy.get('button').contains(label).click()
    //cy.get('input[type=button]').contains(label).click()
    cy.get('.btnDigito').filter(`[value=${label}]`).click()
})

Cypress.Commands.add('console', { prevSubject: true, }, (subject, method) => {
        console[method || 'log']('The subject is', subject)
        return subject
})

Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
    if (options && options.sensitive) {
      options.log = false
      Cypress.log({ $el: element, name: 'type', message: '*'.repeat(text.length), })
    }
    return originalFn(element, text, options)
})