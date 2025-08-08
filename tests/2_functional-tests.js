// const chaiHttp = require('chai-http');
// const chai = require('chai');
// const assert = chai.assert;
// const server = require('../server');

// chai.use(chaiHttp);

// suite('Functional Tests', function() {
 
//    suite('POST /api/issues/{project} => issue object', function () {

//     test('Crear un problema con cada campo', function (done) {
//       chai.request(server)
//         .post('/api/issues/apitest')
//         .send({
//           issue_title: 'Título completo',
//           issue_text: 'Texto completo',
//           created_by: 'Tester',
//           assigned_to: 'Dev',
//           status_text: 'En progreso'
//         })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.equal(res.body.issue_title, 'Título completo');
//           assert.equal(res.body.issue_text, 'Texto completo');
//           assert.equal(res.body.created_by, 'Tester');
//           assert.equal(res.body.assigned_to, 'Dev');
//           assert.equal(res.body.status_text, 'En progreso');
//           assert.exists(res.body.created_on);
//           assert.exists(res.body.updated_on);
//           assert.isTrue(res.body.open);
//           assert.exists(res.body._id);
//           createdId = res.body._id;
//           done();
//         });
//     });

//     test('Crear un problema con sólo los campos requeridos', function (done) {
//       chai.request(server)
//         .post('/api/issues/apitest')
//         .send({
//           issue_title: 'Título requerido',
//           issue_text: 'Texto requerido',
//           created_by: 'Tester'
//         })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.equal(res.body.assigned_to, '');
//           assert.equal(res.body.status_text, '');
//           done();
//         });
//     });

//     test('Crear un problema con campos requeridos faltantes', function (done) {
//       chai.request(server)
//         .post('/api/issues/apitest')
//         .send({
//           issue_title: 'Falta texto'
//         })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { error: 'required field(s) missing' });
//           done();
//         });
//     });
//   });

//   suite('GET /api/issues/{project} => Array de issues', function () {

//     test('Ver problemas en un proyecto', function (done) {
//       chai.request(server)
//         .get('/api/issues/apitest')
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.isArray(res.body);
//           assert.property(res.body[0], 'issue_title');
//           assert.property(res.body[0], 'issue_text');
//           done();
//         });
//     });

//     test('Ver problemas en un proyecto con un filtro', function (done) {
//       chai.request(server)
//         .get('/api/issues/apitest')
//         .query({ created_by: 'Tester' })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           res.body.forEach(issue => {
//             assert.equal(issue.created_by, 'Tester');
//           });
//           done();
//         });
//     });

//     test('Ver problemas en un proyecto con múltiples filtros', function (done) {
//       chai.request(server)
//         .get('/api/issues/apitest')
//         .query({ created_by: 'Tester', open: 'true' })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           res.body.forEach(issue => {
//             assert.equal(issue.created_by, 'Tester');
//             assert.equal(issue.open, true);
//           });
//           done();
//         });
//     });
//   });

//   suite('PUT /api/issues/{project}', function () {

//     test('Actualizar un campo en un problema', function (done) {
//       chai.request(server)
//         .put('/api/issues/apitest')
//         .send({ _id: createdId, issue_text: 'Texto actualizado' })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { result: 'successfully updated', _id: createdId });
//           done();
//         });
//     });

//     test('Actualizar varios campos en un problema', function (done) {
//       chai.request(server)
//         .put('/api/issues/apitest')
//         .send({ _id: createdId, issue_title: 'Nuevo título', status_text: 'Hecho' })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { result: 'successfully updated', _id: createdId });
//           done();
//         });
//     });

//     test('Actualizar un problema con _id faltante', function (done) {
//       chai.request(server)
//         .put('/api/issues/apitest')
//         .send({ issue_title: 'Sin ID' })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { error: 'missing _id' });
//           done();
//         });
//     });

//     test('Actualizar un problema sin campos para actualizar', function (done) {
//       chai.request(server)
//         .put('/api/issues/apitest')
//         .send({ _id: createdId })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: createdId });
//           done();
//         });
//     });

//     test('Actualizar un problema con un _id inválido', function (done) {
//       chai.request(server)
//         .put('/api/issues/apitest')
//         .send({ _id: 'idInvalido123', issue_title: 'Intento fallido' })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { error: 'could not update', _id: 'idInvalido123' });
//           done();
//         });
//     });
//   });

//   suite('DELETE /api/issues/{project}', function () {

//     test('Eliminar un problema', function (done) {
//       chai.request(server)
//         .delete('/api/issues/apitest')
//         .send({ _id: createdId })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { result: 'successfully deleted', _id: createdId });
//           done();
//         });
//     });

//     test('Eliminar un problema con un _id inválido', function (done) {
//       chai.request(server)
//         .delete('/api/issues/apitest')
//         .send({ _id: 'idInvalido123' })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { error: 'could not delete', _id: 'idInvalido123' });
//           done();
//         });
//     });

//     test('Eliminar un problema con _id faltante', function (done) {
//       chai.request(server)
//         .delete('/api/issues/apitest')
//         .send({})
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.deepEqual(res.body, { error: 'missing _id' });
//           done();
//         });
//     });
//   });  

//   test('✅ Todas las pruebas funcionales completadas', function() {
//     assert.isTrue(true);
//   });
// });

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server'); // Ajusta la ruta si es necesario

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testId1; // para guardar _id del issue creado
  let testId2;

  const project = 'testproject';

  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/' + project)
      .send({
        issue_title: 'Title 1',
        issue_text: 'Text 1',
        created_by: 'Functional Test',
        assigned_to: 'Chai',
        status_text: 'In QA'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Title 1');
        assert.equal(res.body.issue_text, 'Text 1');
        assert.equal(res.body.created_by, 'Functional Test');
        assert.equal(res.body.assigned_to, 'Chai');
        assert.equal(res.body.status_text, 'In QA');
        assert.isTrue(res.body.open);
        testId1 = res.body._id;
        done();
      });
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/' + project)
      .send({
        issue_title: 'Title 2',
        issue_text: 'Text 2',
        created_by: 'Functional Test'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Title 2');
        assert.equal(res.body.issue_text, 'Text 2');
        assert.equal(res.body.created_by, 'Functional Test');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        assert.isTrue(res.body.open);
        testId2 = res.body._id;
        done();
      });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/' + project)
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

  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/' + project)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtLeast(res.body.length, 2);
        done();
      });
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/' + project)
      .query({ open: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
          assert.propertyVal(issue, 'open', true);
        });
        done();
      });
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/' + project)
      .query({ open: true, created_by: 'Functional Test' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
          assert.propertyVal(issue, 'open', true);
          assert.propertyVal(issue, 'created_by', 'Functional Test');
        });
        done();
      });
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({
        _id: testId1,
        issue_text: 'Updated Text 1'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: testId1 });
        done();
      });
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({
        _id: testId2,
        issue_title: 'Updated Title 2',
        assigned_to: 'New Assignee',
        open: false
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: testId2 });
        done();
      });
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({
        issue_text: 'Text with missing id'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({
        _id: testId1
        // no fields to update
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: testId1 });
        done();
      });
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/' + project)
      .send({
        _id: '123invalidid',
        issue_text: 'Trying to update invalid id'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not update', _id: '123invalidid' });
        done();
      });
  });

  test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/' + project)
      .send({ _id: testId1 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully deleted', _id: testId1 });
        done();
      });
  });

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/' + project)
      .send({ _id: '123invalidid' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not delete', _id: '123invalidid' });
        done();
      });
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/' + project)
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });
});
