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

function getMocks(body, params, expectedCode, done) {
  const req = { body, params };
  const res = { status: (code) => {
    expect(code).to.equal(expectedCode);
    return { send: () => {
      done();
    }};
  } };

  return {req, res};
}
describe('deleteDonor', () => {
  before(done => {
    done();
  });

  after(done => {
    done();
  });

  it('instantiated', (done) => {
    const deleteDonor = require('../../../../lib/handlers/deleteDonor')({});
    expect(deleteDonor).to.be.not.null();
    done();
  });

  it('is a function', (done) => {
    const deleteDonor = require('../../../../lib/handlers/deleteDonor')({});
    expect(deleteDonor).to.be.a.function();
    done();
  });

  it('null arguments throw an error', (done) => {
    const deleteDonor = require('../../../../lib/handlers/deleteDonor')({});
    const run = () => deleteDonor();
    expect(run).to.throw();
    done();
  });

  it('non-empty body results in 400 status code', (done) => {
    const deleteDonor = require('../../../../lib/handlers/deleteDonor')({});
    let {req, res} = getMocks({ attr:0 }, { }, 400, done);
    return deleteDonor(req, res);
  });

  it('missing link param results in 400 status code', (done) => {
    const deleteDonor = require('../../../../lib/handlers/deleteDonor')({});
    let {req, res} = getMocks({ }, { } , 400, done);
    return deleteDonor(req, res);
  });

  it('when model returns error, status code 500 returned', (done) => {
    const deleteDonor = require('../../../../lib/handlers/deleteDonor')({
      findByIdAndRemove: (link, callback) => { return callback('error');}
    });

    let {req, res} = getMocks({ },  { link:'link' } , 500, done);
    return deleteDonor(req, res);
  });

  it('when model returns document, status code 200 returned', (done) => {
    const deleteDonor = require('../../../../lib/handlers/deleteDonor')({
      findByIdAndRemove: (link, callback) => { return callback(null, {});}
    });
    let {req, res} = getMocks({ },  { link:'link' } , 200, done);
    return deleteDonor(req, res);
  });

});
