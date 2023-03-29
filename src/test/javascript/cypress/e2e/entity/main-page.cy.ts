import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('MainPage e2e test', () => {
  const mainPagePageUrl = '/main-page';
  const mainPagePageUrlPattern = new RegExp('/main-page(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const mainPageSample = {};

  let mainPage: string | undefined;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/main-pages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/main-pages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/main-pages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (mainPage) {
      // @ts-ignore
      cy.authenticatedRequest({
        method: 'DELETE',
        // @ts-ignore
        url: `/api/main-pages/${mainPage.id}`,
      }).then(() => {
        mainPage = undefined;
      });
    }
  });

  it('MainPages menu should load MainPages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('main-page');
    cy.wait('@entitiesRequest').then(({ response }) => {
      // @ts-ignore
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MainPage').should('exist');
    cy.url().should('match', mainPagePageUrlPattern);
  });

  describe('MainPage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(mainPagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MainPage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/main-page/new$'));
        cy.getEntityCreateUpdateHeading('MainPage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mainPagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/main-pages',
          body: mainPageSample,
        }).then(({ body }) => {
          mainPage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/main-pages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [mainPage],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(mainPagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MainPage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('mainPage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mainPagePageUrlPattern);
      });

      it('edit button click should load edit MainPage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MainPage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mainPagePageUrlPattern);
      });

      it('edit button click should load edit MainPage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MainPage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mainPagePageUrlPattern);
      });

      it('last delete button click should delete instance of MainPage', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('mainPage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mainPagePageUrlPattern);

        mainPage = undefined;
      });
    });
  });

  describe('new MainPage page', () => {
    beforeEach(() => {
      cy.visit(`${mainPagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('MainPage');
    });

    it('should create an instance of MainPage', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        // @ts-ignore
        expect(response.statusCode).to.equal(201);
        // @ts-ignore
        mainPage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        // @ts-ignore
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', mainPagePageUrlPattern);
    });
  });
});
