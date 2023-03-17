import { IMainPage, NewMainPage } from './main-page.model';

export const sampleWithRequiredData: IMainPage = {
  id: 36901,
};

export const sampleWithPartialData: IMainPage = {
  id: 78378,
};

export const sampleWithFullData: IMainPage = {
  id: 4043,
};

export const sampleWithNewData: NewMainPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
