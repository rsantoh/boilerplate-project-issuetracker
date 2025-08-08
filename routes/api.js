// 'use strict';
// const crypto = require('crypto');

// module.exports = function (app) {
//   const issuesList = [];

//   app.route('/api/issues/:project')

//     // GET - Lista de issues con filtros opcionales
//     .get(function (req, res) {
//       const { project } = req.params;
//       const filters = req.query;  
//       console.log("get", filters);

//       let projectIssues = issuesList.filter(issue => issue.project === project);

//       for (let key in filters) {
//         projectIssues = projectIssues.filter(issue => {
//           return issue[key]?.toString() === filters[key];
//         });
//       }

//       res.json(projectIssues);
//     })

//     // POST - Crear nuevo issue
//     .post(function (req, res) {

//       const { project } = req.params;
//       const {
//         issue_title,
//         issue_text,
//         created_by,
//         assigned_to = "",
//         status_text = ""
//       } = req.body;

//       // Validar campos requeridos
//       if (!issue_title || !issue_text || !created_by) {
//         return res.json({ error: 'required field(s) missing' });
//       }

//       const now = new Date();
//       const newIssue = {
//         issue_title,
//         issue_text,
//         created_by,
//         assigned_to,
//         status_text,
//         created_on: now,
//         updated_on: now,
//         open: true,
//         _id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
//         project
//       };
//       console.log("post", newIssue);
//       issuesList.push(newIssue);
//       return res.json(newIssue);
//     })

//     // PUT - Actualizar un issue
//     .put(function (req, res) {
//       const { project } = req.params;
//       const { _id } = req.body;

//       if (!_id) {
//         return res.json({ error: 'missing _id' });
//       }

//       // Crear objeto con campos que realmente se van a actualizar
//       const updateFields = {};
//       Object.keys(req.body).forEach(key => {
//         if (key !== '_id' && req.body[key] !== undefined && req.body[key] !== '') {
//           updateFields[key] = req.body[key];
//         }
//       });

//       // Si no hay campos para actualizar
//       if (Object.keys(updateFields).length === 0) {
//         return res.json({ error: 'no update field(s) sent', _id });
//       }

//       // Buscar el issue
//       const issueIndex = issuesList.findIndex(
//         issue => String(issue._id) === String(_id) && issue.project === project
//       );

//       if (issueIndex === -1) {
//         return res.json({ error: 'could not update', _id });
//       }
//       console.log("put",updateFields);
//       try {
//         issuesList[issueIndex] = {
//           ...issuesList[issueIndex],
//           ...updateFields,
//           updated_on: new Date()
//         };
//         return res.json({ result: 'successfully updated', _id });
//       } catch (err) {
//         return res.json({ error: 'could not update', _id });
//       }
//     })

//     // DELETE - Eliminar un issue
//     .delete(function (req, res) {
//       const { project } = req.params;
//       const { _id } = req.body;
//       console.log("delete", _id);
//       if (!_id) {
//         return res.json({ error: 'missing _id' });
//       }

//       const index = issuesList.findIndex(issue => issue.project === project && issue._id === _id);
//       if (index === -1) {
//         return res.json({ error: 'could not delete', _id });
//       }

//       issuesList.splice(index, 1);
//       return res.json({ result: 'successfully deleted', _id });
//     });
// };

'use strict';
const { error } = require('console');
const crypto = require('crypto');

const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  const issuesList = [];

  app.route('/api/issues/:project')

    // GET - Lista de issues con filtros opcionales
    .get(async (req, res) => {
      const { project } = req.params;
      try {
        const projectmodel = await ProjectModel.findOne({ name: project });
        if (!projectmodel) {
          res.json([{ error: "project not found" }]);
          return;
        }
        else {
          const issues = await IssueModel.find({
            projectId: projectmodel._id,
            ...req.query,
          });
          if (!issues) {
            res.json([{ error: "no issues found" }]);
            return;
          }
          res.json(issues);
          return;
        }

      } catch (err) {
        res.json({ error: "could not get", _id: _id });
      }
    })

    // POST - Crear nuevo issue
    .post(async (req, res) => {

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
      try {
        let projectModel = await ProjectModel.findOne({ name: project });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: project });
          projectModel = await projectModel.save();
        }
        const issueModel = new IssueModel({
          projectId: projectModel._id,
          issue_title: issue_title || '',
          issue_text: issue_text || '',
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || '',
          assigned_to: assigned_to || '',
          open: true,
          status_text: status_text || ''
        });
        const issue = await issueModel.save();
        res.json(issue);

      } catch (err) {
        console.log(err);
        res.json({ error: "could not post", _id: _id });
      }
    })

    // PUT - Actualizar un issue
    .put(async (req, res) => {
      const { project } = req.params;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" }); // corregido mensaje
      }

      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        (open === undefined || open === null)
      ) {
        return res.json({ error: "no update field(s) sent", _id }); // corregido mensaje
      }

      try {
        const projectModel = await ProjectModel.findOne({ name: project });
        if (!projectModel) {
          throw new Error("Project not found");
        }

        // Construir objeto con solo campos que se van a actualizar
        const updateFields = {};
        if (issue_title) updateFields.issue_title = issue_title;
        if (issue_text) updateFields.issue_text = issue_text;
        if (created_by) updateFields.created_by = created_by;
        if (assigned_to) updateFields.assigned_to = assigned_to;
        if (status_text) updateFields.status_text = status_text;
        if (open !== undefined && open !== null) updateFields.open = open;

        updateFields.updated_on = new Date();

        const updatedIssue = await IssueModel.findByIdAndUpdate(_id, updateFields, { new: true });

        if (!updatedIssue) {
          return res.json({ error: 'could not update', _id });
        }

        return res.json({ result: "successfully updated", _id });

      } catch (err) {
        return res.json({ error: 'could not update', _id });
      }
    })

    // DELETE - Eliminar un issue
    .delete(async (req, res) => {
      const { project } = req.params;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      try {
        // Verificar que el proyecto exista
        const projectModel = await ProjectModel.findOne({ name: project });
        if (!projectModel) {
          return res.json({ error: 'could not delete', _id });
        }

        const deletedIssue = await IssueModel.findOneAndDelete({ _id, projectId: projectModel._id });

        if (!deletedIssue) {
          return res.json({ error: 'could not delete', _id });
        }

        return res.json({ result: 'successfully deleted', _id });

      } catch (err) {
        return res.json({ error: 'could not delete', _id });
      }
    });
};
