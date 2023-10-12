import { Test, TestingModule } from '@nestjs/testing';
import { Calendar } from './calendar';

describe('Calendar', () => {
    let provider: Calendar;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Calendar],
        }).compile();

        provider = module.get<Calendar>(Calendar);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
