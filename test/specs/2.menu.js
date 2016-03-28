// Use the external Chai As Promised to deal with resolving promises in
// expectations.

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('导航测试', function () {
  var btn_menu = null;
  var side_menu = null;

  it('必须存在导航按钮以及导航面板', function () {
    "use strict";
    btn_menu = element(by.css('.ion-navicon'));
    side_menu = element(by.css('.side-menu'));
    expect(btn_menu).to.exists;
    expect(side_menu.isPresent).to.exists;
  });

  it('导航功能',function(){
    "use strict";
    btn_menu.click();
    var link = element.all(by.css('.list a')).get(1);
    link.click();
    expect(element(by.css('ion-view.pane[nav-view=active] h1.title')).getText()).to.eventually.equal('Settings');
  })

});
//console.log(;
