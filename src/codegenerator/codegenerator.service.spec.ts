import { Test, TestingModule } from '@nestjs/testing';
import { CodegeneratorService } from './codegenerator.service';

describe('CodegeneratorService', () => {
  let service: CodegeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodegeneratorService],
    }).compile();

    service = module.get<CodegeneratorService>(CodegeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
