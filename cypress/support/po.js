export class PageObject {
    login() {
        cy.get('#txtUsuario').type('admin')
            .should('have.value', 'admin')
        cy.get('#txtPassword').type('P@$$w0rd')
            .should('have.value', 'P@$$w0rd')
        cy.get('#btnSendLogin').click()
        cy.get('#userData').contains('Hola Administrador')
    }
}

export const po = new PageObject();
