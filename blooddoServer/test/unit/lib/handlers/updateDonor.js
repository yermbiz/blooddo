'use strict';

const Code = require('code');
const Lab = require('lab');
const _ = require('underscore');
const deepEqual = require('deep-equal');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const beforeEach = lab.beforeEach;
const after = lab.after;
const expect = Code.expect;

let standardBody = {
  firstName: 'firstName',
  lastName: 'lastName',
  contactNumber: '+11 111 1111 111',
  email: 'my@email.com',
  bloodGroup: 'A+'
};

function getMocks(body, params, expectedCode, expectedData, done) {
  const req = { body, params };
  const res = { status: (code) => {
    expect(code).to.equal(expectedCode);
    return { send: (data) => {
      if (typeof data == undefined) expect(deepEqual(data, expectedData)).to.be.true();
      done();
    }};
  } };

  return {req, res};
}
describe('updateDonor', () => {
  before(done => {
    done();
  });

  after(done => {
    done();
  });

  it('instantiated', (done) => {
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    expect(updateDonor).to.be.not.null();
    done();
  });

  it('is a function', (done) => {
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    expect(updateDonor).to.be.a.function();
    done();
  });

  it('null arguments throw an error', (done) => {
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    const run = () => updateDonor();
    expect(run).to.throw();
    done();
  });

  it('empty body results in 400 status code', (done) => {
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks({  }, { }, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('missing body parameter "firstName" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.firstName;

    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('missing body parameter "lastName" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.lastName;
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('missing body parameter "contactNumber" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.contactNumber;
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('missing body parameter "email" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.email;
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('missing body parameter "bloodGroup" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.bloodGroup;
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('wrong format of body parameter "firstName" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.firstName = '123';
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('wrong format of body parameter "lastName" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.lastName = '123';
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('wrong format of body parameter "contactNumber" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.contactNumber = '+-123';
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('wrong format of body parameter "email" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.email = 'yyy@';
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('wrong format of body parameter "bloodGroup" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.bloodGroup = 'AAA+';
    const updateDonor = require('../../../../lib/handlers/updateDonor')({});
    let {req, res} = getMocks(body, {}, 400, undefined, done);
    return updateDonor(req, res);
  });

  it('when model returns error, status code 500 returned', (done) => {
    const body = _.clone(standardBody)

    const updateDonor = require('../../../../lib/handlers/updateDonor')({
      findById: (link, callback) => { return callback('error');}
    });

    let {req, res} = getMocks(body,  { link:'link' } , 500, undefined, done);
    return updateDonor(req, res);
  });

  it('when model returns no document, status code 404 returned', (done) => {
    const body = _.clone(standardBody)

    const updateDonor = require('../../../../lib/handlers/updateDonor')({
      findById: (link, callback) => { return callback();}
    });

    let {req, res} = getMocks(body,  { link:'link' } , 404, undefined, done);
    return updateDonor(req, res);
  });

  it('when saving updated document returns an error, status code 500 returned', (done) => {
    const body = _.clone(standardBody)

    const updateDonor = require('../../../../lib/handlers/updateDonor')({
      findById: (link, callback) => { return callback(null, { save: (callback) => {return callback('error');}});}
    });

    let {req, res} = getMocks(body,  { link:'link' } , 500, undefined, done);
    return updateDonor(req, res);
  });

  it('when model returns no document, status code 200 returned', (done) => {

    const body = _.clone(standardBody);
    const updateDonor = require('../../../../lib/handlers/updateDonor')({
      findById: (link, callback) => { return callback(null, { save: (callback) => {return callback(null, {firstName: 'Previous Name', alreadyPresent: 'alreadyPresent'});}, firstName: 'Previous Name', alreadyPresent: 'alreadyPresent'});}
    });

    const expectedResponse = _.clone(standardBody);
    expectedResponse.alreadyPresent = 'alreadyPresent';

    let {req, res} = getMocks(body,  { link:'link' } , 200, expectedResponse, done);
    return updateDonor(req, res);
  });

});
