describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'mikki hiiri',
      username: 'mhhh',
      password: '123456'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login form can be opened', function() {
    cy.contains('Login to application')
    cy.contains('login').click
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      it('fails with wrong credentials', function() {
        cy.contains('login').click()
        cy.get('#username').type('mhhh')
        cy.get('#password').type('123456')
        cy.get('#login-button').click()
        cy.contains('mikki hiiri logged in')
      })
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mhhh')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username:'mhhh', password: '123456', userId: '634814c80f5618a4d39f0c86' })
    })
    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Uusi hyvä blogi')
      cy.get('#author').type('Tekijä')
      cy.get('#url').type('www.sivusto.fi')
      cy.get('#create-button').click()
      cy.contains('Uusi hyvä blogi')
    })

    describe('A few blogs exists..', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'hyvä otsikko', author: 'tekijä', url: 'sivusto' })
        cy.createBlog({ title: 'toinen blogi', author: 'joku muu', url: 'osoite' })
      })
      it('..and it can be liked', function() {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })
      it('..and it can be removed by the one who added the blog', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'hyvä otsikko')
      })
      it('..and the most liked blog is shown at the top', function() {
        cy.contains('hyvä otsikko')
        cy.contains('view').click()    //Klikkaa ensimmäisen viewn auki
        cy.contains('like').click()    //Likettää sitä
        cy.contains('view').click()    //Toisen painikkeen klikkaaminen ei onnistu
        cy.get('likes').eq(0).should('contain', 'hyvä otsikko')
        cy.get('likes').eq(1).should('contain', 'toinen blogi')
      })
    })
  })
})


