describe('Bloglist', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Tester',
      username: 'tester',
      password: 'secretpass'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000/')
  })
  it('login page should be opened if user is not logged in', () => {
    cy.contains('log in to application')
    cy.contains('login')
  })

  it('user should be able to login with correct username and password', () => {
    cy.get('[data-cy=username]').type('tester')
    cy.get('[data-cy=password]').type('secretpass')
    cy.get('[data-cy=login]').click()
    cy.get('[data-cy=title]').contains('blogs')
  })

  it('should show notification if username or password are incorrect', () => {
    cy.get('[data-cy=username]').type('tester')
    cy.get('[data-cy=password]').type('wrongpass')
    cy.get('[data-cy=login]').click()
    cy.get('[data-cy=notification]').contains('wrong username or password')
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.get('[data-cy=username]').type('tester')
      cy.get('[data-cy=password]').type('secretpass')
      cy.get('[data-cy=login]').click()
    })

    it('name of the user is shown in navigation', () => {
      cy.get('[data-cy=navigation]').contains('Tester logged in')
    })

    it('user can logout', () => {
      cy.get('[data-cy=navigation]').contains('logout').click()
      cy.contains('log in to application')
      cy.contains('login')
    })

    it('user can create a new blog', () => {
      cy.get('[data-cy=toggleOpen]').click()
      cy.get('[data-cy=formTitle]').type('Test blog')
      cy.get('[data-cy=formAuthor]').type('Test author')
      cy.get('[data-cy=formUrl]').type('https://fullstackopen.com/')
      cy.get('[data-cy=formSubmit]').click()
      cy.get('[data-cy=notification]').contains('a new blog Test blog by Test author added')
      cy.get('[data-cy=blogTable]').contains('Test blog')
      cy.get('[data-cy=blogTable]').contains('Test author')
    })

    it('user can navigate to users page', () => {
      cy.get('[data-cy=usersTabLink]').click()
      cy.get('[data-cy=usersTab]').contains('Users')
      cy.get('[data-cy=usersTable]').contains('Tester')
    })

    it('user can view information about the user', () => {
      cy.get('[data-cy=usersTabLink]').click()
      cy.get('[data-cy=usersTable]').contains('Tester').click()
      cy.get('[data-cy=userView]').contains('Tester')
      cy.get('[data-cy=userView]').contains('blogs created')
    })

    describe('when atleast one blog exists', () => {
      beforeEach(() => {
        cy.get('[data-cy=toggleOpen]').click()
        cy.get('[data-cy=formTitle]').type('Test blog')
        cy.get('[data-cy=formAuthor]').type('Test author')
        cy.get('[data-cy=formUrl]').type('https://www.fullstackopen.com/')
        cy.get('[data-cy=formSubmit]').click()
      })

      it('user can view more information about a blog', () => {
        cy.get('[data-cy=blogTable]').contains('Test blog').click()
        cy.get('[data-cy=blogCard]').contains('Test blog Test author')
        cy.get('[data-cy=blogCard]').contains('added by Tester')
        cy.get('[data-cy=commentsHeader]').contains('comments')
      })

      it('user can like a blog', () => {
        cy.get('[data-cy=blogTable]').contains('Test blog').click()
        cy.get('[data-cy=blogLikes]').contains('0')
        cy.get('[data-cy=likeButton]').click()
        cy.get('[data-cy=notification]').contains('blog Test blog by Test author liked!')
        cy.get('[data-cy=blogLikes]').contains('1')
      })
     
      it('user can comment on a blog', () => {
        cy.get('[data-cy=blogTable]').contains('Test blog').click()
        cy.get('[data-cy=commentInput]').type('this is a comment')
        cy.get('[data-cy=addComment]').click()
        cy.get('[data-cy=notification]').contains('commented blog Test blog')
        cy.get('[data-cy=comments]').contains('this is a comment')
      })

      it('user can delete a blog', () => {
        cy.get('[data-cy=blogTable]').contains('Test blog').click()
        cy.get('[data-cy=removeButton]').click()
        cy.get('[data-cy=notification]').contains('blog Test blog by Test author removed!')
        cy.get('[data-cy=blogTable]').should('not.contain', 'Test blog')
      })
    })
  })
})