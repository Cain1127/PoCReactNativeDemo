var Mock = require("mockjs"),
    utilities = require("utilities"),
    colors = require('colors'),
    log = [];

function mockRes(res, data) {
  return res.json(Mock.mock(data));
}

function api(app, aUrl, sMethod, fHandle) {
  var data, fData, sUrl,
      sResName = aUrl[aUrl.length - 1],
      sResIdName = ":" + utilities.inflection.singularize(sResName) + "_id",
      oDefaultReqInfo = {
        "get"   : ["get", sResIdName],
        "query" : ["get", false],
        "create": ["post", false],
        "update": ["put", sResIdName],
        "delete": ["delete", sResIdName]
      };

  var aMethod = sMethod.split(":");

  if (fHandle.call) {
    fData = fHandle;
  } else {
    data = fHandle;
    fData = function () {
      return data;
    }
  }

  if (aMethod.length > 1) { // 自定义
    sUrl = aUrl.concat(aMethod[1]).join("/");
    sMethod = aMethod[0];
  } else { // 默认 CRUD
    aMethod = sMethod.split(".");
    var sExt = "";
    if (aMethod.length > 1) { // 有扩展名
      sMethod = aMethod[0];
      sExt = "." + aMethod[1];
    }

    var oReqInfo = oDefaultReqInfo[sMethod];
    if (oReqInfo) {
      sUrl = (oReqInfo[1] ? aUrl.concat(oReqInfo[1]) : aUrl).join("/");
      sMethod = oReqInfo[0];
    } else {
      sUrl = aUrl.concat(sMethod).join("/");
      sMethod = "get";
    }

    sUrl += sExt;
  }

  // 默认以.action为扩展名
  if (!/\.\w+$/.test(sUrl)) {
    sUrl = sUrl + ".action";
  }

  var key = sUrl;
  if (sUrl.indexOf('/') == 0) {
    key = sUrl.split('/').slice(1).join('/');
  }

  log[key] = ["", sMethod.yellow];

  fHandle = function (req, res) {
    Mock.Random.req = req;
    var data = {};
    try {
      data = fData(req, res)
    } catch (err) {
      data.return_code = 500;
      data.return_msg = err.toString();
    }
    mockRes(res, data);
  };

  return {
    method: sMethod,
    url   : sUrl,
    handle: fHandle
  };
}

function mountApis(app, sPath) {
  // sPath to Url
  var aToken = sPath.split("/").length > 1 ? sPath.split("/").slice(1) : sPath.split("\\").slice(1),// remove mock_apis
      sResLast = aToken.pop().slice(0, -3), // remove .js
      aUrl = ['api'],
      aBaseUrl = aUrl.concat(aToken, sResLast);

  // res'name to {name}/{name}_id
  aToken.forEach(function (sResName) {
    aUrl.push(sResName)
    aUrl.push(
        ":" + utilities.inflection.singularize(sResName) + "_id"
    );
  });

  aUrl.push(sResLast);

  var oData = require("./" + sPath),
      oApi = null;
  // has hit route alias preifx ?
  var sUrl = aBaseUrl.join("/"),
      bHitPrefix = false,
      aBaseUrl = aBaseUrl.slice(1);
  ['accentureR-server'].some(function (prefix) {
    if (sUrl.indexOf(prefix) >= 0) { // is prefix
      var start_no_prefix = prefix.split("/").length * 2;
      // reset aUrl
      aUrl = ['', prefix].concat(aUrl.slice(start_no_prefix + 1));
      return bHitPrefix = true;
    }
  });

  for (var k in oData) {
    // res1/res2.json
    oApi = api(app, aBaseUrl, k, oData[k]);
    app[oApi.method](oApi.url, oApi.handle);

    // if bHitPrefix  then  :preifx/res1/res1_id/res2.json
    // unless bHitPrefix then res1/res1_id/res2.json
    oApi = api(app, aUrl, k, oData[k]);
    app[oApi.method](oApi.url, oApi.handle);
  }
}

function routeMockApis(app, dir) {
  if (!dir) dir = "./data/accentureR-server";

  // support ext
  //	app.param("format", function (req, res, next, id) {
  //		req.params['format'] = (req.path.match(/\.\w+$/) || [""])[0];
  //		next();
  //	});

  // add mock apis of dir
  paths = utilities.file.readdirR(dir);

  paths.forEach(function (sPath) {
    if (!/\.js$/.test(sPath)) return;
    mountApis(app, sPath);
  })

  // TODO add alias of mock accentureR-server

}

function serv(app) {
  routeMockApis(app);
  for (var url in log) {
    console.log("", log[url][1].yellow, url);
  }
}

module.exports = {
  serv: serv
};
