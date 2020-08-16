import { ApiVersionPipe } from './api-version.pipe';

describe('ApiVersionPipe', () => {
  it('create an instance', () => {
    const pipe = new ApiVersionPipe();
    expect(pipe).toBeTruthy();
  });
});
