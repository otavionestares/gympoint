import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, final_price } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Parabéns! Matrícula realizada.',
      template: 'newRegistration',
      context: {
        name: student.name,
        plan: plan.title,
        duration: plan.duration,
        price: plan.price,
        totalPrice: final_price,
      },
    })
      .then(success => console.log('success: ', success))
      .catch(error => console.log('error: ', error));
  }
}

export default new RegistrationMail();
