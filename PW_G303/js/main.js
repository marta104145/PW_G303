// Funções para interatividade da página
document.addEventListener('DOMContentLoaded', function() {
    // Botão de adicionar perito
    const addButton = document.querySelector('.btn-add');
    if (addButton) {
        addButton.addEventListener('click', function() {
            alert('Funcionalidade para adicionar perito será implementada aqui');
        });
    }
    
    // Funcionalidade de busca
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Implementar lógica de busca
            console.log('Buscando: ' + this.value);
        });
    }
    
    // Ações de editar e excluir
    const editButtons = document.querySelectorAll('.fa-edit');
    const deleteButtons = document.querySelectorAll('.fa-trash');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            alert(`Editar perito: ${name}`);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            if (confirm(`Deseja excluir o perito: ${name}?`)) {
                // Implementar lógica de exclusão
                console.log(`Perito ${name} excluído`);
            }
        });
    });
});