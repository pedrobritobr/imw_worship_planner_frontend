import axios from 'axios';

class UserNotLogged extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotLogged';
  }
}

async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url,
      headers,
      data: data || {},
    };

    if (Object.values(config).some((value) => value === null || value === undefined)) {
      console.error('Requisição não realizada: Configuração inválida (URL, método ou outros valores ausentes).');
      return { success: false, errorMsg: 'Configuração inválida para a requisição.' };
    }

    const response = await axios(config);
    return { data: response.data, success: true };
  } catch (error) {
    console.error('Request error:', error);
    const errorMsg = error?.response?.data?.error || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    return {
      success: false,
      errorMsg,
      status: error?.response?.status,
    };
  }
}

export async function sendLocationToAnalytics(pageTitle, location) {
  const data = { origin: location, pageTitle };
  const url = import.meta.env.VITE_BRITO_VISITORS_ANALYTICS_URL;
  const headers = {
    keyword: import.meta.env.VITE_BRITO_VISITORS_ANALYTICS_KEYWORD,
  };

  return makeRequest('POST', url, data, headers);
}

export async function requestLogin(user) {
  const url = `${import.meta.env.VITE_PLANNER_URL}/user/login`;
  const headers = {
    keyword: import.meta.env.VITE_PLANNER_KEYWORD,
  };

  const result = await makeRequest('POST', url, user, headers);

  if (result.success && result.data) {
    localStorage.setItem('user', JSON.stringify(result.data));
  }

  return result;
}

export function requestLogout() {
  try {
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errorMsg: 'Erro ao remover usuário do localStorage',
    };
  }
}

export async function requestRegisterUser(user) {
  const url = `${import.meta.env.VITE_PLANNER_URL}/user/`;
  const headers = {
    keyword: import.meta.env.VITE_PLANNER_KEYWORD,
  };

  return makeRequest('POST', url, user, headers);
}

export async function uploadPlannerToCloud(planner) {
  if (!planner) {
    return {
      success: false,
      errorMsg: 'Não há cronograma para ser salvo.',
    };
  }

  const url = `${import.meta.env.VITE_PLANNER_URL}/planner/`;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = {
    keyword: import.meta.env.VITE_PLANNER_KEYWORD,
    Authorization: user.token,
  };

  return makeRequest('POST', url, { data: planner }, headers);
}

export async function downloadPlannerFromCloud() {
  const url = `${import.meta.env.VITE_PLANNER_URL}/planner/`;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = {
    keyword: import.meta.env.VITE_PLANNER_KEYWORD,
    Authorization: user.token,
  };

  const result = await makeRequest('GET', url, null, headers);

  if (result.success) return result.data;

  if (result.status === 404) return [];

  return null;
}

export async function getPlannerById(plannerId) {
  const url = `${import.meta.env.VITE_PLANNER_URL}/planner/${plannerId}`;

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    throw new UserNotLogged('Para consultar um roteiro é necessário estar autenticado.\nFaça o login ou cadastro.');
  }

  const headers = {
    keyword: import.meta.env.VITE_PLANNER_KEYWORD,
    Authorization: user.token,
  };

  const result = await makeRequest('GET', url, null, headers);

  if (!result.success) {
    throw new Error(result.errorMsg);
  }

  return result.data;
}

export async function getChurches() {
  const url = `${import.meta.env.VITE_PLANNER_URL}/church/`;
  const headers = {
    keyword: import.meta.env.VITE_PLANNER_KEYWORD,
  };

  const result = await makeRequest('GET', url, null, headers);

  if (!result.success) {
    throw new Error(result.errorMsg);
  }

  return result.data;
}

export async function postFeedback(formData) {
  const url = `${import.meta.env.VITE_PLANNER_URL}/feedback/`;
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    throw new UserNotLogged('Para enviar um feedback é necessário estar autenticado.\nFaça o login ou cadastro.');
  }

  const headers = {
    keyword: import.meta.env.VITE_PLANNER_KEYWORD,
    Authorization: user.token,
    'Content-Type': 'multipart/form-data',
  };

  const result = await makeRequest('POST', url, formData, headers);

  if (!result.success) {
    throw new Error(result.errorMsg);
  }

  return result.data;
}
