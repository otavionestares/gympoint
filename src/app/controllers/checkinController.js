import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Checkin from '../models/checkins';
import Student from '../models/students';

class CheckIn {
  async store(req, res) {
    const student_id = req.params.id;
    // Check if student exists
    const studentExists = await Student.findByPk(student_id);
    if (!studentExists) {
      return res.status(404).json({ error: 'Student does not exists ' });
    }

    const sevenDaysAgo = subDays(new Date(), 7);
    const count_checkin = await Checkin.findAll({
      where: {
        created_at: { [Op.between]: [sevenDaysAgo, new Date()] },
        student_id,
      },
    });

    if (count_checkin.length >= 5) {
      return res.json({ message: 'You are allowed to check 5 times per week' });
    }

    const createCheckin = await Checkin.create({
      student_id,
    });
    return res.status(201).json(createCheckin);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const checkins = await Checkin.findAll({
      order: ['created_at'],
      limit: 10,
      offset: (page - 1) * 20,
    });
    return res.json(checkins);
  }
}

export default new CheckIn();
