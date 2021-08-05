describe('Ejemplos iniciales', () => {
    describe('Basico', () => {
        it('Este pasa siempre', () => {
            expect(true).to.equal(true)
        })
        it.skip('Este falla siempre', () => {
            expect(true).to.equal(false)
        })
        it('Visits the Kitchen Sink', () => {
            cy.visit('https://example.cypress.io')
            cy.contains('type').click()
            cy.url().should('include', '/commands/actions')
            cy.get('.action-email')
                .type('{shift}fake@email.com')
                .should('have.value', 'fake@email.com')
                .clear()
                .should('have.value', '')
        })
    })
})

