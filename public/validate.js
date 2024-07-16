document.querySelector('form').addEventListener('submit', function(e) {
    let valid = true;
    let inputs = this.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
        if (input.value.trim() === '') {
            valid = false;
            alert(input.name + ' is required');
        }
    });
    if (!valid) e.preventDefault();
});
