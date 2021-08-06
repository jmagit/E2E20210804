import { po } from './po'

describe('Pagina Inicio Test', () => {
    function menu(menu, url, title) {
        cy.visit('/')
        cy.get('.nav-link').contains(menu).click()
        cy.location().should((location) => {
            expect(location.pathname).to.eq(url)
          })
        if (title)
            cy.get('h1').contains(title)
    }
    function card(index, url, title) {
        cy.visit('/')
        // cy.get('.card').contains(title).parent().parent()
        //     .contains('Ver mas').click()
        cy.get(`:nth-child(${index}) > .card > .text-right > .btn`).click()
        cy.url().should('include', url)
        if (title)
            cy.get('h1').contains(title)
    }
    function carousel(index, button, url, title) {
        cy.visit('/')
        // for (let i = 0; i < index; i++)
        //     cy.get('.carousel-control-next-icon').click()
        cy.get(`[data-slide-to="${index}"]`).click()
        cy.get('.carousel-item').contains(button).click()
        cy.url().should('include', url)
        if (title)
            cy.get('h1').contains(title)
    }
    describe('Calculadora Test', () => {
        it('Abrir Calculadora desde el menu', () => {
            menu('Calculadora', '/calculadora', 'Calculadora')
        })
        it('Abrir Calculadora desde la tarjeta', () => {
            card(1, '/calculadora', 'Calculadora')
        })
        it('Abrir Calculadora desde el carrusel', () => {
            carousel(0, 'Hacer calculos', '/calculadora', 'Calculadora')
        })
    })
    describe('Carrito Test', () => {
        it('Abrir Carrito desde el menu', () => {
            menu('Compras', '/compras', 'Compras')
        })
        it('Abrir Carrito desde la tarjeta', () => {
            card(2, '/compras', 'Compras')
        })
        it('Abrir Carrito desde el carrusel', () => {
            carousel(1, 'Ir ahora', '/compras', 'Compras')
        })
    })
    describe('Contactos Test', () => {
        it('Abrir Contactos desde el menu', () => {
            menu('Contactos', '/contactos', 'Contactos')
        })
        it.skip('Abrir Contactos desde la tarjeta', () => {
            card(3, '/contactos', 'Contactos')
        })
    })
    describe('API Rest Test', () => {
        it('Abrir API Rest desde el menu', () => {
            menu('APIs', '/api')
        })
        it('Abrir API Rest desde la tarjeta', () => {
            card(4, '/api')
        })
        it('Abrir API Rest desde el carrusel', () => {
            carousel(2, 'Mostrar galeria', '/api')
        })
    })
    describe('Ficheros Test', () => {
        it('Abrir Ficheros desde el menu', () => {
            menu('Ficheros', '/fileupload', 'Subir ficheros')
        })
        it('Abrir Ficheros desde la tarjeta', () => {
            card(5, '/fileupload', 'Subir ficheros')
        })
    })
    describe('Alertas Test', () => {
        it('Abrir Alertas desde el menu', () => {
            menu('Alertas', '/alertas', 'Alertas')
        })
        it('Abrir Alertas desde la tarjeta', () => {
            card(6, '/alertas', 'Alertas')
        })
    })
    describe('Documentación Test', () => {
        it('Abrir Documentación desde el menu', () => {
            cy.visit('/')
            cy.get(':nth-child(8) > .nav-link').click()
            cy.url().should('include', '/documentacion')
        })
    })
    describe('Login', () => {
        function login() {
            cy.get('#txtUsuario').type('admin')
                .should('have.value', 'admin')
            cy.get('#txtPassword').type('P@$$w0rd')
                .should('have.value', 'P@$$w0rd')
            cy.get('#btnSendLogin').click()
            cy.get('#userData').contains('Hola Administrador')
        }
        it('Autentica admin', () => {
            cy.visit('http://localhost:8181/')
            po.login()
            cy.get('#btnLogout').click()
            cy.get('#txtUsuario')
                .should('have.value', 'admin')
        })
    })
})

