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
describe('getDonor', () => {
  before(done => {
    done();
  });

  after(done => {
    done();
  });

  it('instantiated', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({});
    expect(getDonor).to.be.not.null();
    done();
  });

  it('is a function', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({});
    expect(getDonor).to.be.a.function();
    done();
  });

  it('null arguments throw an error', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({});
    const run = () => getDonor();
    expect(run).to.throw();
    done();
  });

  it('missing req.url throw an error', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({});
    const run = () => getDonor({ req: {} });
    expect(run).to.throw();
    done();
  });

  it('url with query string results in 400 status code', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({});
    let {req, res} = getMocks('http://localhost:4200/123456789?a=b&c=d' , { }, 400, done);
    return getDonor(req, res);
  });

  it('missing link param results in 400 status code', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({});
    let {req, res} = getMocks('http://localhost:4200/123456789' , { }, 400, done);
    return getDonor(req, res);
  });

  it('when model returns error, status code 500 returned', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({
      findById: (link, callback) => { return callback('error');}
    });

    let {req, res} = getMocks('http://localhost:4200/123456789',  { link:'link' } , 500, done);
    return getDonor(req, res);
  });

  it('when model returns no docs, status code 404 returned', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({
      findById: (link, callback) => { return callback();}
    });

    let {req, res} = getMocks('http://localhost:4200/123456789',  { link:'link' } , 404, done);
    return getDonor(req, res);
  });

  it('when model returns a document, status code 200 returned', (done) => {
    const getDonor = require('../../../../lib/handlers/getDonor')({
      findById: (link, callback) => { return callback(null, {});}
    });
    let {req, res} = getMocks('http://localhost:4200/123456789',  { link:'link' } , 200, done);
    return getDonor(req, res);
  });

});
