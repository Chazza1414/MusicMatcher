import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDislikedSong } from '../disliked-song.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../disliked-song.test-samples';

import { DislikedSongService } from './disliked-song.service';

const requireRestSample: IDislikedSong = {
  ...sampleWithRequiredData,
};

describe('DislikedSong Service', () => {
  let service: DislikedSongService;
  let httpMock: HttpTestingController;
  let expectedResult: IDislikedSong | IDislikedSong[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DislikedSongService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a DislikedSong', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dislikedSong = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(dislikedSong).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DislikedSong', () => {
      const dislikedSong = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(dislikedSong).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DislikedSong', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DislikedSong', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DislikedSong', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDislikedSongToCollectionIfMissing', () => {
      it('should add a DislikedSong to an empty array', () => {
        const dislikedSong: IDislikedSong = sampleWithRequiredData;
        expectedResult = service.addDislikedSongToCollectionIfMissing([], dislikedSong);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dislikedSong);
      });

      it('should not add a DislikedSong to an array that contains it', () => {
        const dislikedSong: IDislikedSong = sampleWithRequiredData;
        const dislikedSongCollection: IDislikedSong[] = [
          {
            ...dislikedSong,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDislikedSongToCollectionIfMissing(dislikedSongCollection, dislikedSong);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DislikedSong to an array that doesn't contain it", () => {
        const dislikedSong: IDislikedSong = sampleWithRequiredData;
        const dislikedSongCollection: IDislikedSong[] = [sampleWithPartialData];
        expectedResult = service.addDislikedSongToCollectionIfMissing(dislikedSongCollection, dislikedSong);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dislikedSong);
      });

      it('should add only unique DislikedSong to an array', () => {
        const dislikedSongArray: IDislikedSong[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const dislikedSongCollection: IDislikedSong[] = [sampleWithRequiredData];
        expectedResult = service.addDislikedSongToCollectionIfMissing(dislikedSongCollection, ...dislikedSongArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const dislikedSong: IDislikedSong = sampleWithRequiredData;
        const dislikedSong2: IDislikedSong = sampleWithPartialData;
        expectedResult = service.addDislikedSongToCollectionIfMissing([], dislikedSong, dislikedSong2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dislikedSong);
        expect(expectedResult).toContain(dislikedSong2);
      });

      it('should accept null and undefined values', () => {
        const dislikedSong: IDislikedSong = sampleWithRequiredData;
        expectedResult = service.addDislikedSongToCollectionIfMissing([], null, dislikedSong, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dislikedSong);
      });

      it('should return initial array if no DislikedSong is added', () => {
        const dislikedSongCollection: IDislikedSong[] = [sampleWithRequiredData];
        expectedResult = service.addDislikedSongToCollectionIfMissing(dislikedSongCollection, undefined, null);
        expect(expectedResult).toEqual(dislikedSongCollection);
      });
    });

    describe('compareDislikedSong', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDislikedSong(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDislikedSong(entity1, entity2);
        const compareResult2 = service.compareDislikedSong(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDislikedSong(entity1, entity2);
        const compareResult2 = service.compareDislikedSong(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDislikedSong(entity1, entity2);
        const compareResult2 = service.compareDislikedSong(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
