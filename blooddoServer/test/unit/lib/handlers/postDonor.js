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
  bloodGroup: 'A+',
  lat: 50.00,
  lon: -40.00,
  address: '333 Post St, San Francisco, CA 94108, USA',
  ip: '10.11.12.13',
  x:  10,
  y:  20
};

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
describe('postDonor', () => {
  before(done => {
    done();
  });

  after(done => {
    done();
  });

  it('instantiated', (done) => {
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    expect(postDonor).to.be.not.null();
    done();
  });

  it('is a function', (done) => {
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    expect(postDonor).to.be.a.function();
    done();
  });

  it('null arguments throw an error', (done) => {
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    const run = () => postDonor();
    expect(run).to.throw();
    done();
  });

  it('empty body results in 400 status code', (done) => {
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks({  }, { }, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "firstName" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.firstName;

    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "lastName" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.lastName;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "contactNumber" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.contactNumber;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "email" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.email;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "bloodGroup" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.bloodGroup;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "lat" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.lat;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "lon" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.lon;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "address" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.address;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "ip" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.ip;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "x" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.x;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('missing body parameter "y" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    delete body.y;
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "firstName" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.firstName = '123';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "lastName" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.lastName = '123';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "contactNumber" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.contactNumber = '+-123';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "email" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.email = 'yyy@';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "bloodGroup" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.bloodGroup = 'AAA+';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "lan" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.lan = 'abc';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "lon" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.lon = 'abc';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "ip" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.ip = '1.2.3';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "x" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.x = 'a';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('wrong format of body parameter "y" results in 400 status code', (done) => {
    const body = _.clone(standardBody)
    body.x = 'a';
    const postDonor = require('../../../../lib/handlers/postDonor')({});
    let {req, res} = getMocks(body, {}, 400, done);
    return postDonor(req, res);
  });

  it('when model returns error, status code 500 returned', (done) => {
    const body = _.clone(standardBody)
    function Model(data) {
      expect(deepEqual(body, data)).to.be.true();
    }
    Model.prototype.save = function(callback) {
      return callback('error');
    };
    const postDonor = require('../../../../lib/handlers/postDonor')(Model);

    let {req, res} = getMocks(body,  {} , 500, done);
    return postDonor(req, res);
  });

  it('when model returns a document, status code 201 returned', (done) => {
    const body = _.clone(standardBody)
    function Model(data) {
      expect(deepEqual(body, data)).to.be.true();
    }
    Model.prototype.save = function(callback) {
      return callback(null, {});
    };
    const postDonor = require('../../../../lib/handlers/postDonor')(Model);

    let {req, res} = getMocks(body,  {} , 201, done);
    return postDonor(req, res);
  });

});
