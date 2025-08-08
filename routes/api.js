'use strict';
const crypto = require('crypto');

module.exports = function (app) {
  const issuesList = [];

  app.route('/api/issues/:project')

    // GET - Lista de issues con filtros opcionales
    .get(function (req, res) {
      const { project } = req.params;
      const filters = req.query;  
      console.log("get", filters);

      let projectIssues = issuesList.filter(issue => issue.project === project);

      for (let key in filters) {
        projectIssues = projectIssues.filter(issue => {
          return issue[key]?.toString() === filters[key];
        });
      }

      res.json(projectIssues);
    })

    // POST - Crear nuevo issue
    .post(function (req, res) {
       
      const { project } = req.params;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to = "",
        status_text = ""
      } = req.body;

      // Validar campos requeridos
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const now = new Date();
      const newIssue = {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: now,
        updated_on: now,
        open: true,
        _id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        project
      };
      console.log("post", newIssue);
      issuesList.push(newIssue);
      return res.json(newIssue);
    })

    // PUT - Actualizar un issue
    .put(function (req, res) {
      const { project } = req.params;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      // Crear objeto con campos que realmente se van a actualizar
      const updateFields = {};
      Object.keys(req.body).forEach(key => {
        if (key !== '_id' && req.body[key] !== undefined && req.body[key] !== '') {
          updateFields[key] = req.body[key];
        }
      });

      // Si no hay campos para actualizar
      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      // Buscar el issue
      const issueIndex = issuesList.findIndex(
        issue => String(issue._id) === String(_id) && issue.project === project
      );

      if (issueIndex === -1) {
        return res.json({ error: 'could not update', _id });
      }
      console.log("put",updateFields);
      try {
        issuesList[issueIndex] = {
          ...issuesList[issueIndex],
          ...updateFields,
          updated_on: new Date()
        };
        return res.json({ result: 'successfully updated', _id });
      } catch (err) {
        return res.json({ error: 'could not update', _id });
      }
    })

    // DELETE - Eliminar un issue
    .delete(function (req, res) {
      const { project } = req.params;
      const { _id } = req.body;
      console.log("delete", _id);
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      const index = issuesList.findIndex(issue => issue.project === project && issue._id === _id);
      if (index === -1) {
        return res.json({ error: 'could not delete', _id });
      }

      issuesList.splice(index, 1);
      return res.json({ result: 'successfully deleted', _id });
    });
};
