'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const beforeEach = lab.beforeEach;
const after = lab.after;
const expect = Code.expect;

function getMocks(url, params, expectedCode, done) {
  const req = { url, params };
  const res = { status: (code) => {
    expect(code).to.equal(expectedCode);
    return { send: () => {
      done();
    }};
  } };

  return {req, res};
}
describe('getDonors', () => {
  before(done => {
    done();
  });

  after(done => {
    done();
  });

  it('instantiated', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    expect(getDonors).to.be.not.null();
    done();
  });

  it('is a function', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    expect(getDonors).to.be.a.function();
    done();
  });

  it('null arguments throw an error', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    const run = () => getDonors();
    expect(run).to.throw();
    done();
  });

  it('missing req.url throw an error', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    const run = () => getDonors({ req: {} });
    expect(run).to.throw();
    done();
  });

  it('url with wrong query string results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?a=b&c=d' , { }, 400, done);
    return getDonors(req, res);
  });

  it('url with missing xmin param results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?&xmax=999&ymin=0&ymax=999' , { }, 400, done);
    return getDonors(req, res);
  });

  it('url with missing xmax param results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&ymin=0&ymax=999' , { }, 400, done);
    return getDonors(req, res);
  });

  it('url with missing ymin param results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&xmax=999&ymax=999' , { }, 400, done);
    return getDonors(req, res);
  });

  it('url with missing ymax param results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&xmax=999&ymin=0' , { }, 400, done);
    return getDonors(req, res);
  });

  it('url with wrong format of xmin param results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=abcd&xmax=999&ymin=0&ymax=999' , { }, 400, done);
    return getDonors(req, res);
  });

  it('url with wrong format of xmax param results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&xmax=abcd&ymin=0&ymax=999' , { }, 400, done);
    return getDonors(req, res);
  });

  it('url with wrong format of ymin param results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&xmax=999&ymin=abcd&ymax=999' , { }, 400, done);
    return getDonors(req, res);
  });

  it('url with wrong format of ymin param results in 400 status code', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&xmax=999&ymin=0&ymax=abcd' , { }, 400, done);
    return getDonors(req, res);
  });

  it('when model returns error, status code 500 returned', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({
      find: (link, callback) => { return callback('error');}
    });

    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&xmax=999&ymin=0&ymax=999',  { } , 500, done);
    return getDonors(req, res);
  });

  it('when model returns no docs, status code 200 returned', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({
      find: (link, callback) => { return callback();}
    });

    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&xmax=999&ymin=0&ymax=999',  { } , 200, done);
    return getDonors(req, res);
  });

  it('when model returns documents, status code 200 returned', (done) => {
    const getDonors = require('../../../../lib/handlers/getDonors')({
      find: (link, callback) => { return callback(null, {});}
    });
    let {req, res} = getMocks('http://localhost:4200/123456789?xmin=0&xmax=999&ymin=0&ymax=999',  { } , 200, done);
    return getDonors(req, res);
  });

});
