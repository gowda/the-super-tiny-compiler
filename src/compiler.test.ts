import { expect } from 'chai';
import compiler from './compiler';

describe('compiler', () => {
  it('compiles the program', () =>
    expect(compiler('(add 2 (subtract 4 2))')).to.eq(
      'add(2, subtract(4, 2));'
    ));
});
