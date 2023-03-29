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

describe('Song e2e test', () => {
  const songPageUrl = '/song';
  const songPageUrlPattern = new RegExp('/song(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const songSample = { id: '5511b843-8709-49bb-b11d-0679986ae398', artist: 'USB', title: 'deposit Maine Checking' };

  let song: string | undefined;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/songs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/songs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/songs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (song) {
      cy.authenticatedRequest({
        method: 'DELETE',
        // @ts-ignore
        url: `/api/songs/${song.id}`,
      }).then(() => {
        song = undefined;
      });
    }
  });

  it('Songs menu should load Songs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('song');
    cy.wait('@entitiesRequest').then(({ response }) => {
      // @ts-ignore
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Song').should('exist');
    cy.url().should('match', songPageUrlPattern);
  });

  describe('Song page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(songPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Song page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/song/new$'));
        cy.getEntityCreateUpdateHeading('Song');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', songPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/songs',
          body: songSample,
        }).then(({ body }) => {
          song = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/songs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [song],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(songPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Song page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('song');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', songPageUrlPattern);
      });

      it('edit button click should load edit Song page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Song');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', songPageUrlPattern);
      });

      it('edit button click should load edit Song page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Song');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', songPageUrlPattern);
      });

      it('last delete button click should delete instance of Song', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('song').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          // @ts-ignore
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', songPageUrlPattern);

        song = undefined;
      });
    });
  });

  describe('new Song page', () => {
    beforeEach(() => {
      cy.visit(`${songPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Song');
    });

    it('should create an instance of Song', () => {
      cy.get(`[data-cy="id"]`).type('75d1c238-f5ed-41b6-8cce-5179c5780659').should('have.value', '75d1c238-f5ed-41b6-8cce-5179c5780659');

      cy.get(`[data-cy="artist"]`).type('tolerance').should('have.value', 'tolerance');

      cy.get(`[data-cy="title"]`).type('exuding Chicken').should('have.value', 'exuding Chicken');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        // @ts-ignore
        expect(response.statusCode).to.equal(201);
        // @ts-ignore
        song = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        // @ts-ignore
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', songPageUrlPattern);
    });
  });
});
