// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('基本测试', function () {

  it('必要依赖项目', function () {
    expect(protractor).to.exist;
    expect(browser).to.exist;
    expect(by).to.exist;
    expect(element).to.exist;
    expect($).to.exist;
  });

  it('平台运行情况', function () {
    browser.get('http://localhost:4000/');
    this.timeout(15000);
    expect(browser.getTitle()).to.eventually.equal('iaccenturer');
  });

});