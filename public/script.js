document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuNavegacao = document.querySelector('.menu-navegacao');
    menuToggle.addEventListener('click', function() {
        menuNavegacao.classList.toggle('ativo');
        menuToggle.classList.toggle('ativo');
    });
    const linksMenu = document.querySelectorAll('.lista-menu a');
    linksMenu.forEach(link => {
        link.addEventListener('click', function() {
            menuNavegacao.classList.remove('ativo');
            menuToggle.classList.remove('ativo');
        });
    });
});
function cadastrarLivro() {

    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const ano = document.getElementById("ano").value;
    const genero = document.getElementById("genero").value;

    if (!titulo || !autor || !ano || !genero) {
        alert("Preencha todos os campos!");
        return; 
    }

 let livro = ['titulo', 'autor', 'ano', 'genero'];

livro[1] = 'genero'; 


    fetch(api, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ titulo, autor, ano, genero })
    })
    .then(res => res.json()) 
    .then(() => {

        listarLivro();

        limparCampos();
    });
}

function listarLivro() {

    fetch(api)
    .then(res => res.json()) 
    .then(livro => {

        const tabela = document.getElementById("tabelaDeLivro");

        tabela.innerHTML = "";

        livro.forEach(livro => {

            tabela.innerHTML += `
                <tr>
                    <td>${livro.id}</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.ano}</td>
                    <td>${livro.genero}</td>
                    <td>
                        <button onclick="deletarLivro(${livro.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    });
}