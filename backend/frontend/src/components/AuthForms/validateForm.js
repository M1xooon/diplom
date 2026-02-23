const validateUsername = (username) => {
  if (!username) {
    return {
      ok: false,
      message: 'Username is required',
    };
  }

  if (username.length < 3) {
    return {
      ok: false,
      message: 'Username must be at least 3 characters long',
    };
  }

  if (username.length > 30) {
    return {
      ok: false,
      message: 'Username must not exceed 30 characters',
    };
  }

  // Должен начинаться с буквы и содержать только буквы, цифры, дефис, подчеркивание
  const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
  if (!usernamePattern.test(username)) {
    return {
      ok: false,
      message: 'Username must start with a letter and contain only letters, numbers, hyphens, and underscores',
    };
  }

  return {
    ok: true,
  };
};

/**
 * Валидация email
 */
const validateEmail = (email) => {
  if (!email) {
    return {
      ok: false,
      message: 'Email is required',
    };
  }

  // Базовая проверка формата email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return {
      ok: false,
      message: 'Please enter a valid email address',
    };
  }

  return {
    ok: true,
  };
};

/**
 * Валидация пароля
 */
const validatePassword = (password) => {
  if (!password) {
    return {
      ok: false,
      message: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      ok: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  // Проверка на заглавную букву
  if (!/[A-Z]/.test(password)) {
    return {
      ok: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  // Проверка на строчную букву
  if (!/[a-z]/.test(password)) {
    return {
      ok: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  // Проверка на цифру
  if (!/\d/.test(password)) {
    return {
      ok: false,
      message: 'Password must contain at least one digit',
    };
  }

  // Проверка на специальный символ
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      ok: false,
      message: 'Password must contain at least one special character',
    };
  }

  return {
    ok: true,
  };
};

/**
 * Валидация подтверждения пароля
 */
const validatePasswordConfirm = (password, passwordConfirm) => {
  if (!passwordConfirm) {
    return {
      ok: false,
      message: 'Please confirm your password',
    };
  }

  if (password !== passwordConfirm) {
    return {
      ok: false,
      message: 'Passwords do not match',
    };
  }

  return {
    ok: true,
  };
};

/**
 * Получить требования к паролю для отображения
 */
const getPasswordRequirements = (password) => {
  return [
    {
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      text: 'One uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'One lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    },
    {
      text: 'One digit (0-9)',
      met: /\d/.test(password),
    },
    {
      text: 'One special character (!@#$%^&*)',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];
};

export {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  getPasswordRequirements,
};
