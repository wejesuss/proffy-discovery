const form = document.getElementById('create-class');
const numberInput = document.getElementById('whatsapp');
const costInput = document.getElementById('cost');

const Validate = {
  apply(field, method) {
    if (Validate[method]) {
      const results = Validate[method](field.value);

      if (results && results.error) {
        Validate.insertErrors(field);
      } else {
        Validate.clearErrors(field);
      }
    }
  },
  Tel(value) {
    let error = null;

    const phoneRegex = /^(\+55) (0?\d{2}) (9\d{4,5}-\d{4}){1}$/;

    if (!value.match(phoneRegex)) {
      error = 'Número inválido';
    }

    return {
      value,
      error,
    };
  },
  isInvalid(event) {
    const inputs = document.querySelectorAll('input');
    const otherFields = document.querySelectorAll('select, textarea');
    let advice = false;

    function setAdvice(field) {
      if (field.value === '' || field.classList.contains('error')) {
        event.preventDefault();
        Validate.insertErrors(field);
        advice = true;
      }
    }

    inputs.forEach(setAdvice);
    otherFields.forEach(setAdvice);

    if (advice) {
      alert('Algum campo parece incorreto ou vazio, por favor, verifique-o.');
    }
  },
  insertErrors(field) {
    if (!field.classList.contains('error')) {
      field.classList.add('error');
    }
  },
  clearErrors(field) {
    if (field.classList.contains('error')) {
      field.classList.remove('error');
    }
  },
};

const Mask = {
  apply(input, func) {
    setTimeout(() => {
      input.value = Mask[func](input.value);
    }, 1);
  },
  formatPhone(value) {
    value = value.replace('+55', '');
    value = value.replace(/\D/g, '');
    value = value.slice(0, 18);

    if (value.length > 10) {
      value = value.replace(/(\d{2,3})(\d{5})(\d{4})/, '$1 $2-$3');
    }

    value = `+55 ${value}`;

    return value;
  },
  formatBRL(value) {
    value = value.replace(/\D/g, '');
    value = value.slice(0, 7);

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  },
};

numberInput.addEventListener('keydown', (event) => {
  Mask.apply(event.target, 'formatPhone');
});

costInput.addEventListener('keydown', (event) => {
  Mask.apply(event.target, 'formatBRL');
});

form.addEventListener('submit', (event) => {
  Validate.isInvalid(event);
});

numberInput.addEventListener('blur', (event) => {
  if (event.target.value !== '') {
    Validate.apply(event.target, 'Tel');
  }
});
