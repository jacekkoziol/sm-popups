import { SmPopupsPage } from './app.po';

describe('sm-popups App', function() {
  let page: SmPopupsPage;

  beforeEach(() => {
    page = new SmPopupsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
