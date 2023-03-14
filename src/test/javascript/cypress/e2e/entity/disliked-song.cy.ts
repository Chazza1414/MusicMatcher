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

describe('DislikedSong e2e test', () => {
  const dislikedSongPageUrl = '/disliked-song';
  const dislikedSongPageUrlPattern = new RegExp('/disliked-song(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const dislikedSongSample = { chosen: false };

  let dislikedSong;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/disliked-songs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/disliked-songs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/disliked-songs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (dislikedSong) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/disliked-songs/${dislikedSong.id}`,
      }).then(() => {
        dislikedSong = undefined;
      });
    }
  });

  it('DislikedSongs menu should load DislikedSongs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('disliked-song');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('DislikedSong').should('exist');
    cy.url().should('match', dislikedSongPageUrlPattern);
  });

  describe('DislikedSong page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(dislikedSongPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create DislikedSong page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/disliked-song/new$'));
        cy.getEntityCreateUpdateHeading('DislikedSong');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dislikedSongPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/disliked-songs',
          body: dislikedSongSample,
        }).then(({ body }) => {
          dislikedSong = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/disliked-songs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [dislikedSong],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(dislikedSongPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details DislikedSong page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('dislikedSong');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dislikedSongPageUrlPattern);
      });

      it('edit button click should load edit DislikedSong page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DislikedSong');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dislikedSongPageUrlPattern);
      });

      it('edit button click should load edit DislikedSong page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DislikedSong');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dislikedSongPageUrlPattern);
      });

      it('last delete button click should delete instance of DislikedSong', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('dislikedSong').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dislikedSongPageUrlPattern);

        dislikedSong = undefined;
      });
    });
  });

  describe('new DislikedSong page', () => {
    beforeEach(() => {
      cy.visit(`${dislikedSongPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('DislikedSong');
    });

    it('should create an instance of DislikedSong', () => {
      cy.get(`[data-cy="chosen"]`).should('not.be.checked');
      cy.get(`[data-cy="chosen"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        dislikedSong = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', dislikedSongPageUrlPattern);
    });
  });
});
