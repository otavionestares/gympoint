import * as Yup from 'yup';
import Plan from '../models/plans';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    const { title } = req.body;

    const titleExists = await Plan.findOne({
      where: { title },
    });

    if (titleExists) {
      return res.status(400).json({ error: 'Plan title already exists' });
    }

    const plans = await Plan.create(req.body);
    return res.json(plans);
  }

  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async delete(req, res) {
    const planFound = Plan.findByPk(req.params.id);
    if (!planFound) {
      return res.status(402).json({ error: 'Plan not found' });
    }
    const planDeleted = await Plan.destroy({
      where: { id: req.params.id },
    });
    if (!planDeleted) {
      return res.status(402).json({ error: 'Delete plan error' });
    }
    return res.json({ message: 'Plan deleted successfully' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    // Check if title exists
    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    const plan = await Plan.findByPk(req.body.id);
    if (!plan) {
      return res.status(400).json({ error: 'ID not exists' });
    }
    if (planExists) {
      return res.status(400).json({ error: 'Title plan already exists' });
    }
    const { title, duration, price } = await plan.update(req.body);

    return res.json({ title, duration, price });
  }
}

export default new PlanController();
