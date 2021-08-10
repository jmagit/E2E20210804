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
  describe.only('Comandos', () => {
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

  xcontext('Window', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/window')
    })

    it('cy.window() - get the global window object', () => {
      cy.window().should('have.property', 'top')
    })

    it('cy.document() - get the document object', () => {
      cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
    })

    it('cy.title() - get the title', () => {
      cy.title().should('include', 'Kitchen Sink')
    })
  })
  xcontext('Network Requests', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/network-requests')
    })

    // Manage HTTP requests in your app

    it('cy.request() - make an XHR request', () => {
      // https://on.cypress.io/request
      cy.request('https://jsonplaceholder.cypress.io/comments')
        .should((response) => {
          expect(response.status).to.eq(200)
          // the server sometimes gets an extra comment posted from another machine
          // which gets returned as 1 extra object
          expect(response.body).to.have.property('length').and.be.oneOf([500, 501])
          expect(response).to.have.property('headers')
          expect(response).to.have.property('duration')
        })
    })
  })

  xcontext('Spies, Stubs, and Clock', () => {
    it('cy.spy() - wrap a method in a spy', () => {
      // https://on.cypress.io/spy
      cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')

      const obj = {
        foo() { },
      }

      const spy = cy.spy(obj, 'foo').as('anyArgs')

      obj.foo()

      expect(spy).to.be.called
    })

    it('cy.spy() retries until assertions pass', () => {
      cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')

      const obj = {
        /**
         * Prints the argument passed
         * @param x {any}
        */
        foo(x) {
          console.log('obj.foo called with', x)
        },
      }

      cy.spy(obj, 'foo').as('foo')

      setTimeout(() => {
        obj.foo('first')
      }, 500)

      setTimeout(() => {
        obj.foo('second')
      }, 2500)

      cy.get('@foo').should('have.been.calledTwice')
    })

    it('cy.stub() - create a stub and/or replace a function with stub', () => {
      // https://on.cypress.io/stub
      cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')

      const obj = {
        /**
         * prints both arguments to the console
         * @param a {string}
         * @param b {string}
        */
        foo(a, b) {
          console.log('a', a, 'b', b)
        },
      }

      const stub = cy.stub(obj, 'foo').as('foo')

      obj.foo('foo', 'bar')

      expect(stub).to.be.called
    })

    it('cy.clock() - control time in the browser', () => {
      // https://on.cypress.io/clock

      // create the date in UTC so its always the same
      // no matter what local timezone the browser is running in
      const now = new Date(Date.UTC(2017, 2, 14)).getTime()

      cy.clock(now)
      cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')
      cy.get('#clock-div').click()
        .should('have.text', '1489449600')
    })

    it('cy.tick() - move time in the browser', () => {
      // https://on.cypress.io/tick

      // create the date in UTC so its always the same
      // no matter what local timezone the browser is running in
      const now = new Date(Date.UTC(2017, 2, 14)).getTime()

      cy.clock(now)
      cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')
      cy.get('#tick-div').click()
        .should('have.text', '1489449600')

      cy.tick(10000) // 10 seconds passed
      cy.get('#tick-div').click()
        .should('have.text', '1489449610')
    })

    it('cy.stub() matches depending on arguments', () => {
      // see all possible matchers at
      // https://sinonjs.org/releases/latest/matchers/
      const greeter = {
        /**
         * Greets a person
         * @param {string} name
        */
        greet(name) {
          return `Hello, ${name}!`
        },
      }

      cy.stub(greeter, 'greet')
        .callThrough() // if you want non-matched calls to call the real method
        .withArgs(Cypress.sinon.match.string).returns('Hi')
        .withArgs(Cypress.sinon.match.number).throws(new Error('Invalid name'))

      expect(greeter.greet('World')).to.equal('Hi')
      // @ts-ignore
      expect(() => greeter.greet(42)).to.throw('Invalid name')
      expect(greeter.greet).to.have.been.calledTwice

      // non-matched calls goes the actual method
      // @ts-ignore
      expect(greeter.greet()).to.equal('Hello, undefined!')
    })

    it('matches call arguments using Sinon matchers', () => {
      // see all possible matchers at
      // https://sinonjs.org/releases/latest/matchers/
      const calculator = {
        /**
         * returns the sum of two arguments
         * @param a {number}
         * @param b {number}
        */
        add(a, b) {
          return a + b
        },
      }

      const spy = cy.spy(calculator, 'add').as('add')

      expect(calculator.add(2, 3)).to.equal(5)

      // if we want to assert the exact values used during the call
      expect(spy).to.be.calledWith(2, 3)

      // let's confirm "add" method was called with two numbers
      expect(spy).to.be.calledWith(Cypress.sinon.match.number, Cypress.sinon.match.number)

      // alternatively, provide the value to match
      expect(spy).to.be.calledWith(Cypress.sinon.match(2), Cypress.sinon.match(3))

      // match any value
      expect(spy).to.be.calledWith(Cypress.sinon.match.any, 3)

      // match any value from a list
      expect(spy).to.be.calledWith(Cypress.sinon.match.in([1, 2, 3]), 3)

      /**
       * Returns true if the given number is event
       * @param {number} x
       */
      const isEven = (x) => x % 2 === 0

      // expect the value to pass a custom predicate function
      // the second argument to "sinon.match(predicate, message)" is
      // shown if the predicate does not pass and assertion fails
      expect(spy).to.be.calledWith(Cypress.sinon.match(isEven, 'isEven'), 3)

      /**
       * Returns a function that checks if a given number is larger than the limit
       * @param {number} limit
       * @returns {(x: number) => boolean}
       */
      const isGreaterThan = (limit) => (x) => x > limit

      /**
       * Returns a function that checks if a given number is less than the limit
       * @param {number} limit
       * @returns {(x: number) => boolean}
       */
      const isLessThan = (limit) => (x) => x < limit

      // you can combine several matchers using "and", "or"
      expect(spy).to.be.calledWith(
        Cypress.sinon.match.number,
        Cypress.sinon.match(isGreaterThan(2), '> 2').and(Cypress.sinon.match(isLessThan(4), '< 4')),
      )

      expect(spy).to.be.calledWith(
        Cypress.sinon.match.number,
        Cypress.sinon.match(isGreaterThan(200), '> 200').or(Cypress.sinon.match(3)),
      )

      // matchers can be used from BDD assertions
      cy.get('@add').should('have.been.calledWith',
        Cypress.sinon.match.number, Cypress.sinon.match(3))

      // you can alias matchers for shorter test code
      const { match: M } = Cypress.sinon

      cy.get('@add').should('have.been.calledWith', M.number, M(3))
    })
  })

})

