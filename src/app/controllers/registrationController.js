import { addMonths, parseISO } from 'date-fns';
import * as Yup from 'yup';
import Student from '../models/students';
import Plan from '../models/plans';
import Registration from '../models/registrations';

import RegistrationMail from '../jobs/registrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;
    /*
     * Verify if Student Exists
     */
    const studentExists = await Student.findByPk(student_id);
    if (!studentExists) {
      return res.status(400).json({ error: 'Student ID does not exists' });
    }

    /*
     * Verify if Plan Exists
     */
    const planExists = await Plan.findByPk(plan_id);
    if (!planExists) {
      return res.status(400).json({ error: 'Plan ID does not exists' });
    }

    const { duration, price } = planExists;

    const end_date = addMonths(parseISO(start_date), duration);
    const final_price = price * duration;

    const registration = await Registration.creasste({
      student_id,
      plan_id,
      start_date,
      end_date,
      price: final_price,
    });

    await Queue.add(RegistrationMail.key, {
      student: studentExists,
      plan: planExists,
      final_price,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const { id, student_id, plan_id, start_date } = req.body;
    /*
     * Verify if Student Exists
     */
    const studentExists = await Student.findByPk(student_id);
    if (!studentExists) {
      return res.status(400).json({ error: 'Student ID does not exists' });
    }

    /*
     * Verify if Plan Exists
     */
    const planExists = await Plan.findByPk(plan_id);
    if (!planExists) {
      return res.status(400).json({ error: 'Plan ID does not exists' });
    }

    const { duration, price } = planExists;

    const end_date = addMonths(parseISO(start_date), duration);
    const final_price = price * duration;

    // eslint-disable-next-line no-unused-vars
    const registration = await Registration.update(
      {
        student_id,
        plan_id,
        start_date,
        end_date,
        price: final_price,
      },
      { where: { id } }
    );

    return res
      .status(400)
      .json({ student_id, plan_id, start_date, end_date, final_price });
  }

  async index(req, res) {
    const registrations = await Registration.findAll();

    return res.json(registrations);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(400).json({ error: 'Registration ID not found' });
    }

    const registrationDeleted = await Registration.destroy({
      where: { id: req.params.id },
    });
    if (!registrationDeleted) {
      return res.status(400).json({ error: 'Registration not deleted' });
    }
    return res.json({ message: 'Registration deleted successfully' });
  }
}

export default new RegistrationController();
