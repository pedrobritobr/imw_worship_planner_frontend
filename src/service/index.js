/* eslint-disable */
import axios from 'axios';

const validateUser = (user) => {
  const userDb = JSON.parse(localStorage.getItem('db_user'));

  if (user.email !== userDb.email) return { errorMsg: 'Email inválido' };
  if (user.password !== userDb.password) return { errorMsg:'Senha inválida' };

  const { password, ...userData } = userDb;
  return { user: userData };
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
    const errorMsg = error?.response?.data?.error || "Ocorreu um erro inesperado. Tente novamente mais tarde.";
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
    const errorMsg = error?.response?.data?.error || "Ocorreu um erro inesperado. Tente novamente mais tarde.";
    return { errorMsg };
  }
}

export async function uploadPlannerToCloud() {
  try {
    const worshipPlanner = JSON.parse(localStorage.getItem('imwWorshipPlanner'));
    console.log('worshipPlanner>> ', {data: worshipPlanner});

    const headers = { keyword: import.meta.env.VITE_PLANNER_KEYWORD };
    const url = `${import.meta.env.VITE_PLANNER_URL}/planner`;

    await axios.post(url, {data: worshipPlanner}, { headers });
    const { alert } = window;
    alert('Cronograma enviado com sucesso!');
  } catch (error) {
    console.error(error);
  }
};

export async function downloadPlannerFromCloud(user) {
  try {
    const headers = { keyword: import.meta.env.VITE_PLANNER_KEYWORD };
    const url = `${import.meta.env.VITE_PLANNER_URL}/planner`;

    console.log('headers>> ', headers);

    const response = await axios.get(url, {headers, data: {user_email: user.email}});
    console.log('response>> ', response.data);

    return;
    const { selectedDate: date, activities: acts, ministerSelected: minister } = response.data;
    setSelectedDate(new Date(date));
    setActivities(acts);
    setMinisterSelected(minister);
  } catch (error) {
    console.error(error);
  }
};
