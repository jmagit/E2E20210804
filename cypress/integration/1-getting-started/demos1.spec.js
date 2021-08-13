/// <reference types="Cypress" />
/// <reference types="../../support" />

describe('Ejemplos iniciales', () => {
  describe('Basico', () => {
    it('Este pasa siempre', () => {
      expect(true).to.equal(true)
    })
    it('Este está pendiente')
    it.skip('Este falla siempre', () => {
      expect(true).to.equal(false)
    })

    specify('Visits the Kitchen Sink', () => {
      cy.visit('https://example.cypress.io')
      cy.contains('type').click()
      cy.url().should('include', '/commands/actions')
      cy.get('.action-email')
        .type('{shift}fake@email.com')
        .should('have.value', 'fake@email.com')
        .clear()
        .should('have.value', '')
    })
    it('When NOT in Chrome', { browser: '!chrome' }, () => {
      expect(true).to.equal(true)
    })
    it('When in Firefox', { browser: 'firefox' }, () => {
      expect(true).to.equal(true)
    })
    it('iPhone 4', { viewportWidth: 320, viewportHeight: 480 }, () => {
      expect(true).to.equal(true)
    })
    describe('Comprueba los enlaces principales', () =>
      ['/calculadora', '/compras', '/biblioteca', '/contactos', '/alertas', '/documentacion'].forEach((url) => {
        it('Ruta: ' + url, () => {
          cy.visit(url)
          cy.url().should('contain', url)
        })
      })
    )
    it('Etiquetas contenidas', () => {
      cy.visit('/')
      cy.get('.card>.card-body>.card-title').contains('Contactos')
        .closest('.card').within(() => {
          cy.contains('Ver mas').click()
        })
    })
    it('Selectores', () => {
      cy.visit('/').as('pag')
      cy.get('.nav-link').first().contains('Inicio')
      cy.get('.nav-link').eq(1).contains('Calculadora')
      cy.get('.nav-link').last().children(0).should('to.have.class', 'fa-info-circle')
      cy.get('.navbar-nav').find('.active').contains('Inicio')
      cy.get('.navbar-nav').find('.active').next().contains('Calculadora')
      cy.get('.navbar-nav').find('.active').nextAll().should('have.length', 7)
      cy.get('.navbar-nav').find('.active').siblings().last().find('.fa-info-circle')
      cy.get('.navbar-nav').find('.active').siblings().last().prev().contains('APIs')
      cy.get('.navbar-nav').find('.active').parent().should('to.have.class', 'mr-auto')
      cy.get('img').first().should('to.have.attr', 'alt', 'Calculadora')
      cy.get('img').last().should('to.have.attr', 'alt', 'Alertas')
      cy.get('img').eq(2).should('to.have.attr', 'alt', 'Contactos')
    })
    it('Variables', () => {
      cy.visit('/compras').as('pag')
      let pedidos = 0;
      cy.get('#listadoCarrito tr').as('pedidos').then((rows) => pedidos = rows.length - 2)
      cy.get('#filtroResult > li').first().find('button').click()
      cy.get('@pedidos').should((rows) => {
        expect(rows).have.lengthOf(pedidos + 3)
        expect(localStorage).has.property('CarritoCompra')
        expect(JSON.parse(localStorage.CarritoCompra)).have.lengthOf(pedidos + 1)
      })
      cy.wrap(localStorage).should((local) => {
        expect(localStorage).has.property('CarritoCompra')
        expect(JSON.parse(localStorage.CarritoCompra)).have.lengthOf(pedidos + 1)
      })
      cy.get('#filtroResult > li').eq(2).find('button').click()
      cy.get('#listadoCarrito tr').should('have.lengthOf', pedidos + 4)
    })
  })
  describe('Ejemplos de depuración', () => {
    xit('Para para depurar', () => {
      cy.visit('/calculadora')
      cy.get('h1')
      cy.get('.btnDigito').filter('[value=1]').click()
      cy.get('table').find('[value=3]').debug().click()
      cy.get('[value=2]').click()
      cy.get('#txtPantalla').should('have.text', '132')
    })
    it('Para para pausar', () => {
      cy.visit('/calculadora')
      cy.get('h1')
      cy.get('.btnDigito').filter('[value=1]').click().pause()
      cy.get('table').find('[value=3]').click().pause()
      cy.get('[value=2]').click().pause()
      cy.get('#txtPantalla').should('have.text', '132')
    })
    it('Escribe en el log', () => {
      cy.log('Esto es un mensaje forzado')
    })
  })

})
describe('Solicitudes de red', () => {
  context('Spies', () => {
    it('Espiar una solicitud', () => {
      cy.intercept('GET', 'api/peliculas?_sort=titulo').as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').its('response.statusCode').should('be.oneOf', [200, 304])
      cy.get('@getRest').its('response.body').console('info')
        .should('lengthOf', 100)
      cy.get('#filtroResult').children('li').should('lengthOf', 100)
    })
    it('Espiar una solicitud, no cache', () => {
      cy.intercept('api/peliculas?_sort=titulo',
        { method: 'GET', middleware: true },
        (req) => {
          req.headers['cache-control'] = 'no-cache,no-store,max-age=0,must-revalidate';
          req.continue((res) => {
            expect(res.statusCode).be.oneOf([200, 201, 204, 304])
          })
          req.on('before:response', (res) => {
            res.headers['cache-control'] = 'no-store'
          })
        }
      ).as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').its('response.statusCode').should('be.oneOf', [200, 304])
      cy.get('@getRest').its('response.body').then((listado) => {
        cy.get('#filtroResult > li > h6')
          .should('lengthOf', listado.length)
          // .debug()
          .then((listItems) => {
            listItems.toArray().forEach((item, index) => {
              cy.wrap(item).should('include.text', listado[index].titulo)
              //expect(item).include.text(listado[index].titulo)
            })
          })
      })
    })
    function añadirContacto() {
      cy.visit('/contactos')
      cy.get('input[value=Añadir]').click()
      cy.get('#frmPrincipal').should('be.visible')

      // cy.get('#nombre').type('a').trigger('keypress').trigger('change')
      // cy.get('#nombre').trigger('input').focus().invoke('val', 'a').trigger('change').blur()
      // cy.get('#nombre').parent().parent().should('has.class', 'has-error')
      // cy.get('#err_nombre').should('has.class', 'msg-error').pause()
      // cy.get('#nombre').type('12345678901234567890123456789012345678901234567890x').blur()
      cy.get('#id').type('a').trigger('change')
      cy.get('#id').parent().parent().should('has.class', 'has-error')
      cy.get('#err_id').should('has.class', 'msg-error')
      cy.get('#email').type('A@').blur() //.trigger('change')
      cy.get('#email').parent().parent().should('has.class', 'has-error')
      cy.get('#err_email').should('has.class', 'msg-error')
      cy.get('#email').clear()

      cy.get('#id').clear().type('0').blur()
      cy.get('#nombre').clear().type('11111').trigger('change') //.blur()
      cy.get('#apellidos').focus().type('11111').blur()
      // cy.get('#').type('')

      cy.get('#btnEnviar').click()
      cy.get('#listado').should('be.visible')
    }
    it('Espiar una solicitud POST', () => {
      cy.login()
      cy.intercept('POST', 'api/**').as('postREST')
      añadirContacto()
      // cy.logout()
      cy.wait('@postREST').its('response.statusCode').should('eq', 201)
    })
    it('Espiar una solicitud POST para borrar', () => {
      cy.login()
      cy.intercept('POST', 'api/contactos').as('postREST')
      añadirContacto()
      // cy.logout()
      cy.wait('@postREST').its('response.statusCode').should('eq', 201)
      cy.get('@postREST').its('response.headers.location').then((s) => {
        cy.request('DELETE', s).then((response) => {
          expect(response.status).to.eq(204)
        })
      })
    })
    it('Suplantar una solicitud POST', () => {
      cy.login()
      cy.intercept('api/contactos',
        { method: 'POST' },
        (req) => {
          expect(req.headers).to.have.property('accept')
          expect(req.body).to.include('11111')
          req.reply(201, [])
        }
      ).as('getRest')
      añadirContacto()
      // cy.logout()
      cy.wait('@getRest').its('response.statusCode').should('eq', 201)
      // cy.get('@getRest').its('response.body').console('info')
      //   .should('lengthOf', 100)
    })
  })
  context('Stubs', () => {
    let listado = [
      { "id": 98, "titulo": "Man of the House", "director": "Giacinta Dunklee", "duración": 161, "genero": "Comedy", "idioma": "English", "precio": 20, "año": 1985 },
      { "id": 99, "titulo": "Innocent Affair, An (Don't Trust Your Husband) (Under Suspicion)", "director": "Dorine Haverty", "duración": 99, "genero": "Comedy", "idioma": "French", "precio": 9.95, "año": 2001 },
      { "id": 100, "titulo": "Damn the Defiant! (H.M.S. Defiant)", "director": "Hillary Baudi", "duración": 151, "genero": "Adventure|Drama", "idioma": "Italian", "precio": 20, "año": 2006 }
    ]
    it('Reemplace OK direct', () => {
      cy.intercept('GET', 'api/peliculas?_sort=titulo', listado).as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').its('response.statusCode').should('be.equal', 200)
      cy.get('@getRest').its('response.body').should('lengthOf', 3)
      cy.get('#filtroResult').children('li').should('have.length', 3)
    })
    it('Reemplace OK details', () => {
      cy.intercept('GET', 'api/peliculas?_sort=titulo', {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: listado
      }).as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').its('response.statusCode').should('be.equal', 200)
      cy.get('@getRest').its('response.body').should('lengthOf', 3)
      cy.get('#filtroResult').children('li').should('have.length', 3)
    })
    it('Reemplace OK fixture', () => {
      cy.intercept('GET', 'api/peliculas?_sort=titulo', { fixture: 'peliculas.json' }).as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').its('response.statusCode').should('be.equal', 200)
      cy.get('@getRest').its('response.body').should('lengthOf', 5)
      cy.get('#filtroResult').children('li').should('have.length', 5)
    })
    it('Reemplace KO 404 Not Found', () => {
      cy.intercept('GET', 'api/peliculas?_sort=titulo', {
        statusCode: 404,
      }).as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').its('response.statusCode').should('be.equal', 404)
      cy.get('#CuadroAlerta').should('be.visible').should('include.text', 'Not Found')
    })
    it('Reemplace KO 500 Internal Server Error', () => {
      cy.intercept('GET', 'api/peliculas?_sort=titulo', {
        statusCode: 500,
      }).as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').its('response.statusCode').should('be.equal', 500)
      cy.get('#CuadroAlerta').should('be.visible').should('include.text', 'Internal Server Error')
    })
    it('Reemplace KO 200 no body', () => {
      cy.intercept('GET', 'api/peliculas?_sort=titulo', {
        statusCode: 200,
      }).as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').its('response.statusCode').should('be.equal', 200)
      cy.get('#CuadroAlerta').should('be.visible').should('include.text', 'Unexpected end of JSON input')
    })
    it('Reemplace KO Force Network Error', () => {
      cy.intercept('GET', 'api/peliculas?_sort=titulo', {
        forceNetworkError: true,
      }).as('getRest')
      cy.visit('/compras')
      cy.wait('@getRest').should('have.property', 'error')
      cy.get('#CuadroAlerta').should('be.visible').should('include.text', 'Failed to fetch')
    })
    describe('Cachear servicio REST como fixture', () => {
      before(() => {
        cy.request('api/contactos?_sort=nombre,apellidos&_projection=id,tratamiento,nombre,apellidos,avatar,telefono,email')
          .then((response) => {
            cy.writeFile('cypress/fixtures/contactos.json', response.body.slice(0, 20))
          })
      })
      it('Comprobar cache', () => {
        cy.readFile('cypress/fixtures/contactos.json').then((lst) => expect(lst.length).eq(20))
      })
      it('Agilizar lecturas repetidas', () => {
        cy.intercept('GET', 'api/contactos?_sort=nombre,apellidos&_projection=id,tratamiento,nombre,apellidos,avatar,telefono,email', { fixture: 'contactos.json' }).as('getRest')
        cy.visit('/contactos')
        cy.wait('@getRest').get('.page-link').eq(3).click()
        //.parent().should('have.class', 'active')
        cy.get('.pagination').find('.active').next().children(0).click()
        cy.get('.pagination').find('.active').next().children(0).click()
      })

    })

  })
})

