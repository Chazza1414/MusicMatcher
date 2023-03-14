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

describe('LikedSong e2e test', () => {
  const likedSongPageUrl = '/liked-song';
  const likedSongPageUrlPattern = new RegExp('/liked-song(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const likedSongSample = { chosen: true };

  let likedSong;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/liked-songs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/liked-songs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/liked-songs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (likedSong) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/liked-songs/${likedSong.id}`,
      }).then(() => {
        likedSong = undefined;
      });
    }
  });

  it('LikedSongs menu should load LikedSongs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('liked-song');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('LikedSong').should('exist');
    cy.url().should('match', likedSongPageUrlPattern);
  });

  describe('LikedSong page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(likedSongPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create LikedSong page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/liked-song/new$'));
        cy.getEntityCreateUpdateHeading('LikedSong');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedSongPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/liked-songs',
          body: likedSongSample,
        }).then(({ body }) => {
          likedSong = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/liked-songs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [likedSong],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(likedSongPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details LikedSong page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('likedSong');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedSongPageUrlPattern);
      });

      it('edit button click should load edit LikedSong page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LikedSong');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedSongPageUrlPattern);
      });

      it('edit button click should load edit LikedSong page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LikedSong');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedSongPageUrlPattern);
      });

      it('last delete button click should delete instance of LikedSong', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('likedSong').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedSongPageUrlPattern);

        likedSong = undefined;
      });
    });
  });

  describe('new LikedSong page', () => {
    beforeEach(() => {
      cy.visit(`${likedSongPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('LikedSong');
    });

    it('should create an instance of LikedSong', () => {
      cy.get(`[data-cy="chosen"]`).should('not.be.checked');
      cy.get(`[data-cy="chosen"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        likedSong = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', likedSongPageUrlPattern);
    });
  });
});
