'use strict';

module.exports = function (app) {
  const issuesList = [];
  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      const filters = req.query;
      let projectIssues = issuesList.filter(issue => issue.project === project);
      for (let key in filters) {
        projectIssues = projectIssues.filter(issue => {
          // Convertir booleanos en string para comparación simple
          return issue[key].toString() === filters[key];
        });
      }
      res.json(projectIssues);

    })

    .post(function (req, res) {
      console.log("post");

      const { project } = req.params;
      const { issue_title, issue_text, created_by, assigned_to = "", status_text = "" } = req.body;

      if (!project || !issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const now = new Date();
      const newIssue = {
        project,
        _id: issuesList.length + 1,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: now,
        updated_on: now,
        open: true,
        _id: issuesList.length + 1
      };
      issuesList.push(newIssue);
      console.log(issuesList);
      res.json(newIssue);
    })

    .put(function (req, res) {
      const { project } = req.params;
      const { _id } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      // Buscar el issue en la lista
      const issueIndex = issuesList.findIndex(issue => issue._id === _id);
      if (issueIndex === -1) {
        return res.json({ error: 'could not update', _id });
      }
      // Filtrar campos enviados
      const updateFields = {};
      Object.keys(req.body).forEach(key => {
        if (key !== '_id' && req.body[key] !== '' && req.body[key] !== undefined) {
          updateFields[key] = req.body[key];
        }
      });
      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }
      // Actualizar campos
      issuesList[issueIndex] = {
        ...issuesList[issueIndex],
        ...updateFields,
        updated_on: new Date()
      };
      return res.json({ result: 'successfully updated', _id });
    })

    .delete(function (req, res) {
      const { project } = req.params;
      const { _id } = req.body;
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