context('Stubs, Spies and Clock', () => {
  function calc() {
    this.suma = (a, b) => a + b;
  }
  context('Spies', () => {
    it('Espiar un metodo', () => {
      let o = new calc();
      // let sumaSpy = cy.spy(o, 'suma')
      let sumaSpy = cy.spy(o)
      expect(4).to.be.equals(o.suma(2, 2))
      expect(o.suma).to.be.called
      expect(o.suma).to.be.calledWith(2, 2)
      expect(o.suma).to.have.returned(4)
      expect(o.suma.callCount).to.be.equal(1)
    })
    it('Espiar un objeto', () => {
      cy.visit('/compras', {
        onBeforeLoad(win) {
          cy.spy(win, 'fetch').as('winSpy')
        },
      })
      cy.window().its('fetch').should('be.calledWith', 'api/peliculas?_sort=titulo')
      // cy.get('@winSpy').should('be.calledWith', 'api/peliculas?_sort=titulo' )
    })
  })
  context('Stubs', () => {
    it('Sustituir metodo con valor de retorno ', () => {
      let o = new calc();
      expect(4).to.be.equals(o.suma(2, 2))
      let sumaStub = cy.stub(o, 'suma')
      sumaStub.returns(5)
      o.resta = cy.stub().returns(1)
      expect(5).to.be.equals(o.suma(2, 2))
      expect(o.suma).to.be.called
      expect(1).to.be.equals(o.resta(2, 2))
    })
    it('Reemplazar un método con una función', () => {
      let o = new calc();
      cy.stub(o, 'suma').callsFake((a, b) => 0)
      expect(0).to.be.equals(o.suma(2, 2))
    })
    it('Reemplazar un método con una función o el original', () => {
      let o = new calc();
      let sumaStub = cy.stub(o, 'suma')
      sumaStub
        .withArgs(2, 2).returns(5)
        .withArgs(2, 1).returns(2)
      sumaStub.callsFake(sumaStub.wrappedMethod)
      expect(5).to.be.equals(o.suma(2, 2))
      expect(2).to.be.equals(o.suma(2, 1))
      expect(3).to.be.equals(o.suma(1, 2))
      expect(6).to.be.equals(o.suma(4, 2))
      // cy.log(sumaStub)
      // cy.debug()
      // expect(0).to.be.equals(sumaStub.StubwrappedMethod)
    })

    it('Sustituir metodo por argumentos', () => {
      let o = new calc();
      expect(4).to.be.equals(o.suma(2, 2))
      let sumaStub = cy.stub(o, 'suma')
      sumaStub
        .withArgs(2, 2).returns(5)
        .withArgs(2, 1).returns(0);
      expect(5).to.be.equals(o.suma(2, 2))
      expect(0).to.be.equals(o.suma(2, 1))
      expect(o.suma(1, 2)).not.exist
      sumaStub.returns(11)
      expect(11).to.be.equals(o.suma(1, 2))
    })
    it('Sustituir metodo por llamada', () => {
      let o = new calc();
      let sumaStub = cy.stub(o, 'suma')
      sumaStub.withArgs(2, 2)
        .onFirstCall().returns(1)
        .onSecondCall().returns(2)
        .onCall(3).returns(4);
      sumaStub.returns(0);
      expect(1).to.be.equals(o.suma(2, 2))
      expect(0).to.be.equals(o.suma(1, 2))
      expect(2).to.be.equals(o.suma(2, 2))
      expect(0).to.be.equals(o.suma(2, 1))
      expect(o.suma(2, 2)).not.exist
      expect(4).to.be.equals(o.suma(2, 2))
    })
    it('Reemplace los métodos de Window', () => {
      cy.visit('/alertas', {
        onBeforeLoad(win) {
          cy.stub(win, 'prompt').returns('Hola mundo').as('fakePrompt')
        },
      })
      cy.get('#btnPrompt').click()
      cy.window().its('prompt').should('be.called')
      cy.get('#CuadroAlerta').contains('Hola mundo')
    })
    it('Reemplace fetch OK', () => {
      cy.visit('/compras', {
        onBeforeLoad(win) {
          cy.stub(win, 'fetch').withArgs('api/peliculas?_sort=titulo')
            .resolves({
              ok: true,
              json: () => Promise.resolve([
                {
                  "id": 99,
                  "titulo": "Innocent Affair, An (Don't Trust Your Husband) (Under Suspicion)",
                  "director": "Dorine Haverty",
                  "duración": 99,
                  "genero": "Comedy",
                  "idioma": "French",
                  "precio": 9.95,
                  "año": 2001
                },
                {
                  "id": 100,
                  "titulo": "Damn the Defiant! (H.M.S. Defiant)",
                  "director": "Hillary Baudi",
                  "duración": 151,
                  "genero": "Adventure|Drama",
                  "idioma": "Italian",
                  "precio": 20,
                  "año": 2006
                }
              ]),
            })
        },
      })
      cy.get('#filtroResult').children('li').should('have.length', 2)
    })
    it('Reemplace fetch KO 404', () => {
      cy.visit('/compras', {
        onBeforeLoad(win) {
          cy.stub(win, 'fetch').withArgs('api/peliculas?_sort=titulo')
            .resolves({
              ok: false,
              status: 404,
              statusText: 'Not found',
              json: () => Promise.resolve({ message: 'Error forzado' }),
            })
        },
      })
      cy.get('#CuadroAlerta').should('be.visible')
    })
    it('Reemplace fetch KO data', () => {
      cy.visit('/compras', {
        onBeforeLoad(win) {
          cy.stub(win, 'fetch').withArgs('api/peliculas?_sort=titulo')
            .resolves({
              ok: true,
              json: () => Promise.reject(new Error('Esto no es JSON')),
            })
        },
      })
      cy.get('#CuadroAlerta').should('be.visible')
    })
  })
  context('Clock', () => {
    it('cy.clock()', () => {
      const now = new Date(Date.UTC(2017, 2, 14)).getTime()
      cy.clock(new Date(Date.UTC(2031, 3, 14)).getTime())
      cy.visit('/alertas')
      cy.tick(0)
      cy.get('#currentDate').should('have.text', '2031-04-14T00:00:00.000Z')
    })

    it('cy.tick()', () => {
      cy.clock()
      cy.visit('/alertas')
      cy.tick(1000)
      cy.get('#crono').should('have.text', '1 seconds')
      cy.tick(3000)
      cy.get('#crono').should('have.text', '4 seconds')
      cy.tick(120000)
      cy.get('#crono').should('have.text', '124 seconds')
      cy.get('#currentDate').should('have.text', '1970-01-01T00:02:00.000Z')
    })
  })
})

