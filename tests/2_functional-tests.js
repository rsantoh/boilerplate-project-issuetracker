const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  console.log("Functional test responses");
 suite('POST /api/issues/{project} => issue object', function() {

    test('Crea un problema con cada campo', function(done) {
      chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Título completo',
          issue_text: 'Texto completo',
          created_by: 'Tester',
          assigned_to: 'Asignado',
          status_text: 'En progreso'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Título completo');
          assert.equal(res.body.issue_text, 'Texto completo');
          assert.equal(res.body.created_by, 'Tester');
          assert.equal(res.body.assigned_to, 'Asignado');
          assert.equal(res.body.status_text, 'En progreso');
          assert.property(res.body, '_id');
          testId = res.body._id; // Guardar para siguientes tests
          done();
        });
    });

    test('Crear un problema con sólo los campos requeridos', function(done) {
      chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Solo requeridos',
          issue_text: 'Texto requerido',
          created_by: 'Tester'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Solo requeridos');
          assert.equal(res.body.issue_text, 'Texto requerido');
          assert.equal(res.body.created_by, 'Tester');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.property(res.body, '_id');
          done();
        });
    });

    test('Crear un problema con los campos requeridos faltantes', function(done) {
      chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: ''
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done();
        });
    });

  });

  suite('GET /api/issues/{project}', function() {

    test('Ver problemas en un proyecto', function(done) {
      chai.request(server)
        .get('/api/issues/apitest')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          done();
        });
    });

    test('Ver problemas en un proyecto con un filtro', function(done) {
      chai.request(server)
        .get('/api/issues/apitest')
        .query({ open: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(issue => assert.equal(issue.open, true));
          done();
        });
    });

    test('Ver problemas en un proyecto con múltiples filtros', function(done) {
      chai.request(server)
        .get('/api/issues/apitest')
        .query({ open: true, created_by: 'Tester' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(issue => {
            assert.equal(issue.open, true);
            assert.equal(issue.created_by, 'Tester');
          });
          done();
        });
    });

  });

  suite('PUT /api/issues/{project}', function() {

    test('Actualizar un campo en un problema', function(done) {
      chai.request(server)
        .put('/api/issues/apitest')
        .send({ _id: 1, issue_text: 'Texto actualizado' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', _id: 1 });
          done();
        });
    });

    test('Actualizar varios campos en un problema', function(done) {
      chai.request(server)
        .put('/api/issues/apitest')
        .send({ _id: 1, issue_title: 'Nuevo título', status_text: 'Hecho' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', _id: 1 });
          done();
        });
    });

    test('Actualizar un problema con _id faltante', function(done) {
      chai.request(server)
        .put('/api/issues/apitest')
        .send({ issue_title: 'Sin ID' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

    test('Actualizar un problema sin campos para actualizar', function(done) {
      chai.request(server)
        .put('/api/issues/apitest')
        .send({ _id: 1 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: 1 });
          done();
        });
    });

    test('Actualizar un problema con un _id inválido', function(done) {
      chai.request(server)
        .put('/api/issues/apitest')
        .send({ _id: 'idInvalido123', issue_title: 'Intento fallido' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not update', _id: 'idInvalido123' });
          done();
        });
    });

  });

  suite('DELETE /api/issues/{project}', function() {

    test('Eliminar un problema', function(done) {
      chai.request(server)
        .delete('/api/issues/apitest')
        .send({ _id: 1 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully deleted', _id: 1 });
          done();
        });
    });

    test('Eliminar un problema con un _id inválido', function(done) {
      chai.request(server)
        .delete('/api/issues/apitest')
        .send({ _id: 'idInvalido123' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not delete', _id: 'idInvalido123' });
          done();
        });
    });

    test('Eliminar un problema con _id faltante', function(done) {
      chai.request(server)
        .delete('/api/issues/apitest')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

  });
});
