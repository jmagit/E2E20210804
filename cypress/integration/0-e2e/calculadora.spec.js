describe('Calculadora Test', () => {
    it('Abrir Calculadora desde el menu', () => {
        cy.visit('http://localhost:8181/')
        cy.get('.nav-link').contains('Calculadora').click()
        cy.get('h1').contains('Calculadora')
    })
    it.only('Abrir Calculadora desde la tarjeta', () => {
        cy.visit('http://localhost:8181/')
        // cy.get('.card').contains('Calculadora').parent().parent()
        //     .contains('Ver mas').click()
        cy.get(':nth-child(1) > .card > .text-right > .btn').click()
        cy.url().should('include', '/calculadora')
        cy.get('h1').contains('Calculadora')
    })
    it('Abrir Calculadora desde el carrusel', () => {
        cy.visit('http://localhost:8181/')
        cy.get('.carousel-item').contains('Hacer calculos').click()
        cy.get('h1').contains('Calculadora')
    })
})
