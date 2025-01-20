/* eslint-disable */

const validateUser = (user) => {
  const userDb = JSON.parse(localStorage.getItem('db_user'));

  if (user.email !== userDb.email) return { errorMsg: 'Email inválido' };
  if (user.password !== userDb.password) return { errorMsg:'Senha inválida' };

  const { password, ...userData } = userDb;
  return { user: userData };
}

export function requestLogin(user) {
  try {
    const response = validateUser(user);
    if (response.errorMsg) {
      return response;
    }

    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  } catch (error) {
    console.log(error);

    return { errorMsg: 'Erro ao pegar usuário no localStorage' };
  }
}

export function requestLogout() {
  try {
    localStorage.removeItem('user');
    return null;
  } catch (error) {
    return 'Erro ao remover usuário do localStorage';
  }
}

export function requestRegisterUser(user) {
  try {
    console.log(user);

    console.log('salvando usuario no localStorage');
    localStorage.setItem('db_user', JSON.stringify(user));
    console.log('usuario salvo no localStorage');
    return null;
  } catch (error) {
    return 'Erro ao inserir usuário no localStorage';
  }
}


export async function exportData(data) {
  try {
    console.log('data>> ', data);
    return;
    const headers = { keyword: import.meta.env.VITE_PLANNER_KEYWORD };
    const url = `${import.meta.env.VITE_PLANNER_URL}/planner`;

    await axios.post(url, data, { headers });
    const { alert } = window;
    alert('Cronograma enviado com sucesso!');
  } catch (error) {
    console.error(error);
  }
};

export async function importData() {
  try {
    const headers = { keyword: import.meta.env.VITE_PLANNER_KEYWORD };
    const url = `${import.meta.env.VITE_PLANNER_URL}/last-planner`;

    const response = await axios.get(url, { headers });
    return response.data;
    const { selectedDate: date, activities: acts, ministerSelected: minister } = response.data;
    setSelectedDate(new Date(date));
    setActivities(acts);
    setMinisterSelected(minister);
  } catch (error) {
    console.error(error);
  }
};
