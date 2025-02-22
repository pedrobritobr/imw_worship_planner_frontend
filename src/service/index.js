import axios from 'axios';

export async function sendLocationToAnalytics(pageTitle, location) {
  try {
    const headers = {
      keyword: import.meta.env.VITE_BRITO_VISITORS_ANALYTICS_KEYWORD,
    };
    const data = {
      origin: location,
      pageTitle,
    };
    const url = import.meta.env.VITE_BRITO_VISITORS_ANALYTICS_URL;

    await axios.post(url, data, { headers });
  } catch (error) {
    console.error(error);
  }
}

export async function requestLogin(user) {
  try {
    const headers = {
      keyword: import.meta.env.VITE_PLANNER_KEYWORD,
    };
    const url = `${import.meta.env.VITE_PLANNER_URL}/user/login`;
    const response = await axios.post(url, user, { headers });
    return response;
  } catch (error) {
    const errorMsg = error?.response?.data?.error || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    return { errorMsg };
  }
}

export function requestLogout() {
  try {
    localStorage.removeItem('user');
    return null;
  } catch (error) {
    console.log(error);
    return 'Erro ao remover usuário do localStorage';
  }
}

export async function requestRegisterUser(user) {
  try {
    const headers = {
      keyword: import.meta.env.VITE_PLANNER_KEYWORD,
    };
    const url = `${import.meta.env.VITE_PLANNER_URL}/user/`;
    const response = await axios.post(url, user, { headers });
    return response;
  } catch (error) {
    const errorMsg = error?.response?.data?.error || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    return { errorMsg };
  }
}

export async function uploadPlannerToCloud(planner, token) {
  try {
    const headers = {
      keyword: import.meta.env.VITE_PLANNER_KEYWORD,
      Authorization: token,
    };
    const url = `${import.meta.env.VITE_PLANNER_URL}/planner/`;

    if (!planner) {
      const { alert } = window;
      alert('Não há cronograma para ser enviado.');
    }

    const respone = await axios.post(url, { data: planner }, { headers });
    return respone;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function downloadPlannerFromCloud(token) {
  try {
    const headers = {
      keyword: import.meta.env.VITE_PLANNER_KEYWORD,
      Authorization: token,
    };
    const url = `${import.meta.env.VITE_PLANNER_URL}/planner/`;

    const response = await axios.get(url, { headers });

    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) return [];

    console.error(error);
    return null;
  }
}

export async function getChurches() {
  try {
    const headers = {
      keyword: import.meta.env.VITE_PLANNER_KEYWORD,
    };
    const url = `${import.meta.env.VITE_PLANNER_URL}/church/`;

    const response = await axios.get(url, { headers });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
