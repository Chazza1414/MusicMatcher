import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LogsComponent } from './logs.component';
import { LogsService } from './logs.service';
import { Log, LoggersResponse } from './log.model';

describe('LogsComponent', () => {
  let comp: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;
  let service: LogsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LogsComponent],
      providers: [LogsService],
    })
      .overrideTemplate(LogsComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LogsService);
  });

  describe('OnInit', () => {
    it('should set all default values correctly', () => {
      // @ts-ignore
      expect(comp.filter).toBe('');
      // @ts-ignore
      expect(comp.orderProp).toBe('name');
      // @ts-ignore
      expect(comp.ascending).toBe(true);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const log = new Log('main', 'WARN');
      jest.spyOn(service, 'findAll').mockReturnValue(
        of({
          loggers: {
            main: {
              effectiveLevel: 'WARN',
            },
          },
        } as unknown as LoggersResponse)
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      // @ts-ignore
      expect(service.findAll).toHaveBeenCalled();
      // @ts-ignore
      expect(comp.loggers?.[0]).toEqual(expect.objectContaining(log));
    });
  });

  describe('change log level', () => {
    it('should change log level correctly', () => {
      // GIVEN
      const log = new Log('main', 'ERROR');
      jest.spyOn(service, 'changeLevel').mockReturnValue(of({}));
      jest.spyOn(service, 'findAll').mockReturnValue(
        of({
          loggers: {
            main: {
              effectiveLevel: 'ERROR',
            },
          },
        } as unknown as LoggersResponse)
      );

      // WHEN
      comp.changeLevel('main', 'ERROR');

      // THEN
      // @ts-ignore
      expect(service.changeLevel).toHaveBeenCalled();
      // @ts-ignore
      expect(service.findAll).toHaveBeenCalled();
      // @ts-ignore
      expect(comp.loggers?.[0]).toEqual(expect.objectContaining(log));
    });
  });
});
