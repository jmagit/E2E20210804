/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    clickLink(label: string): Chainable<Element>
    /**
    * Mostrar el sujeto en la consola de depuración
    * @param method Permite cambiar el método de consola utilizado, log por defecto
    * @example cy.console('info')
    */
    console(method: string): Chainable<Element>
  }
}