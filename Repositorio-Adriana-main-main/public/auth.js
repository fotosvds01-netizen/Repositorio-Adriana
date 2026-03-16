document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.auth-col form');
  const registerForm = document.querySelectorAll('.auth-col form')[1];

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-senha').value.trim();

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, senha }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.erro || 'Erro ao fazer login');
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuarioNome', data.usuario?.nome || '');
        localStorage.setItem('usuarioPapel', data.usuario?.papel || '');
        localStorage.setItem('usuarioEmail', data.usuario?.email || email);

        alert('Login realizado com sucesso!');
        window.location.href = 'painel.html';
      } catch (err) {
        alert('Erro ao conectar com o servidor');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('cad-email').value.trim();
      const senha = document.getElementById('cad-senha').value.trim();
      const senha2 = document.getElementById('cad-senha2').value.trim();

      if (senha !== senha2) {
        alert('As senhas não conferem');
        return;
      }

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, senha }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.erro || 'Erro ao cadastrar usuário');
          return;
        }

        alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
        document.getElementById('cad-senha').value = '';
        document.getElementById('cad-senha2').value = '';
      } catch (err) {
        alert('Erro ao conectar com o servidor');
      }
    });
  }
});

