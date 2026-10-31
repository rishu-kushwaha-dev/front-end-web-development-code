document.addEventListener('DOMContentLoaded', function () {
    var resetBtn = document.querySelector('.button-group input[type="button"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            var form = resetBtn.closest('form');
            if (form) form.reset();
        });
    }
});
