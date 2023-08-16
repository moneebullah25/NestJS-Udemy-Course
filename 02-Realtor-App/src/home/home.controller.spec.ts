import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';

// All test cases inside the describe to create a single test suite
// First Argument takes in a string to set the name of the test suite
// Second Argument takes in the callback function to implements the test cases
describe('HomeController', () => {
  let controller: HomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
    }).compile();

    controller = module.get<HomeController>(HomeController);
  });

  // Specific test using the it block
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