describe('Comandos', () => {
  xit('Comandos principal', () => {
    cy.visit('/')
    cy.clickLink('Hacer calculos')
    cy.clickDigito(1).console('info').click()
  })
  xit('Comandos secundarios', () => {
    cy.visit('/alertas')
    cy.get('[data-target="#staticBackdrop"]').click()
    //cy.clickDigito('Close')
    cy.get('#staticBackdrop > .modal-dialog > .modal-content > .modal-header > .close').console('info').click().trigger('click')
    // cy.get('button').contains('Close').console('info').trigger('click')
    // cy.getLink('Hacer calculos').click()
  })
  it('Comandos sobreescritos', () => {
    cy.visit('/')
    cy.get('#txtUsuario').type('admin')
    cy.get('#txtPassword').type('P@$$w0rd', { sensitive: true })
  })
})

describe.only('Eventos', () => {
  it('Capturar fail', () => {
    Cypress.once('fail', (error, runnable) => {
      debugger
      throw error
    })
    cy.get('element-that-does-not-exist')
  })
  it('Ignora primer fallo', () => {
    Cypress.once('fail', (error, runnable) => {
      return false
    })
    cy.get('element-that-does-not-exist')
  })
  it('Excepciones no controladas', (done) => {
    cy.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('Excepción no controlada'))
        return false;
      done(err)
    })
    cy.visit('/alertas')
    cy.get('#btnExcepcion').click()
    cy.get('#btnAlert').click()
    cy.wrap({}).then(obj => done())
  })
  it('Selecciona resultado de confirms', () => {
    let rslt = true
    cy.on('window:confirm', (str) => { return rslt; })
    cy.visit('/alertas')
    cy.get('#btnConfirm').then((s) => { rslt = false; return s; }).click()
    cy.get('#txtResultado').should('be.text', 'Respuesta negativa')
    cy.get('#btnConfirm').then((s) => { rslt = true; return s; }).click()
    cy.get('#txtResultado').should('be.text', 'Respuesta positiva')
  })

})