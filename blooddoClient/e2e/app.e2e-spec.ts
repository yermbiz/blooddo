import { BooddoClientPage } from './app.po';

describe('booddo-client App', function() {
  let page: BooddoClientPage;

  beforeEach(() => {
    page = new BooddoClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
