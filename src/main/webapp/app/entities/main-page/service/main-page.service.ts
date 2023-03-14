import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMainPage, NewMainPage } from '../main-page.model';

export type PartialUpdateMainPage = Partial<IMainPage> & Pick<IMainPage, 'id'>;

export type EntityResponseType = HttpResponse<IMainPage>;
export type EntityArrayResponseType = HttpResponse<IMainPage[]>;

@Injectable({ providedIn: 'root' })
export class MainPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/main-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mainPage: NewMainPage): Observable<EntityResponseType> {
    return this.http.post<IMainPage>(this.resourceUrl, mainPage, { observe: 'response' });
  }

  update(mainPage: IMainPage): Observable<EntityResponseType> {
    return this.http.put<IMainPage>(`${this.resourceUrl}/${this.getMainPageIdentifier(mainPage)}`, mainPage, { observe: 'response' });
  }

  partialUpdate(mainPage: PartialUpdateMainPage): Observable<EntityResponseType> {
    return this.http.patch<IMainPage>(`${this.resourceUrl}/${this.getMainPageIdentifier(mainPage)}`, mainPage, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMainPage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMainPage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMainPageIdentifier(mainPage: Pick<IMainPage, 'id'>): number {
    return mainPage.id;
  }

  compareMainPage(o1: Pick<IMainPage, 'id'> | null, o2: Pick<IMainPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getMainPageIdentifier(o1) === this.getMainPageIdentifier(o2) : o1 === o2;
  }

  addMainPageToCollectionIfMissing<Type extends Pick<IMainPage, 'id'>>(
    mainPageCollection: Type[],
    ...mainPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mainPages: Type[] = mainPagesToCheck.filter(isPresent);
    if (mainPages.length > 0) {
      const mainPageCollectionIdentifiers = mainPageCollection.map(mainPageItem => this.getMainPageIdentifier(mainPageItem)!);
      const mainPagesToAdd = mainPages.filter(mainPageItem => {
        const mainPageIdentifier = this.getMainPageIdentifier(mainPageItem);
        if (mainPageCollectionIdentifiers.includes(mainPageIdentifier)) {
          return false;
        }
        mainPageCollectionIdentifiers.push(mainPageIdentifier);
        return true;
      });
      return [...mainPagesToAdd, ...mainPageCollection];
    }
    return mainPageCollection;
  }
}
