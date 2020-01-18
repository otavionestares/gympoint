import Mail from '../../lib/Mail';

class AnswerOrderMail {
  get key() {
    return 'AnswerOrderMail';
  }

  async handle({ data }) {
    const { student, helpOrder } = data;

    // SEND EMAIL
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Temos uma resposta para sua pergunta!',
      template: 'orderAnswer',
      context: {
        name: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    })
      // eslint-disable-next-line no-console
      .then(success => console.log('success: ', success))
      // eslint-disable-next-line no-console
      .catch(error => console.log('error: ', error));
  }
}

export default new AnswerOrderMail();
