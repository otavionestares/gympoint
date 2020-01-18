import * as Yup from 'yup';
import Student from '../models/students';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      age: Yup.number().required(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ error: 'E-mail already exists' });
    }

    const { name, email, age, height, weight } = await Student.create(req.body);
    return res.json({ name, email, age, height, weight });
  }

  async update(req, res) {
    const student = await Student.findByPk(req.body.id);
    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    // Check if user is tryng to change e-mail, if yes, check if email exists
    if (req.body.email !== student.email) {
      const emailExists = await Student.findOne({
        where: { email: req.body.email },
      });
      if (emailExists) {
        return res.status(400).json({ error: 'E-mail was taken' });
      }
    }
    const { id, name, email, age, height, weight } = await student.update(
      req.body
    );
    return res.json({ id, name, email, age, height, weight });
  }

  async index(req, res) {
    const students = await Student.findAll();
    return res.json(students);
  }
}

export default new StudentController();
