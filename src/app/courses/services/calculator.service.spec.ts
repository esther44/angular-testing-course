import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {

  let calculator: CalculatorService,
    loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']); // fake dependancy service

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy} // dependancies (mock implementation)
      ]
    });
    calculator = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    const result = calculator.add(2, 2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtrack two numbers', () => {
    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'unexpected substraction result');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
