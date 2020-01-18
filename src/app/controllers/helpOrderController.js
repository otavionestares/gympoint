import * as Yup from 'yup';
import HelpOrder from '../models/helpOrders';
import Student from '../models/students';

import AnswerOrderMail from '../jobs/answerOrderMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required('Question is required'),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { question } = req.body;
    const student_id = req.params.id;
    // Check if Student ID exists
    const studentExists = await Student.findByPk(student_id);
    if (!studentExists) {
      return res.status(404).json({ error: 'Student ID not exists' });
    }

    const helpOrder = await HelpOrder.create({ question, student_id });
    return res.status(200).json(helpOrder);
  }

  async index(req, res) {
    // Check if Student exists
    const student_id = req.params.id;
    const studentExists = await Student.findByPk(student_id);
    if (!studentExists) {
      return res.status(404).json({ error: 'Student ID not exists' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id },
    });
    if (helpOrders.length === 0) {
      return res.json({ message: 'There is no questions for this student' });
    }

    return res.json(helpOrders);
  }

  async answer(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(id);
    const student = await Student.findByPk(helpOrder.student_id);

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order not found' });
    }

    if (helpOrder.answer !== null) {
      return res.status(400).json({ error: 'Order already answer' });
    }
    const updateAnswer = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerOrderMail.key, {
      student,
      helpOrder,
    });

    return res.json(updateAnswer);
  }
}
export default new HelpOrderController();
